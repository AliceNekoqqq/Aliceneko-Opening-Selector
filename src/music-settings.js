import {readLyrics} from './media-files.js';

// Render a settings session; the selector keeps ownership of saving/discarding it.
export function renderMusicSettings({root,settings,isCurrent,fields,renderMusic}) {
  const doc=root.ownerDocument;
  const el=(tag,cls,text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node};
  const {field,toggleField,fileField}=fields;
  const music=root.querySelector('[data-bgm-fields]'),empty=root.querySelector('[data-bgm-empty]');
  music.replaceChildren();if(empty)empty.hidden=Boolean(settings.music.audio);
  const loaded=el('p','uos-help');loaded.dataset.bgmLoaded='';
  loaded.textContent=settings.music.audio?'已载入音乐'+(settings.music.lyrics?'及歌词':'')+'。保存后随卡导出。':'尚未上传音乐';
  music.append(
    toggleField('启用 BGM 播放器',settings.music.enabled,value=>{
      settings.music.enabled=value;renderMusic(settings.music);
      loaded.textContent=value?'BGM 已启用，保存后生效。':'BGM 已关闭，播放器已隐藏；保存后生效。';
    }),
    field('曲名',settings.music.title,value=>{settings.music.title=value}),
    fileField('上传音乐（8 MB 内）','audio/mpeg,audio/mp4,audio/ogg,audio/wav',8*1048576,(value,_file,target)=>{
      target.music.audio=value;if(empty)empty.hidden=true;renderMusic(target.music);
      loaded.textContent=target.music.enabled?'音乐已载入，可在选择页预览；点击保存写入角色卡。':'音乐已载入。勾选启用 BGM 后显示播放器，点击保存写入角色卡。';
    }),
    fileField('上传歌词（LRC 或 TXT）','.lrc,.txt,text/plain',300000,async(_data,file,target)=>{
      const lyrics=await readLyrics(file);if(!isCurrent(target))return;
      target.music.lyrics=lyrics;renderMusic(target.music);loaded.textContent='歌词已载入；点击保存写入角色卡。';
    }),loaded,
  );
  const clear=el('button','uos-icon','移除音乐');clear.type='button';
  clear.onclick=()=>{
    settings.music={enabled:false,title:'',audio:'',lyrics:''};if(empty)empty.hidden=false;
    renderMusic(settings.music);loaded.textContent='音乐已移除，点击保存生效';
  };
  music.append(clear,el('p','uos-help','请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。'));
}
