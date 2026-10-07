export function normalizeBrandVisibility(value){
  const input=value&&typeof value==='object'?value:{};
  return {mascot:typeof input.mascot==='boolean'?input.mascot:true,title:typeof input.title==='boolean'?input.title:true};
}

export function applyBrandVisibility(root,value){
  const visibility=normalizeBrandVisibility(value);
  if(root?.dataset){root.dataset.brandMascot=String(visibility.mascot);root.dataset.brandTitle=String(visibility.title)}
  return visibility;
}
