import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const children=['backend','site','admin'].map(folder=>spawn('npm',['run','dev'],{cwd:fileURLToPath(new URL('../'+folder+'/',import.meta.url)),stdio:'inherit'}));
let stopping=false;
function stop(code=0) {
  if(stopping)return;stopping=true;
  for(const child of children)child.kill('SIGTERM');
  setTimeout(()=>process.exit(code),1000).unref();
}
for(const child of children){child.on('error',()=>stop(1));child.on('exit',code=>stop(code||0));}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
