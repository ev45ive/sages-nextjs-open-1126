export function instrument(code){
  const {parser,traverse,types:t,generator}=Babel.packages;const walk=traverse.default||traverse,generate=generator.default||generator;
  const ast=parser.parse(code,{sourceType:'script',plugins:['jsx','typescript']});const results=[],candidates=[],jsxIdentifiers=[];
  walk(ast,{FunctionDeclaration(path){if(path.parentPath.isProgram()&&/^[A-Z]/.test(path.node.id?.name||'')){
    for(const p of path.get('body.body')){
      if(p.isFunctionDeclaration())candidates.push({component:path,statement:p,fn:p,name:p.node.id?.name});
      if(p.isVariableDeclaration()&&p.node.kind==='const'&&p.node.declarations.length===1){const d=p.get('declarations.0');if(d.get('id').isIdentifier()&&d.get('init').isArrowFunctionExpression())candidates.push({component:path,statement:p,fn:d.get('init'),name:d.node.id.name});}
    }
  }},JSXAttribute(path){const value=path.get('value');if(!value.isJSXExpressionContainer())return;const expr=value.get('expression');if(expr.isArrowFunctionExpression()||expr.isFunctionExpression())results.push({state:'skip',name:`inline (${path.node.name.name})`,reason:'Funkcja inline w JSX; zakres PoC obejmuje nazwane deklaracje.'});else if(expr.isIdentifier())jsxIdentifiers.push(expr);}});
  const reported=new Set();
  for(const ref of jsxIdentifiers){const binding=ref.scope.getBinding(ref.node.name);if(!binding||candidates.some(candidate=>candidate.component.scope.getBinding(candidate.name)===binding))continue;const declaration=binding.path;const isFunction=declaration.isFunctionDeclaration()||declaration.isVariableDeclarator()&&(declaration.get('init').isArrowFunctionExpression()||declaration.get('init').isFunctionExpression());if(isFunction&&!reported.has(binding)){reported.add(binding);results.push({state:'skip',name:ref.node.name,reason:'Funkcja znajduje się w komponencie lub zakresie nieobjętym analizą.'});}}
  walk(ast,{VariableDeclarator(path){if(path.parentPath.parentPath.isProgram()&&path.get('id').isIdentifier()&&/^[A-Z]/.test(path.node.id.name)&&path.get('init').isArrowFunctionExpression())results.push({state:'skip',name:path.node.id.name,reason:'Komponent strzałkowy poza zakresem analizy.'});}});
  for(const item of candidates){const {component,statement,fn,name}=item;if(!name)continue;const binding=component.scope.getBinding(name);if(!binding)continue;
    const usedInJSX=binding.referencePaths.some(p=>p.parentPath.isJSXExpressionContainer()&&p.parentPath.parentPath.isJSXAttribute());if(!usedInJSX)continue;
    let reason='';const siblings=component.get('body.body');const index=siblings.findIndex(p=>p.node===statement.node);
    if(siblings.slice(0,index).some(p=>!p.isVariableDeclaration()&&!p.isFunctionDeclaration()&&!p.isExpressionStatement()&&!p.isEmptyStatement()&&!p.isTSTypeAliasDeclaration()&&!p.isTSInterfaceDeclaration()))reason='Przed deklaracją występuje warunek, return lub inny przepływ sterowania.';
    if(component.scope.getBinding('React')||component.scope.getBinding('lab'))reason='Nazwa React lub lab koliduje z nazwą wstrzykiwaną przez PoC.';
    if(binding.referencePaths.some(p=>!(p.parentPath.isJSXExpressionContainer()&&p.parentPath.parentPath.isJSXAttribute())))reason='Funkcja jest używana poza bezpośrednim atrybutem JSX.';
    if(fn.node.async||fn.node.generator)reason='Funkcje async i generatory są poza zakresem.';
    if(!binding.constant||binding.referencePaths.some(p=>p.node.start<statement.node.start))reason='Zmienny binding lub użycie przed deklaracją (hoisting).';
    const deps=new Set();
    fn.traverse({ThisExpression(){reason='Funkcja używa this.'},ReferencedIdentifier(path){if(path.findParent(p=>p.isTSType()))return;const n=path.node.name;if(n==='arguments'||n==='eval'){reason=`Niedozwolone odwołanie: ${n}.`;return;}const b=path.scope.getBinding(n);if(!b){if(!['React','console','Math','Number','String','Boolean','JSON','undefined'].includes(n))reason=`Nieznany binding: ${n}.`;return;}
      if(b===binding){reason='Rekurencja lub odwołanie do własnej funkcji.';return;}
      if(b.scope===component.scope){if(b.kind!=='const'&&b.kind!=='param'){reason=`Zmienny binding: ${n}.`;return;}if(!b.constant){reason=`Binding ${n} jest zmieniany.`;return;}if(b.identifier.start>statement.node.start){reason=`Zależność ${n} jest deklarowana później.`;return;}deps.add(n);return;}
      if(b.scope.path.isProgram()){reason=`Zewnętrzny binding ${n} jest poza zakresem PoC.`;return;}
      if(!b.scope.path.findParent(p=>p===fn)&&b.scope.path!==fn){reason=`Złożony zakres bindingu ${n}.`;}
    }});
    if(reason){results.push({state:'skip',name,reason});continue;}
    const id=`${component.node.id.name}.${name}`;const depNodes=[...deps].sort().map(n=>t.identifier(n));
    depNodes.push(t.callExpression(t.memberExpression(t.identifier('lab'),t.identifier('memoKey')),[t.stringLiteral(id)]));
    const original=fn.isFunctionDeclaration()?t.functionExpression(fn.node.id,fn.node.params,fn.node.body,fn.node.generator,fn.node.async):t.cloneNode(fn.node,true);
    if(fn.isFunctionDeclaration()){original.returnType=fn.node.returnType;original.typeParameters=fn.node.typeParameters;}
    const hooked=t.callExpression(t.memberExpression(t.identifier('React'),t.identifier('useCallback')),[original,t.arrayExpression(depNodes)]);
    const marked=t.callExpression(t.memberExpression(t.identifier('lab'),t.identifier('mark')),[t.stringLiteral(id),hooked]);
    if(fn.isFunctionDeclaration())statement.replaceWith(t.variableDeclaration('const',[t.variableDeclarator(t.identifier(name),marked)]));else fn.replaceWith(marked);
    results.push({state:'ok',name:id,deps:[...deps].sort()});
  }
  const wrappers=new Map();
  walk(ast,{JSXOpeningElement(path){const namePath=path.get('name');if(!namePath.isJSXIdentifier())return;const name=namePath.node.name;if(!/^[A-Z]/.test(name))return;
    const binding=path.scope.getBinding(name);if(!binding||!binding.path.isFunctionDeclaration()||!binding.path.parentPath.isProgram()){results.push({state:'skip',name:`komponent ${name}`,reason:'PoC obejmuje nazwane funkcje komponentów na poziomie pliku.'});return;}
    const owner=path.findParent(p=>p.isFunctionDeclaration()&&p.parentPath.isProgram());if(!owner){results.push({state:'skip',name:`komponent ${name}`,reason:'Użycie JSX poza funkcją komponentu na poziomie pliku.'});return;}
    if(path.scope.getBinding('lab')){results.push({state:'skip',name:`komponent ${name}`,reason:'Nazwa lab koliduje z instrumentacją.'});return;}
    let entry=wrappers.get(binding);if(!entry){const alias=path.scope.getProgramParent().generateUidIdentifier(`memo_${name}`);entry={alias,name,id:`component:${name}`};wrappers.set(binding,entry);results.push({state:'component',name});}
    namePath.replaceWith(t.jsxIdentifier(entry.alias.name));const closing=path.parentPath.get('closingElement');if(closing.node)closing.get('name').replaceWith(t.jsxIdentifier(entry.alias.name));
  }});
  for(const {alias,name,id} of wrappers.values())ast.program.body.push(t.variableDeclaration('const',[t.variableDeclarator(alias,t.callExpression(t.memberExpression(t.identifier('lab'),t.identifier('memoComponent')),[t.stringLiteral(id),t.identifier(name)]))]));
  const groupsToWrap=[];let keySite=0;
  walk(ast,{JSXExpressionContainer(path){const expr=path.get('expression');if(!expr.isCallExpression())return;const callee=expr.get('callee');if(!callee.isMemberExpression()||callee.node.computed||!callee.get('property').isIdentifier({name:'map'}))return;
    if(path.scope.getBinding('lab')){results.push({state:'skip',name:'map',reason:'Nazwa lab koliduje z instrumentacją.'});return;}
    const parent=path.parentPath;if(!parent.isJSXElement()){results.push({state:'skip',name:'map',reason:'Map nie znajduje się bezpośrednio w JSX.'});return;}
    const callback=expr.get('arguments.0');if(!callback?.isArrowFunctionExpression()||!callback.get('body').isJSXElement()){results.push({state:'skip',name:'map',reason:'PoC obsługuje map z bezpośrednim zwrotem jednego elementu JSX.'});return;}
    const element=callback.get('body');const attrs=element.get('openingElement.attributes');const key=attrs.find(a=>a.isJSXAttribute()&&a.get('name').isJSXIdentifier({name:'key'}));
    if(attrs.some(a=>a.isJSXSpreadAttribute())){results.push({state:'skip',name:'map',reason:'Spread props może wpływać na key.'});return;}
    if(!key||!key.get('value').isJSXExpressionContainer()){results.push({state:'skip',name:'map',reason:'Brak istniejącego key={wyrażenie}.'});return;}
    if(groupsToWrap.some(g=>g.parent.node===parent.node)){results.push({state:'skip',name:'map',reason:'Więcej niż jedno map w jednym elemencie poza zakresem PoC.'});return;}
    const value=key.get('value.expression');if(value.scope.getBinding('lab')){results.push({state:'skip',name:'map',reason:'Nazwa lab w callbacku map koliduje z instrumentacją.'});return;}
    const id=`key:${++keySite}`;value.replaceWith(t.callExpression(t.memberExpression(t.identifier('lab'),t.identifier('makeKey')),[t.stringLiteral(id),t.cloneNode(value.node,true)]));
    groupsToWrap.push({parent,id});results.push({state:'key',name:id});
  }});
  for(const {parent,id} of groupsToWrap.reverse()){const expression=t.callExpression(t.memberExpression(t.identifier('lab'),t.identifier('group')),[t.stringLiteral(id),t.cloneNode(parent.node,true)]);if(parent.parentPath.isJSXElement()||parent.parentPath.isJSXFragment())parent.replaceWith(t.jsxExpressionContainer(expression));else parent.replaceWith(expression);}
  const transformed=generate(ast,{comments:true}).code;
  const js=Babel.transform(transformed,{filename:'example.tsx',sourceType:'script',presets:['typescript',['react',{runtime:'classic'}]]}).code;
  return {transformed,js,results};
}
