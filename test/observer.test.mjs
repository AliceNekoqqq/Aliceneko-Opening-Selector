import assert from 'node:assert/strict';
import { mountOpeningSelector, OPENING_SELECTOR_VERSION } from '../index.js';

const observations=[];
globalThis.MutationObserver=class {
  constructor(callback){this.callback=callback}
  observe(body){observations.push(body)}
  disconnect(){this.disconnected=true}
};
const host={body:{},querySelector:()=>null,querySelectorAll:()=>[]};
const child={body:{},querySelector:()=>null,querySelectorAll:()=>[]};
const topWindow={document:host,MutationObserver:globalThis.MutationObserver,setInterval,clearInterval};topWindow.parent=topWindow;host.defaultView=topWindow;
const frameWindow={document:child,parent:topWindow};child.defaultView=frameWindow;
let closedOld=false;
host.__uosObserver={version:'0.1.0-beta.8',close:()=>{closedOld=true;delete host.__uosObserver}};
const api=mountOpeningSelector(child);
assert.equal(closedOld,true);
assert.equal(api.version,OPENING_SELECTOR_VERSION);
assert.equal(host.__uosObserver,api);
assert.equal(child.__uosObserver,undefined);
assert.equal(observations[0],host.body);
assert.equal(mountOpeningSelector(child),api);
api.scan();api.close();
assert.equal(host.__uosObserver,undefined);
console.log('Host observer survives selector iframe re-entry');
