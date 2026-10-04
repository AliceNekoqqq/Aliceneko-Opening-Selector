// Media conversion and file reading do not own settings or character storage.
export function readMediaFile(file, view=globalThis) {
  return new Promise((resolve,reject)=>{
    const reader=new view.FileReader();
    reader.onload=()=>resolve(String(reader.result));
    reader.onerror=()=>reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function readLyrics(file) {
  return (await file.text()).slice(0,300000);
}

export async function optimizeCoverData(source,file,doc=document){
  if(file?.type==='image/gif'||!/^data:image\/(?:png|jpeg|webp);base64,/i.test(source))return source;
  try{
    const ImageClass=doc.defaultView?.Image||Image;
    const image=new ImageClass();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source});
    const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
    if(!width||!height)return source;
    const scale=Math.min(1,960/Math.max(width,height));
    const canvas=doc.createElement('canvas');canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const context=canvas.getContext('2d');if(!context)return source;
    context.drawImage(image,0,0,canvas.width,canvas.height);
    const optimized=canvas.toDataURL('image/webp',.82);
    return optimized.startsWith('data:image/webp;base64,')&&optimized.length<source.length?optimized:source;
  }catch{return source}
}
