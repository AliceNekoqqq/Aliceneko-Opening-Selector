import fs from 'node:fs';
import {buildAuthorCss} from './author-css.mjs';
export function writeAuthorCss(){
  fs.mkdirSync('generated',{recursive:true});
  fs.writeFileSync('generated/author-css.js',`// Generated styles; edit src/selector.css and build resource mapping.\nexport const AUTHOR_CSS=${JSON.stringify(buildAuthorCss())};\n`);
}
