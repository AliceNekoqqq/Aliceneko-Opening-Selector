// Drawing is independent of display order and never starts a greeting transaction.
export function blindBoxPool(items){
  const seen=new Set();
  return items.filter(item=>{
    if(!item||!Number.isInteger(item.id)||!item.body||item.isCurrent||seen.has(item.id))return false;
    seen.add(item.id);return true;
  });
}
export function drawOpening(pool,lastId,random=Math.random){
  if(!pool.length)return null;
  const candidates=pool.length>1?pool.filter(item=>item.id!==lastId):pool;
  const value=random(),unit=Number.isFinite(value)?Math.max(0,Math.min(1-Number.EPSILON,value)):0;
  return candidates[Math.floor(unit*candidates.length)];
}
// Sample without replacement: choosing any concealed position remains uniform.
// Keep the previous result out of the next hand when alternatives exist.
export function drawOpeningHand(pool,lastId,random=Math.random,count=3){
  const candidates=(pool.length>1?pool.filter(item=>item.id!==lastId):pool).slice(),hand=[];
  const limit=Number(count)===5?5:3;
  while(candidates.length&&hand.length<limit){
    const value=random(),unit=Number.isFinite(value)?Math.max(0,Math.min(1-Number.EPSILON,value)):0;
    hand.push(candidates.splice(Math.floor(unit*candidates.length),1)[0]);
  }
  return hand;
}
