import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
export function launchTestBrowser(){
  return chromium.launch({headless:true,...(process.env.UOS_CHROMIUM_EXECUTABLE?{executablePath:process.env.UOS_CHROMIUM_EXECUTABLE,args:JSON.parse(process.env.UOS_CHROMIUM_ARGS||'[]')}:{} )});
}
