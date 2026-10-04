// Browser-local reading preferences; never part of a character or chat payload.
export const READING_STORAGE_KEY='uos_reading_preferences_v1';
export const READING_FONT_SIZES=[['small','小 · 14px',14],['standard','标准 · 16px',16],['large','大 · 18px',18]];
export const READING_LINE_SPACING=[['standard','标准',1.7],['relaxed','宽松',2]];

export function readingPreferences(input){
  const value=input&&typeof input==='object'?input:{};
  return {
    fontSize:READING_FONT_SIZES.some(([id])=>id===value.fontSize)?value.fontSize:'standard',
    lineSpacing:READING_LINE_SPACING.some(([id])=>id===value.lineSpacing)?value.lineSpacing:'standard',
    focusBody:value.focusBody===true,
  };
}

export function createReadingPreferences(host){
  let current=readingPreferences();
  return {
    read(){
      try{const raw=host?.localStorage?.getItem(READING_STORAGE_KEY);if(raw!=null)current=readingPreferences(JSON.parse(raw))}catch{}
      return {...current};
    },
    set(patch){
      current=readingPreferences({...this.read(),...patch});
      try{host?.localStorage?.setItem(READING_STORAGE_KEY,JSON.stringify(current))}catch{}
      return {...current};
    },
  };
}
