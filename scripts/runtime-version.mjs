// Stamp runtime lifecycle and displayed versions from the selected build channel.
export function stampRuntimeVersion(source,version){
  if(!/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/.test(version))throw Error('Invalid runtime version');
  let count=0;
  const result=source.replace(/^(\s*const (?:VERSION|AUTHOR_VERSION)\s*=\s*)'[^']*'/gm,(_,prefix)=>{count++;return prefix+JSON.stringify(version)});
  if(count!==3)throw Error(`Expected three runtime version declarations, found ${count}`);
  return result;
}
