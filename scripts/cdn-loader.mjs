// This local entry only imports the remote bootstrap; update logic lives remotely.
export async function cdnLoader({urls,channel}){
  const errors=[];
  for(const url of urls){
    try{
      const bootstrap=await import(url);
      if(bootstrap.BOOTSTRAP_CHANNEL!==channel||bootstrap.BOOTSTRAP_PROTOCOL!==1||typeof bootstrap.start!=='function')throw Error('远程入口格式或通道不匹配');
      await bootstrap.start();return;
    }catch(error){errors.push(String(error?.message||error))}
  }
  const message='红豆粉开场白选择器远程加载失败：'+errors.join(' | ');
  if(globalThis.toastr?.error)globalThis.toastr.error(message);else console.error(message);
}
