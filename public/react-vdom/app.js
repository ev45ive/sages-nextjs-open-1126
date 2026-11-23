import { examples } from './examples.js';
import { startFrame } from './sandbox.js';
import { instrument } from './instrument.js';
import { diffNode } from './diff.js';
const cases=document.getElementById('cases'), status=document.getElementById('status'), tree=document.getElementById('tree'), diagnostics=document.getElementById('diagnostics'), compiler=document.getElementById('compiler'), diffToggle=document.getElementById('diff'), treeView=document.getElementById('tree-view'), rerender=document.getElementById('rerender');
examples.forEach((example,index)=>{const option=document.createElement('option');option.value=index;option.textContent=example.title;cases.append(option);});
let ready=false,editor=null,model=null,revision=0,session=0,sentVersion=null,runTimer=null,analysisTimer=null,analysisId=0,jsxColors=null;
let currentTree=null,diffSnapshot=null;
const iframe=document.createElement('iframe');iframe.sandbox='allow-scripts';iframe.hidden=true;iframe.title='React';const token=crypto.randomUUID();
const reactTypes=`declare namespace JSX {
  interface Element {}
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { key?: string | number; }
  interface IntrinsicElements {
    [name: string]: { key?: string | number; id?: string; className?: string; title?: string; onClick?: () => void; children?: unknown };
  }
}
declare namespace React {
  function createElement(type: unknown, props: unknown, ...children: unknown[]): JSX.Element;
  function useState<T>(initial: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];
  function useRef<T>(initial: T): { current: T };
  function useCallback<T extends (...args: any[]) => any>(fn: T, deps: readonly unknown[]): T;
  function memo<P>(component: (props: P) => JSX.Element): (props: P) => JSX.Element;
}`;
iframe.srcdoc=`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>(${startFrame.toString()})(${JSON.stringify(token)})<\/script></body></html>`;document.body.append(iframe);
function updateJsxColors(){
  if(!editor||!model||!window.ts||!jsxColors)return;
  try{
    const text=model.getValue();
    const file=ts.createSourceFile('App.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const decorations=[];
    function add(start,end,className){
      if(end<=start)return;
      decorations.push({range:monaco.Range.fromPositions(model.getPositionAt(start),model.getPositionAt(end)),options:{inlineClassName:className}});
    }
    function visit(node){
      if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)||ts.isJsxClosingElement(node)){
        const tag=node.tagName;
        const tagText=tag.getText(file);
        add(tag.getStart(file),tag.end,/^[A-Z]/.test(tagText)?'jsx-component':'jsx-tag');
        const children=node.getChildren(file);
        for(const child of children){
          if(child.kind===ts.SyntaxKind.LessThanToken||child.kind===ts.SyntaxKind.LessThanSlashToken||child.kind===ts.SyntaxKind.GreaterThanToken||child.kind===ts.SyntaxKind.SlashToken||child.kind===ts.SyntaxKind.SlashGreaterThanToken)add(child.getStart(file),child.end,'jsx-delimiter');
        }
        if(node.attributes)for(const attr of node.attributes.properties){
          if(ts.isJsxAttribute(attr))add(attr.name.getStart(file),attr.name.end,'jsx-attribute');
        }
      }
      if(ts.isJsxOpeningFragment(node)||ts.isJsxClosingFragment(node))add(node.getStart(file),node.end,'jsx-delimiter');
      if(ts.isJsxExpression(node)){
        const start=node.getStart(file),end=node.end;
        if(text[start]==='{')add(start,start+1,'jsx-brace');
        if(end>start&&text[end-1]==='}')add(end-1,end,'jsx-brace');
      }
      ts.forEachChild(node,visit);
    }
    visit(file);
    jsxColors.set(decorations);
  }catch(err){
    jsxColors.clear();
  }
}

const base='https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/';
let workerBlobUrl=null;
window.MonacoEnvironment={getWorker(_moduleId,label){
  const text=`self.MonacoEnvironment = { baseUrl: ${JSON.stringify(base)} }; importScripts(${JSON.stringify(base+'vs/base/worker/workerMain.js')});`;
  if(!workerBlobUrl)workerBlobUrl=URL.createObjectURL(new Blob([text],{type:'text/javascript'}));
  const worker=new Worker(workerBlobUrl,{name:`monaco-${label}`});
  worker.addEventListener('error',()=>{status.textContent='Błąd workera';status.className='error';});
  return worker;
}};
function message(value){if(typeof value==='string')return value;if(!value)return '';return [value.messageText,...(value.next||[]).map(message)].join(' ');}
function queueAnalysis(){
  if(!model)return;
  clearTimeout(analysisTimer);const current=++analysisId,version=model.getVersionId();
  analysisTimer=setTimeout(async()=>{
    try{
      const factory=await monaco.languages.typescript.getTypeScriptWorker(),worker=await factory(model.uri);
      const [syntax,semantic]=await Promise.all([worker.getSyntacticDiagnostics(model.uri.toString()),worker.getSemanticDiagnostics(model.uri.toString())]);
      if(current!==analysisId||version!==model.getVersionId())return;
      diagnostics.replaceChildren();
      for(const d of [...syntax,...semantic].slice(0,6)){
        const pos=model.getPositionAt(d.start||0),button=document.createElement('button');button.className='diag';button.type='button';button.textContent=`${pos.lineNumber}:${pos.column} · ${message(d.messageText)}`;
        button.onclick=()=>{editor.revealPositionInCenter(pos);editor.setPosition(pos);editor.focus();};diagnostics.append(button);
      }
    }catch(err){if(current===analysisId){diagnostics.textContent=`TypeScript: ${err.message||err}`;}}
  },350);
}
function updateSource(){
  if(!model)return;revision=0;sentVersion=null;tree.classList.add('stale');tree.inert=true;rerender.disabled=true;compiler.disabled=true;diffToggle.disabled=!diffSnapshot;
  clearTimeout(runTimer);status.textContent='Aktualizowanie…';status.className='pending';
  updateJsxColors();queueAnalysis();runTimer=setTimeout(run,450);
}
function run(){
  if(!ready||!model)return;
  if(!window.Babel){status.textContent='Błąd ładowania Babel';status.className='error';return;}
  try{
    const result=instrument(model.getValue());session++;revision=0;sentVersion=model.getVersionId();
    iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'run',session,code:result.js},'*');
  }catch(e){status.textContent=`Błąd: ${e.message}`;status.className='error';revision=0;tree.classList.add('stale');}
}
cases.addEventListener('change',()=>{diffSnapshot=null;diffToggle.checked=false;currentTree=null;if(model)model.setValue(examples[Number(cases.value)].code);});
rerender.addEventListener('click',()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'rerender'},'*'));
compiler.addEventListener('change',()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'compiler',enabled:compiler.checked},'*'));
treeView.addEventListener('change',displayTree);
diffToggle.addEventListener('change',()=>{
  diffSnapshot=diffToggle.checked&&currentTree?structuredClone(currentTree):null;
  if(!diffSnapshot)diffToggle.checked=false;
  diffToggle.disabled=!revision&&!diffSnapshot;
  displayTree();
});
window.addEventListener('message',e=>{
  const m=e.data;if(e.source!==iframe.contentWindow||!m||m.source!=='react-vdom-lab'||m.token!==token)return;
  if(m.type==='ready'){ready=true;if(model){clearTimeout(runTimer);run();}}
  if(m.type==='error'&&(m.session===session||m.session===0)&&(!model||sentVersion===model.getVersionId()||m.session===0)){status.textContent=`Błąd: ${m.message}`;status.className='error';tree.classList.add('stale');tree.inert=true;revision=0;}
  if(m.type==='tree'&&m.session===session&&model&&sentVersion===model.getVersionId()){
    revision=m.revision;status.textContent='Gotowe';status.className='';tree.classList.remove('stale');tree.inert=false;rerender.disabled=false;
    compiler.disabled=!m.hasComponents;compiler.checked=!!m.compilerEnabled;currentTree=m.tree;diffToggle.disabled=false;displayTree();
  }
});
function displayTree(){
  if(!currentTree)return;
  tree.replaceChildren(renderNode(diffSnapshot?diffNode(diffSnapshot,currentTree):currentTree));
}
function renderNode(node){
  if(treeView.value==='json')return renderJsonNode(node);
  const d=document.createElement('details');d.open=true;
  for(const mark of node.marks||[])d.classList.add(mark);
  if(node.kind==='component')d.classList.add('component-node');if(node.rendered)d.classList.add('rendered');
  const s=document.createElement('summary'),label=document.createElement('span');label.className=node.kind;label.textContent=node.label;s.append(label);
  if(node.key!=null){const key=document.createElement('span');key.className='meta';key.textContent=` · key=${node.key}`;s.append(key);}
  if(node.memoId&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='M';b.setAttribute('aria-label',`Memo komponentu ${node.label}`);b.setAttribute('aria-pressed',String(node.memoEnabled));b.onclick=e=>{e.preventDefault();e.stopPropagation();iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle',id:node.memoId},'*');};s.append(b);}
  if(node.groupId&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='K';b.setAttribute('aria-label',`Klucze ${node.groupId}`);b.setAttribute('aria-pressed',String(node.keyEnabled));b.onclick=e=>{e.preventDefault();e.stopPropagation();iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle-key',id:node.groupId},'*');};s.append(b);}
  const labels={added:'dodany',removed:'usunięty',changed:'zmieniony',moved:'przesunięty'};
  for(const mark of node.marks||[]){const badge=document.createElement('span');badge.className='diff-label';badge.textContent=`[${labels[mark]}]`;s.append(badge);}
  d.append(s);
  for(const prop of node.props){
    const row=document.createElement('div');row.className='prop';const name=document.createElement('span');name.className='meta';name.textContent=prop.key+': ';row.append(name);
    if(prop.handler&&!node.removed){const b=document.createElement('button');b.type='button';b.className='handler';b.textContent=prop.text;b.setAttribute('aria-label',`Uruchom ${prop.key} ${prop.text}`);b.onclick=()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'invoke',revision,handler:prop.handler},'*');row.append(b);}else{const value=document.createElement('span');value.textContent=prop.text;row.append(value);}
    if(prop.id&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='M';b.setAttribute('aria-label',`Memo ${prop.id}`);b.setAttribute('aria-pressed',String(prop.enabled));b.onclick=()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle',id:prop.id},'*');row.append(b);}
    d.append(row);
  }
  for(const child of node.children)d.append(renderNode(child));return d;
}
function renderJsonNode(node){
  const d=document.createElement('details');d.open=true;
  for(const mark of node.marks||[])d.classList.add(mark);
  if(node.kind==='component')d.classList.add('component-node');if(node.rendered)d.classList.add('rendered');
  const summary=document.createElement('summary');
  const type=node.kind==='host'&&node.label.startsWith('<')?node.label.slice(1,-1):node.kind==='text'?'#text':node.label;
  const prefix=document.createElement('span');prefix.className='meta';prefix.textContent='{ type: ';summary.append(prefix);
  const label=document.createElement('span');label.className=node.kind;label.textContent=JSON.stringify(type);summary.append(label);
  if(node.key!=null){const key=document.createElement('span');key.className='meta';key.textContent=`, key: ${JSON.stringify(node.key)}`;summary.append(key);}
  if(node.memoId&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='M';b.setAttribute('aria-label',`Memo komponentu ${node.label}`);b.setAttribute('aria-pressed',String(node.memoEnabled));b.onclick=e=>{e.preventDefault();e.stopPropagation();iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle',id:node.memoId},'*');};summary.append(b);}
  if(node.groupId&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='K';b.setAttribute('aria-label',`Klucze ${node.groupId}`);b.setAttribute('aria-pressed',String(node.keyEnabled));b.onclick=e=>{e.preventDefault();e.stopPropagation();iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle-key',id:node.groupId},'*');};summary.append(b);}
  const labels={added:'dodany',removed:'usunięty',changed:'zmieniony',moved:'przesunięty'};
  for(const mark of node.marks||[]){const badge=document.createElement('span');badge.className='diff-label';badge.textContent=`[${labels[mark]}]`;summary.append(badge);}
  d.append(summary);
  if(node.kind==='text'){
    const value=document.createElement('div');value.className='json-line';
    value.textContent='value: '+(node.label.startsWith('#text ')?node.label.slice(6):node.label.startsWith('tekst: ')?node.label.slice(7):JSON.stringify(node.label))+',';
    d.append(value);
  }
  const propsOpen=document.createElement('div');propsOpen.className='json-line';propsOpen.textContent=node.props.length?'props: {':'props: {},';d.append(propsOpen);
  for(const prop of node.props){
    const row=document.createElement('div');row.className='json-prop';const name=document.createElement('span');name.className='meta';name.textContent=prop.key+': ';row.append(name);
    if(prop.handler&&!node.removed){const b=document.createElement('button');b.type='button';b.className='handler';b.textContent=prop.text;b.setAttribute('aria-label',`Uruchom ${prop.key} ${prop.text}`);b.onclick=()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'invoke',revision,handler:prop.handler},'*');row.append(b);}else{const value=document.createElement('span');value.textContent=prop.text;row.append(value);}
    if(prop.id&&!node.removed){const b=document.createElement('button');b.type='button';b.className='memo';b.textContent='M';b.setAttribute('aria-label',`Memo ${prop.id}`);b.setAttribute('aria-pressed',String(prop.enabled));b.onclick=()=>iframe.contentWindow.postMessage({source:'react-vdom-lab',token,type:'toggle',id:prop.id},'*');row.append(b);}
    const comma=document.createElement('span');comma.className='meta';comma.textContent=',';row.append(comma);d.append(row);
  }
  if(node.props.length){const propsClose=document.createElement('div');propsClose.className='json-line';propsClose.textContent='},';d.append(propsClose);}
  const childrenOpen=document.createElement('div');childrenOpen.className='json-children';childrenOpen.textContent=node.children.length?'children: [':'children: []';d.append(childrenOpen);
  for(const child of node.children)d.append(renderNode(child));
  if(node.children.length){const childrenClose=document.createElement('div');childrenClose.className='json-children';childrenClose.textContent=']';d.append(childrenClose);}
  const close=document.createElement('div');close.className='meta';close.textContent='}';d.append(close);
  return d;
}
function initialize(){
  require.config({paths:{vs:base+'vs'}});
  require(['vs/editor/editor.main'],()=>{try{
    const tsApi=monaco.languages.typescript;
    tsApi.typescriptDefaults.setCompilerOptions({target:tsApi.ScriptTarget.ES2020,module:tsApi.ModuleKind.None,jsx:tsApi.JsxEmit.React,strict:true,allowNonTsExtensions:true,noEmit:true});
    tsApi.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:false,noSyntaxValidation:false});
    tsApi.typescriptDefaults.addExtraLib(reactTypes,'file:///lab/react-minimal.d.ts');
    model=monaco.editor.createModel(examples[0].code,'typescript',monaco.Uri.parse('file:///lab/App.tsx'));
    editor=monaco.editor.create(document.getElementById('editor'),{model,theme:'vs-dark',automaticLayout:true,minimap:{enabled:false},fontSize:14,scrollBeyondLastLine:false});
    jsxColors=editor.createDecorationsCollection();model.onDidChangeContent(updateSource);cases.disabled=false;updateSource();
  }catch(err){status.textContent=`Błąd: ${err.message||err}`;status.className='error';}},err=>{status.textContent=`Błąd: ${err.message||err}`;status.className='error';});
}

initialize();
