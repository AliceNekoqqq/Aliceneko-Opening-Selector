import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bindUpdateControl} from '../src/update-control.js';
function element(){return {style:{},attrs:{},children:[],isConnected:true,setAttribute(k,v){this.attrs[k]=v},append(...v){this.children.push(...v)}}}
let tick,cleared=false,checks=0,pending=true;
const host={setInterval:fn=>{tick=fn;return 1},clearInterval:()=>{cleared=true}};
const doc={defaultView:{addEventListener(){},removeEventListener(){}},createElement:element};
const hostDoc={defaultView:host,__uosUpdater:{hasUpdate:true,busy:false,async check(manual){assert.equal(manual,true);checks++;this.hasUpdate=false}},querySelector:()=>null};
const b=element();b.ownerDocument=doc;
const stop=bindUpdateControl(b,hostDoc);assert.equal(b.children[1].hidden,false);await b.onclick();assert.equal(checks,1);assert.equal(b.children[1].hidden,true);
hostDoc.__uosUpdater.busy=true;tick();assert.equal(b.disabled,true);
stop();assert.equal(cleared,true);
// Existing beta.15 loader has check() but no state getters.
hostDoc.__uosUpdater={async check(){pending=false}};hostDoc.querySelector=selector=>{assert.match(selector,/:not\(\[data-uos-update-control\]\)/);return pending?{}:null};
const old=element();old.ownerDocument=doc;bindUpdateControl(old,hostDoc);assert.equal(old.children[1].hidden,false);await old.onclick();assert.equal(old.children[1].hidden,true,'clears legacy loader badge without matching itself');old.isConnected=false;cleared=false;tick();assert.equal(cleared,true);
const player=fs.readFileSync('src/player.js','utf8'),author=fs.readFileSync('src/selector.js','utf8');
assert.match(player,/tools.append\(updateButton\)/);assert.match(player,/uos-user-theme-label','主题'/);assert.match(author,/prepend\(updateButton\)/);
console.log('Visible modal/author update controls, legacy loader badge, manual checking and cleanup passed');
