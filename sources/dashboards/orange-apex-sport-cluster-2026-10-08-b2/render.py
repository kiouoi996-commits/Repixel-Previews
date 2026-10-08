from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json,subprocess,hashlib,threading,time,os
ROOT=Path(__file__).resolve().parent
OUT=Path(os.environ.get('APEX_RENDER_OUTPUT',str(ROOT.parent/'render')))
OUT.mkdir(exist_ok=True)
FPS=30
FRAMES=480
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--renderer-process-limit=1'])
 page=browser.new_page(viewport={'width':1080,'height':810},device_scale_factor=1)
 from asset_routes import install_asset_routes
 install_asset_routes(page)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:4177/index.html?capture=1',wait_until='networkidle')
 page.evaluate('dashboard.ready')
 page.evaluate('dashboard.renderAt(0)')
 for _ in range(3):page.screenshot(type='png',animations='disabled')
 command=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',str(FPS),'-vcodec','png','-i','-','-an','-c:v','libx264','-threads','1','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'orange-apex-sport-cluster-2026-10-08-b2.mp4')]
 encoder=subprocess.Popen(command,stdin=subprocess.PIPE,stderr=open(OUT/'encoder.log','w'))
 samples={}
 first=None;last=None
 for frame in range(FRAMES):
  timestamp=frame/FPS
  state=page.evaluate('(t)=>dashboard.renderAt(t)',timestamp)
  fractions=page.evaluate('dashboard.getBands()')
  assert abs(fractions['speed']-min(1,max(0,state['speed']/200)))<1e-9
  assert abs(fractions['rpm']-min(1,max(0,state['rpm']/8000)))<1e-9
  if timestamp>=14.8:
   assert state['speed']==128 and state['rpm']==5600 and state['gear']==4 and state['range']==310 and state['coolant']==198
   screenshot=first
  else:screenshot=page.screenshot(type='png',animations='disabled')
  if frame==0:
   first=screenshot;(OUT/'first.png').write_bytes(screenshot)
   Image.open(OUT/'first.png').save(OUT/'orange-apex-sport-cluster-2026-10-08-b2.webp',format='WEBP',lossless=True,method=6)
  if frame==FRAMES-1:last=screenshot;(OUT/'last.png').write_bytes(screenshot)
  if frame in [0,60,92,129,190,279,330,388,444,479]:
   samples[str(frame)]=state
   (OUT/f'checkpoint-{frame}.png').write_bytes(screenshot)
  encoder.stdin.write(screenshot)
  if frame%60==0:print(f'Rendered {frame}/{FRAMES}',flush=True)
 encoder.stdin.close();code=encoder.wait(timeout=60)
 assert code==0,(OUT/'encoder.log').read_text()
 assert not errors,errors
 assert Image.open(OUT/'first.png').tobytes()==Image.open(OUT/'last.png').tobytes(),'Loop endpoints differ'
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(OUT/'orange-apex-sport-cluster-2026-10-08-b2.mp4')]))
 stream=probe['streams'][0]
 assert stream['codec_name']=='h264' and stream['pix_fmt']=='yuv420p'
 assert stream['width']==1080 and stream['height']==810
 assert int(stream['nb_read_frames'])==FRAMES
 assert len(probe['streams'])==1
 media=[]
 for path in sorted(OUT.glob('orange-apex*')):
  b=path.read_bytes();assert len(b)>100
  media.append({'name':path.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
 report={'fps':FPS,'frames':FRAMES,'duration':16,'width':1080,'height':810,'codec':'h264','pixelFormat':'yuv420p','silent':True,'loopEndpointsPixelEqual':True,'bandFramesVerified':FRAMES,'samples':samples,'files':media,'pageErrors':errors}
 (OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'renderComplete':True,'files':media,'loopEndpointsPixelEqual':True}),flush=True)
 browser.close()
