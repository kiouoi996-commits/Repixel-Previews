import {ClassicApp} from './app-core';
import './app.css';

document.body.style.cssText = 'margin:0;min-height:100dvh;background:#f6f5f2;display:flex;justify-content:center;align-items:flex-start;';
const host = document.getElementById('app')!;
host.style.cssText = 'position:relative;width:100%;max-width:480px;flex-shrink:0;overflow:hidden;';
declare const __CLASSIC_ASSET_URLS__: Record<string, string> | undefined;
const assets = typeof __CLASSIC_ASSET_URLS__ === 'undefined' ? {} : __CLASSIC_ASSET_URLS__;
const asset = (path: string) => assets[path] || new URL(path, new URL('./', location.href)).href;
const app = new ClassicApp(host, {asset});
window.addEventListener('pagehide', () => app.dispose(), {once: true});
