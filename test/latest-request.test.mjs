import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createLatestRequest} from '../src/latest-request.js';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
test('stale success, failure and completion cannot overwrite the newest read or enable its busy control',async()=>{
  const requests=createLatestRequest(),view={data:null,error:null,busy:false};let active=true;
  const refresh=async task=>{
    const current=requests.begin(()=>active);view.busy=true;
    try{const value=await task.promise;if(current())view.data=value}
    catch(error){if(current())view.error=error.message}
    finally{if(current())view.busy=false}
  };
  const old=deferred(),fresh=deferred(),a=refresh(old),b=refresh(fresh);
  old.reject(Error('old failure'));await a;assert.equal(view.busy,true);assert.equal(view.error,null);
  fresh.resolve('new');await b;assert.deepEqual(view,{data:'new',error:null,busy:false});
  const late=deferred(),newer=deferred(),c=refresh(late),d=refresh(newer);
  newer.resolve('newest');await d;late.resolve('stale');await c;assert.equal(view.data,'newest');
  const closed=deferred(),e=refresh(closed);active=false;closed.reject(Error('closed'));await e;assert.equal(view.error,null);
  active=true;const invalidated=deferred(),f=refresh(invalidated);requests.invalidate();invalidated.resolve('invalid');await f;assert.equal(view.data,'newest');
});
