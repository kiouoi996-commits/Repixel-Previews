from pathlib import Path
from playwright.sync_api import sync_playwright
from asset_routes import install_asset_routes
from PIL import Image, ImageDraw
import json,io
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent/'render'
OUT.mkdir(exist_ok=True)
results=[];samples={};pictures=[]
def check(name,ok,details=None):
 assert ok,(name,details)
 results.append({'test':name,'passed':True,'details':details})
def counts(png):
 image=Image.open(io.BytesIO(png)).convert('RGB')
 result={}
 for name,box in [('speed',(0,110,557,761)),('rpm',(846,110,1394,761))]:
  result[name]=sum(r>180 and 65<g<235 and b<110 for r,g,b in image.crop(box).getdata())
 return result
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--renderer-process-limit=1'])
 page=browser.new_page(viewport={'width':1448,'height':1086})
 install_asset_routes(page)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:4177/index.html?capture=1',wait_until='networkidle');page.evaluate('dashboard.ready')
 def frame(name,values=None,t=None):
  if values is not None:state=page.evaluate('(v)=>dashboard.renderState(v)',values)
  else:state=page.evaluate('(t)=>dashboard.renderAt(t)',t)
  actual=page.evaluate('dashboard.getBands()')
  expected={'speed':max(0,min(1,state['speed']/200)),'rpm':max(0,min(1,state['rpm']/8000))}
  check(name+' shares exact displayed state',actual==expected,actual)
  png=page.screenshot(type='png',animations='disabled')
  (OUT/('band-'+name+'.png')).write_bytes(png)
  sample={'state':state,'fractions':actual,'warmPixels':counts(png)};samples[name]=sample
  if name in ['zero','reference','maximum','before-upshift','after-upshift','braked']:
   im=Image.open(io.BytesIO(png)).convert('RGB');im.thumbnail((724,543));pictures.append((name,im))
  return sample
 low=frame('zero',{'speed':0,'rpm':0})
 check('zero hides both active ribbons',page.evaluate("['speed-band','rpm-band'].every(id=>getComputedStyle(document.getElementById(id)).opacity==='0')"))
 mid=frame('reference',{'speed':128,'rpm':5600})
 high=frame('maximum',{'speed':200,'rpm':8000})
 for gauge in ['speed','rpm']:
  check(gauge+' rendered warm ribbon area grows from zero through reference to maximum',low['warmPixels'][gauge]<mid['warmPixels'][gauge]<high['warmPixels'][gauge],[x['warmPixels'][gauge] for x in [low,mid,high]])
 outside=frame('clamped',{'speed':240,'rpm':9000})
 check('maximum bounds do not wrap around track',outside['warmPixels']==high['warmPixels'])
 before=frame('before-upshift',t=3.0);after=frame('after-upshift',t=3.3)
 check('upshift keeps speed ribbon unchanged',abs(before['state']['speed']-after['state']['speed'])<.001 and before['warmPixels']['speed']==after['warmPixels']['speed'],[before['warmPixels']['speed'],after['warmPixels']['speed']])
 check('upshift visibly contracts RPM ribbon',after['state']['rpm']<before['state']['rpm'] and after['warmPixels']['rpm']<before['warmPixels']['rpm'],[before['warmPixels']['rpm'],after['warmPixels']['rpm']])
 fast=frame('before-brake',t=6.3);braked=frame('braked',t=9.3)
 check('braking visibly contracts both ribbons',all(braked['warmPixels'][g]<fast['warmPixels'][g] for g in ['speed','rpm']),[fast['warmPixels'],braked['warmPixels']])
 reset=frame('reset',t=14.8)
 check('demo reset restores exact reference ribbon pixels',reset['warmPixels']==mid['warmPixels'])
 check('no browser errors',not errors,errors)
 browser.close()
report={'passed':len(results),'tests':results,'samples':samples}
(ROOT.parent/'band-visual-checks.json').write_text(json.dumps(report,indent=2)+'\n')
contact=Image.new('RGB',(1448,3*573),'#050505');draw=ImageDraw.Draw(contact)
for i,(name,im) in enumerate(pictures):
 x=(i%2)*724;y=(i//2)*573;contact.paste(im,(x,y+26));draw.text((x+16,y+8),name,fill='white')
contact.save(OUT/'ribbon-checks.jpg',quality=80)
print(json.dumps({'passed':len(results),'warmPixelSamples':{n:s['warmPixels'] for n,s in samples.items()}}))
