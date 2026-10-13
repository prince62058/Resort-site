import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const children = [
  spawn(process.execPath, ['--watch', 'server/index.js'], {cwd: root, env: {...process.env, PORT: '5174'}, stdio: 'inherit'}),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0', ...process.argv.slice(2)], {cwd: root, stdio: 'inherit'}),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach(child => child.kill('SIGTERM'));
  setTimeout(() => process.exit(code), 500).unref();
}
children.forEach(child => {
  child.on('error', () => stop(1));
  child.on('exit', code => stop(code || 0));
});
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
