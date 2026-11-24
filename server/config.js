import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
import {backendOrigin} from './gateway.js';
dotenv.config({path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true});
export function config() {
  const backendUrl = process.env.BACKEND_URL || (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:5174' : '');
  if (!backendUrl) throw new Error('Set BACKEND_URL to the deployed backend origin.');
  return {backendUrl: backendOrigin(backendUrl), adminUrl: process.env.ADMIN_URL || '', port: Number(process.env.PORT || 3000)};
}
