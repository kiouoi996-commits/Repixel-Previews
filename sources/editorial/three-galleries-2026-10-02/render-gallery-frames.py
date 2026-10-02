from pathlib import Path
import math,subprocess,json
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'out'
OUT.mkdir(parents=True,exist_ok=True)
W,H=1448,1086
SAMPLES={0,45,75,105,150,209}
RESAMPLE=Image.Resampling.LANCZOS
SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SANS='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def ease(t):
 if t<=0:return 0.0
 if t>=1:return 1.0
 lo,hi=0.0,1.0
 for _ in range(30):
  u=(lo+hi)/2
  x=3*(1-u)**2*u*.33+3*(1-u)*u*u*.67+u**3
  if x<t:lo=u
  else:hi=u
 u=(lo+hi)/2
 return 3*(1-u)*u*u+u**3
def curve(frame,points,values):
 for i in range(len(points)-1):
  if frame<=points[i+1]:
   p=ease((frame-points[i])/(points[i+1]-points[i]))
   return values[i]+(values[i+1]-values[i])*p
 return values[-1]
def font(path,size):return ImageFont.truetype(path,max(1,round(size)))
def tracked(draw,xy,text,face,spacing,fill):
 x,y=xy
 for c in text:
  draw.text((x,y),c,font=face,fill=fill,anchor='lt')
  x+=draw.textlength(c,font=face)+spacing
def warm_background():
 y,x=np.mgrid[0:H,0:W]
 r=np.sqrt(((x-W*.5)/(W*.5*math.sqrt(2)))**2+((y-H*.58)/(H*.58*math.sqrt(2)))**2)
 colors=np.array([[239,237,233],[251,250,247],[252,251,248]],dtype=np.float32)
 t=np.clip(r/.66,0,1)[...,None];pixels=colors[0]*(1-t)+colors[1]*t
 t=np.clip((r-.66)/.34,0,1)[...,None];pixels=pixels*(1-t)+colors[2]*t
 return Image.fromarray(np.rint(pixels).astype(np.uint8)).convert('RGBA')
DESTINATIONS=[
 ('Santorini','ISLAND ESCAPE',(0,314,230,336),(-54,314,284,432),(-362,314,284,432)),
 ('Bali','NATURE & CULTURE',(251,314,283,336),(250,314,284,432),(-54,314,284,432)),
 ('Lake Como','ICONIC STAY',(558,286,326,352),(558,286,326,485),(250,314,284,432)),
 ('Morocco','DESERT RETREAT',(906,314,250,336),(906,314,250,432),(558,286,326,485)),
 ('Tulum','BEACH & DESIGN',(1177,314,241,336),(1177,314,241,432),(906,314,284,432)),
 ('Santorini','ISLAND ESCAPE',(0,314,230,336),(1443,314,284,432),(1210,314,284,432))]
src=Image.open(ROOT/'bundle/public/destinations.webp').convert('RGBA')
photos=[src.crop((x,y,x+w,y+h)) for _,_,(x,y,w,h),_,_ in DESTINATIONS]
background=warm_background()
def destination_state(p):
 scene=background.copy()
 for i,(name,category,crop,start,end) in enumerate(DESTINATIONS):
  x,y,w,h=[v+(end[k]-v)*p for k,v in enumerate(start)]
  a=(1-p) if i==2 else p if i==3 else 0
  wi,hi=round(w),round(h);ph=round(h-(96+37*a));pad=70
  shadow=Image.new('RGBA',(wi+2*pad,hi+2*pad));sd=ImageDraw.Draw(shadow)
  sd.rounded_rectangle((pad,pad,pad+wi,pad+hi),radius=7,fill=(58,53,43,round(255*(.07+.09*a))))
  scene.alpha_composite(shadow.filter(ImageFilter.GaussianBlur((24+21*a)/2)),(round(x)-pad,round(y+8+15*a)-pad))
  card=Image.new('RGBA',(wi,hi),'white');card.paste(photos[i].resize((wi,ph),RESAMPLE),(0,0));draw=ImageDraw.Draw(card)
  draw.text((25,ph+22),name,font=font(SERIF,29+5*a),fill='#101112',anchor='lt')
  tracked(draw,(25,ph+61+7*a),category,font(SANS,10),2.7,'#9498a4')
  actions=Image.new('RGBA',card.size);ad=ImageDraw.Draw(actions);compact=round(255*(1-a))
  ad.ellipse((wi-59,ph+27,wi-20,ph+66),outline=(217,220,225,compact),width=1)
  ad.text((wi-39.5,ph+45),'→',font=font(SANS,25),fill=(23,27,32,compact),anchor='mm')
  if a>0:
   bx,by=wi-21-147,hi-20-44;pill=np.empty((44,147,4),dtype=np.uint8)
   for k in range(147):
    t=k/146;pill[:,k,:3]=np.rint(np.array([250,199,70])*(1-t)+np.array([255,191,54])*t);pill[:,k,3]=round(255*a)
   actions.alpha_composite(Image.fromarray(pill),(bx,by));ad=ImageDraw.Draw(actions);face=font(BOLD,10)
   width=sum(ad.textlength(c,font=face) for c in 'EXPLORE')+6*2.6;tx=bx+(147-width-28)/2
   tracked(ad,(tx,by+17),'EXPLORE',face,2.6,(41,38,17,round(255*a)))
   ad.text((tx+width+14,by+22),'→',font=font(SANS,18),fill=(41,38,17,round(255*a)),anchor='mm')
  card=Image.alpha_composite(card,actions);mask=Image.new('L',card.size)
  ImageDraw.Draw(mask).rounded_rectangle((0,0,wi-1,hi-1),radius=7,fill=255);card.putalpha(mask)
  scene.alpha_composite(card,(round(x),round(y)))
 return scene.convert('RGB')
rest,selected=destination_state(0),destination_state(1)
def destination_frame(f):
 p=curve(f,[0,27,66,111,150,209],[0,0,1,1,0,0])
 return rest if p==0 else selected if p==1 else destination_state(p)
MOMENTS=[(64,251,481,922,36),(335,249,484,922,47),(603,247,475,922,58),(869,246,479,922,69),(1132,252,479,922,80)]
moment_source=Image.open(ROOT/'bundle/public/moments.webp').convert('RGB')
grain=np.random.default_rng(22).normal(0,.9,(H,W,1))
paper_image=Image.fromarray(np.clip(np.array([242,240,232],dtype=np.float32)+grain,0,255).astype(np.uint8))
offsets=[0,2,-1,3,1,-2,2,0,-3,1,2,-1,2,-2,1,3,0,-1,0];photo_masks=[]
for x,w,top,bottom,start in MOMENTS:
 h=bottom-top;mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask)
 d.rounded_rectangle((0,0,w-1,h-1),radius=19,fill=255);d.rectangle((0,0,w-1,h-20),fill=255);photo_masks.append(mask)
def moment_frame(f):
 image=moment_source.copy()
 for i,(x,w,top,bottom,start) in enumerate(MOMENTS):
  cover=curve(f,[0,15,29,start,start+29,209],[0,0,1,1,0,0])
  if cover==0:continue
  h=bottom-top;y=h*(1-cover)
  edge=[(w*k/18,min(h,y+o*math.sin(math.pi*cover))) for k,o in enumerate(offsets)]
  mask=Image.new('L',(w,h));ImageDraw.Draw(mask).polygon(edge+[(w,h),(0,h)],fill=255)
  image.paste(paper_image.crop((x,top,x+w,bottom)),(x,top),ImageChops.multiply(mask,photo_masks[i]))
 return image
def encode(name,render):
 output=OUT/(name+'.mp4')
 proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1080x810','-r','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','19','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
 endpoints=[];print('Rendering',name,flush=True)
 for f in range(210):
  image=render(f).resize((1080,810),RESAMPLE)
  if f in SAMPLES:image.save(OUT/(name+'-'+str(f)+'.png'))
  if f in [0,209]:endpoints.append(image.tobytes())
  proc.stdin.write(image.tobytes())
 proc.stdin.close();assert proc.wait()==0;assert endpoints[0]==endpoints[1]
 print('Complete',name,output.stat().st_size,'bytes; raw endpoints equal',flush=True)
if __name__=='__main__':
 encode('DestinationCarousel',destination_frame);encode('MomentsReveal',moment_frame)
 (OUT/'frame-render-complete.json').write_text(json.dumps({'width':1080,'height':810,'fps':30,'frames':210,'durationSeconds':7,'audio':False,'loopEndpointPixelsEqual':True}))
