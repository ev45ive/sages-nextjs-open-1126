function sameType(a,b){
  return a.kind===b.kind&&(a.kind==='text'||a.label===b.label);
}
function compareProps(node){
  return JSON.stringify(node.props.filter(prop=>!prop.handler).map(prop=>[prop.key,prop.comparison===undefined?prop.text:prop.comparison]).sort(([a],[b])=>a.localeCompare(b)));
}
function flagged(node,mark){
  return {...node,marks:[mark],removed:mark==='removed',children:node.children.map(child=>flagged(child,mark))};
}
export function diffNode(oldNode,newNode){
  const marks=[];
  if((newNode.kind==='text'&&oldNode.label!==newNode.label)||compareProps(oldNode)!==compareProps(newNode))marks.push('changed');
  return {...newNode,marks,children:diffChildren(oldNode.children,newNode.children)};
}
function diffChildren(oldChildren,newChildren){
  const oldCounts=new Map(),newCounts=new Map();
  for(const node of oldChildren)if(node.key!=null)oldCounts.set(node.key,(oldCounts.get(node.key)||0)+1);
  for(const node of newChildren)if(node.key!=null)newCounts.set(node.key,(newCounts.get(node.key)||0)+1);
  const pairs=newChildren.map((node,index)=>{
    const oldIndex=node.key!=null&&oldCounts.get(node.key)===1&&newCounts.get(node.key)===1
      ?oldChildren.findIndex(old=>old.key===node.key&&sameType(old,node))
      :node.key==null&&oldChildren[index]?.key==null&&oldChildren[index]&&sameType(oldChildren[index],node)?index:-1;
    return {node,index,oldIndex};
  });
  const used=new Set(pairs.filter(pair=>pair.oldIndex>=0).map(pair=>pair.oldIndex));
  const keyed=pairs.filter(pair=>pair.node.key!=null&&pair.oldIndex>=0);
  const rows=pairs.map(pair=>{
    if(pair.oldIndex<0)return flagged(pair.node,'added');
    const result=diffNode(oldChildren[pair.oldIndex],pair.node);
    if(pair.node.key!=null&&keyed.some(other=>other!==pair&&(other.index-pair.index)*(other.oldIndex-pair.oldIndex)<0))result.marks.push('moved');
    return result;
  });
  pairs.forEach((pair,index)=>{pair.row=rows[index];});
  for(let i=0;i<oldChildren.length;i++){
    if(used.has(i))continue;
    let target=rows.length;
    for(let j=i+1;j<oldChildren.length;j++){
      const next=pairs.find(pair=>pair.oldIndex===j);
      if(next){const position=rows.indexOf(next.row);if(position>=0)target=position;break;}
    }
    rows.splice(target,0,flagged(oldChildren[i],'removed'));
  }
  return rows;
}
