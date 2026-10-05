// Playback owns audio events and lyrics, but never writes character settings.
export function formatTime(seconds) {
  const value=Math.max(0,Math.floor(Number(seconds)||0));
  return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
}

export function lyricRows(source) {
  const rows=[];
  for(const line of String(source||'').split(/\r?\n/)) {
    const match=/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/.exec(line);
    if(match)rows.push({time:+match[1]*60+(+match[2])+(+('0.'+(match[3]||'0'))),text:match[4].trim()});
  }
  return rows.sort((a,b)=>a.time-b.time);
}

export function createMediaPlayer(root,{status=()=>{}}={}) {
  const query=selector=>root.querySelector(selector);
  const player=query('[data-player]'),audio=player.querySelector('audio');
  const play=query('[data-play]'),seek=query('[data-seek]'),clock=query('[data-clock]');
  const title=query('[data-music-title]'),lyrics=query('[data-lyrics]');
  const skips=Array.from(player.querySelectorAll('[data-skip]'));
  let lastRow=null,closed=false;
  function update() {
    if(closed)return;
    const duration=Number.isFinite(audio.duration)?audio.duration:0;
    seek.value=String(duration?Math.round(audio.currentTime/duration*1000):0);
    clock.textContent=`${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
    play.textContent=audio.paused?'▶':'Ⅱ';
    const rows=Array.from(lyrics.querySelectorAll('[data-time]'));
    let active=-1;
    rows.forEach((row,index)=>{if(+row.dataset.time<=audio.currentTime+.08)active=index;row.classList.toggle('is-active',index===active)});
    if(active>=0&&rows[active]!==lastRow) {
      const row=rows[active];
      lyrics.scrollTo({top:row.offsetTop-lyrics.offsetTop-(lyrics.clientHeight-row.clientHeight)/2,behavior:'smooth'});
      lastRow=row;
    }
  }
  function render(music) {
    if(closed)return;
    player.hidden=!music.enabled;
    const source=music.enabled?music.audio:'';
    if(audio.getAttribute('src')!==source) {
      audio.pause();
      if(source)audio.src=source;else audio.removeAttribute('src');
      audio.load();
    }
    play.disabled=!source;
    title.textContent=music.title||'开场音乐';
    lyrics.replaceChildren();
    const rows=lyricRows(music.lyrics);
    if(rows.length)for(const row of rows) {
      const button=root.ownerDocument.createElement('button');
      button.className='uos-lyric-row';button.textContent=row.text;button.type='button';
      button.dataset.time=String(row.time);button.onclick=()=>{audio.currentTime=row.time};
      lyrics.append(button);
    }
    else lyrics.textContent=music.lyrics?.trim()||'♫';
    update();
  }
  play.onclick=()=>{if(audio.paused)audio.play().catch(()=>{if(!closed)status('无法播放该音乐文件')});else audio.pause()};
  skips.forEach(button=>button.onclick=()=>{
    audio.currentTime=Math.max(0,Math.min(audio.duration||Infinity,audio.currentTime+Number(button.dataset.skip)));update();
  });
  seek.oninput=event=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(event.target.value)/1000};
  audio.ontimeupdate=update;audio.onloadedmetadata=update;audio.onplay=update;audio.onpause=update;
  function close() {
    if(closed)return;closed=true;
    play.onclick=null;seek.oninput=null;skips.forEach(button=>{button.onclick=null});
    audio.ontimeupdate=null;audio.onloadedmetadata=null;audio.onplay=null;audio.onpause=null;
    for(const row of lyrics.querySelectorAll('[data-time]'))row.onclick=null;
    audio.pause();audio.removeAttribute('src');audio.load();lastRow=null;
  }
  return {render,close};
}
