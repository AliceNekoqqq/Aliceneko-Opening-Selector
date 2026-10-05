import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createMediaPlayer,formatTime,lyricRows} from '../src/media-player.js';
import {createSettingsFields} from '../src/settings-fields.js';
import {renderMusicSettings} from '../src/music-settings.js';

function element(tag='',cls='',text='') {
  return {tag,className:cls,textContent:text,dataset:{},children:[],offsetTop:0,clientHeight:20,
    classList:{toggle(){}},listeners:{},append(...nodes){this.children.push(...nodes)},
    replaceChildren(){this.children=[];this.textContent=''},addEventListener(type,fn){this.listeners[type]=fn},
    querySelectorAll(){return this.children.filter(node=>node.dataset.time!==undefined)},
    scrollTo(){this.scrolls=(this.scrolls||0)+1}};
}
function uploadSession() {
  const readers=[],messages=[],counts=[];
  let draft={music:{enabled:true,title:'',audio:'',lyrics:''}};
  class Reader {
    constructor(){readers.push(this)}
    readAsDataURL(file){this.file=file}
    finish(value='data:audio/mpeg;base64,YQ=='){this.result=value;this.onload()}
  }
  const fields=createSettingsFields({el:element,view:{FileReader:Reader},getDraft:()=>draft,
    status:message=>messages.push(message),onPendingChange:count=>counts.push(count)});
  const input=callback=>fields.fileField('音乐','audio/*',1024,callback).children[1];
  const begin=(node,file={size:10})=>{node.files=[file];return node.onchange()};
  return {fields,readers,messages,counts,input,begin,get draft(){return draft},replace(){draft={music:{}}}};
}

test('media formatting preserves timed LRC sorting and plain text fallback',()=>{
  assert.equal(formatTime(-10),'0:00');assert.equal(formatTime(125.7),'2:05');
  assert.deepEqual(lyricRows('[00:02.25] 后句\n[00:01] 前句\n普通文本'),[
    {time:1,text:'前句'},{time:2.25,text:'后句'}]);
  assert.deepEqual(lyricRows('普通歌词'),[]);
});

test('playback renders, seeks, preserves the current source and cleans up on close',async()=>{
  const nodes=Object.fromEntries(['player','play','seek','clock','music-title','lyrics'].map(key=>[`[data-${key}]`,element()]));
  const audio={paused:true,currentTime:0,duration:10,source:null,loads:0,
    getAttribute(){return this.source},set src(value){this.source=value},
    removeAttribute(){this.source=null},pause(){this.paused=true},load(){this.loads++},
    async play(){this.paused=false}};
  const skip=element();skip.dataset.skip='-15';
  nodes['[data-player]'].querySelector=()=>audio;nodes['[data-player]'].querySelectorAll=()=>[skip];
  const root={ownerDocument:{createElement:element},querySelector:selector=>nodes[selector]};
  const controller=createMediaPlayer(root);
  const music={enabled:true,title:'曲名',audio:'data:audio/mpeg;base64,YQ==',lyrics:'[00:02] 第一行\n[00:06] 第二行'};
  controller.render(music);assert.equal(audio.loads,1);assert.equal(nodes['[data-player]'].hidden,false);
  controller.render(music);assert.equal(audio.loads,1,'same source does not restart playback');
  await nodes['[data-play]'].onclick();assert.equal(audio.paused,false);
  audio.currentTime=3;audio.ontimeupdate();assert.equal(nodes['[data-clock]'].textContent,'0:03 / 0:10');
  assert.equal(nodes['[data-seek]'].value,'300');
  nodes['[data-seek]'].oninput({target:{value:'500'}});assert.equal(audio.currentTime,5);
  nodes['[data-lyrics]'].children[1].onclick();assert.equal(audio.currentTime,6);
  skip.onclick();assert.equal(audio.currentTime,0);
  controller.render({...music,lyrics:'纯文本歌词'});assert.equal(nodes['[data-lyrics]'].textContent,'纯文本歌词');
  controller.render({...music,enabled:false});assert.equal(audio.source,null);assert.equal(nodes['[data-play]'].disabled,true);
  controller.render(music);const row=nodes['[data-lyrics]'].children[0];
  controller.close();assert.equal(audio.paused,true);assert.equal(audio.source,null);
  assert.equal(audio.ontimeupdate,null);assert.equal(nodes['[data-play]'].onclick,null);assert.equal(row.onclick,null);
  const loads=audio.loads;controller.render(music);controller.close();assert.equal(audio.loads,loads);
});

test('uploads stay pending through asynchronous processing and ignore replaced drafts',async()=>{
  const session=uploadSession();let release;
  const processing=new Promise(resolve=>{release=resolve});
  const input=session.input(async(value,_file,draft)=>{await processing;draft.music.audio=value});
  const upload=session.begin(input);assert.deepEqual(session.counts,[1]);
  session.readers[0].finish();await Promise.resolve();assert.deepEqual(session.counts,[1]);
  release();await upload;assert.deepEqual(session.counts,[1,0]);assert.ok(session.draft.music.audio);
  let called=false;
  const stale=session.input(()=>{called=true});const pending=session.begin(stale);
  session.replace();session.readers[1].finish();await pending;assert.equal(called,false);
  assert.deepEqual(session.draft.music,{});assert.equal(session.counts.at(-1),0);
});

test('oversized and failed uploads report status, and closed sessions ignore late results',async()=>{
  const session=uploadSession();const input=session.input(()=>assert.fail('must not apply'));
  await session.begin(input,{size:2048});assert.equal(session.readers.length,0);assert.match(session.messages[0],/超过/);
  const failed=session.begin(input);session.readers[0].error=Error('broken');session.readers[0].onerror();await failed;
  assert.match(session.messages.at(-1),/broken/);assert.equal(session.counts.at(-1),0);
  const pending=session.begin(input);session.fields.close();session.readers[1].finish();await pending;
  assert.equal(session.messages.length,2);assert.equal(session.counts.at(-1),0);
});

test('music settings preview the draft, clear media, and suppress stale lyric decoding',async()=>{
  const session=uploadSession(),music=element(),empty=element(),previews=[];
  const root={ownerDocument:{createElement:element},querySelector:selector=>selector==='[data-bgm-fields]'?music:empty};
  renderMusicSettings({root,settings:session.draft,isCurrent:session.fields.isCurrent,fields:session.fields,renderMusic:value=>previews.push({...value})});
  const toggle=music.children[0].children[0];toggle.checked=false;toggle.onchange();assert.equal(session.draft.music.enabled,false);
  const audioInput=music.children[2].children[1];const uploading=session.begin(audioInput);session.readers[0].finish();await uploading;
  assert.ok(session.draft.music.audio);assert.equal(empty.hidden,true);assert.equal(previews.at(-1).audio,session.draft.music.audio);
  let finishText;const text=new Promise(resolve=>{finishText=resolve});
  const lyricsInput=music.children[3].children[1];const old=session.draft;
  const lyricsUpload=session.begin(lyricsInput,{size:10,text:()=>text});session.readers[1].finish();await Promise.resolve();
  session.replace();finishText('[00:01] abandoned');await lyricsUpload;assert.equal(old.music.lyrics,'');
  renderMusicSettings({root,settings:session.draft,isCurrent:session.fields.isCurrent,fields:session.fields,renderMusic:value=>previews.push({...value})});
  music.children[5].onclick();assert.deepEqual(session.draft.music,{enabled:false,title:'',audio:'',lyrics:''});assert.equal(empty.hidden,false);
});
