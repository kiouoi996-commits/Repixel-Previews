"""Authored Pixel Sync, Sleepy Snail and Toaster Batch loading mechanisms.
Python 3 + Pillow/numpy/scipy/contourpy and ffmpeg. --prepare, --render 172|173|174.
"""
from pathlib import Path
import argparse, hashlib, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import map_coordinates, label
import contourpy

ROOT=Path(__file__).parent
NATIVE,OUT,AA,FPS=1254,900,2,30
K=OUT*AA/NATIVE
SPECS={172:('pixel-sync-loader',1,8,4.1),173:('sleepy-snail-loader',2,8,0.5),174:('toaster-batch-loader',3,10,4.74)}
WORDS={172:[[313,384,946,532],[369,825,893,871]],173:[[486,817,767,931]],174:[[493,969,768,1081]]}
CELLS=[[135,635,210,711],[222,635,298,711],[310,636,386,711],[399,635,476,711],[488,636,567,712],[579,636,657,712],[669,635,748,712],[761,635,839,712],[852,635,934,712],[947,636,1029,712],[1042,635,1121,712]]
GREEN=(100,251,65)
Z_BOXES=[[744,472,774,503],[777,427,817,468],[826,380,864,421]]
RAY_BOXES=[[646,141,663,187],[734,185,773,221],[449,248,498,277],[758,265,804,284],[444,331,492,355]]
FILLED_BOXES=[[235,826,316,908],[328,826,408,908],[420,826,500,908],[512,826,592,908],[604,826,684,908]]
EMPTY_BOXES=[[695,821,794,914],[808,821,907,914],[915,821,1014,914]]
TILE_CENTERS=[275.5,368,460,552,644,744.5,857.5,964.5]
LEVER_BOX=[776,573,850,611]

def stem(n):return f'{n}-{SPECS[n][0]}-2026-10-05-c1'
def smooth(v):v=np.clip(v,0,1);return v*v*(3-2*v)
def info(p):
 b=p.read_bytes();return {'filename':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
def alpha(a,boxes,erase=None):
 g=a.max(2).astype(float);mask=np.zeros(g.shape,bool)
 for x1,y1,x2,y2 in boxes:mask[y1:y2,x1:x2]=True
 for x1,y1,x2,y2 in erase or []:mask[y1:y2,x1:x2]=False
 matte=np.where(mask&(g>16),np.clip((g-8)*255/247,0,255),0).astype('uint8')
 rgb=np.clip(a.astype(float)*255/np.maximum(g[...,None],1),0,255).astype('uint8')
 return Image.fromarray(np.dstack([rgb,matte]),'RGBA')
def trace(layer,color='#fff'):
 loops=contourpy.contour_generator(z=(np.asarray(layer.getchannel('A'))>128).astype(float),name='serial').lines(.5)
 paths=['M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in p)+' Z' for p in loops if len(p)>3]
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><path fill="'+color+'" fill-rule="evenodd" d="'+' '.join(paths)+'"/></svg>\n'
def save_art(n,role,layer,vector=True):
 layer.save(ROOT/f'{stem(n)}-{role}.webp',lossless=True)
 if vector:(ROOT/f'{stem(n)}-{role}.svg').write_text(trace(layer,'#64fb41' if n==172 else '#fff'))
def resize(layer,pixel=False):return layer.resize((OUT*AA,OUT*AA),Image.Resampling.NEAREST if pixel else Image.Resampling.LANCZOS)
def opacity(layer,value):
 result=layer.copy();result.putalpha(result.getchannel('A').point(lambda a:round(a*float(np.clip(value,0,1)))));return result
def native_rect(d,box,color,outline=None,width=1):
 box=tuple(round(v*K) for v in box);d.rectangle(box,fill=color,outline=outline,width=max(1,round(width*K)))
def prepare():
 for n,(slug,index,seconds,poster) in SPECS.items():
  original=Image.open(ROOT/f'reference-{index}.png').convert('RGB');a=np.array(original)
  original.save(ROOT/f'{stem(n)}-reference.webp',lossless=True)
  save_art(n,'word',alpha(a,WORDS[n]))
  params={'nativeStage':[1254,1254],'preview':{'width':900,'height':900,'fps':30,'frames':int(seconds*30),'durationSeconds':seconds,'audio':False,'faststart':True,'closedSampling':f't={seconds}*frameIndex/{int(seconds*30)-1}; component uses actual elapsed time'},'stationaryLabel':True,'wordBounds':WORDS[n],'motionAuthorship':'authored from supplied stills'}
  if n==172:
   border=alpha(a,[[95,600,1161,745]])
   groups,_=label(np.asarray(border.getchannel('A'))>16)
   counts=np.bincount(groups.ravel());counts[0]=0
   border.putalpha(Image.fromarray(np.where(groups==counts.argmax(),np.asarray(border.getchannel('A')),0).astype('uint8')))
   save_art(n,'frame',border)
   params.update({'greenRGB':GREEN,'cellBoxes':CELLS,'outlineWidth':4,'cycleSeconds':8,'firstCellSeconds':.40,'cellIntervalSeconds':.46,'fillRiseSeconds':.18,'fillRows':8,'cellCommit':'complete after eight upward rows; retain previously committed cells','acknowledgmentFlash':'amplitude .20*sin(pi*(u-.18)/.20) for .18<=u<=.38 on the newly committed cell','fullHoldSeconds':[5.18,6.60],'fillFadeOutSeconds':[6.60,7.40],'invisibleFillResetSeconds':[7.40,8],'fixedFrameAndWords':True,'semantics':'decorative acknowledgment fixture, not actual sync counts or percentage; real host acknowledgments may drive committed count'})
  elif n==173:
   save_art(n,'snail',alpha(a,[[422,482,732,678]]))
   bar=alpha(a,[[184,674,1069,751]])
   groups,_=label(np.asarray(bar.getchannel('A'))>16)
   counts=np.bincount(groups.ravel());counts[0]=0
   bar.putalpha(Image.fromarray(np.where(groups==counts.argmax(),np.asarray(bar.getchannel('A')),0).astype('uint8')))
   save_art(n,'bar',bar)
   save_art(n,'snore-marks',alpha(a,[[382,621,420,655]]))
   for j,box in enumerate(Z_BOXES):save_art(n,f'z{j+1}',alpha(a,[box]))
   params.update({'breathPeriodSeconds':4,'snailBounds':[422,482,732,678],'rigidShellCenter':[539,573],'rigidShellRadius':104,'footContactY':671,'breathAmplitude':.018,'warpWeight':'smoothstep((distanceToShellCenter-104)/12)*smoothstep((x-618)/20)*smoothstep((671-y)/20)','inverseSampleY':'671+(y-671)/(1+.018*sin(2*pi*t/4)*weight); sourceX=x','rigidShellAndFootRule':'weight is exactly zero in shell radius<=104 and y>=671','zBoxes':Z_BOXES,'zPhase':'(t/4+.24+i/3) modulo 1','zPosition':'(730+119*p,530-141*p-6*sin(pi*p))','zScale':'.70+.65*p','zOpacity':'smoothstep(p/.15)*(1-smoothstep((p-.72)/.28))','zResetsInvisible':True,'snoreOpacity':'.30+.70*(.5+.5*sin(2*pi*t/4))','stripeClip':[208,695,532,728],'stripeRoundedRadius':11,'stripePitch':20,'stripeWidth':9,'stripeOffset':'20*(t modulo 1)','stripeTest':'(x+y-offset) modulo 20 <9','filledExtentIsConstant':True,'semantics':'sleeping breathing character and clipped indeterminate barber-pole, not crawling or a measured progress fraction'})
  else:
   save_art(n,'bread',alpha(a,[[541,214,718,401]]),vector=False)
   save_art(n,'rays',alpha(a,RAY_BOXES))
   save_art(n,'velocity',alpha(a,[[576,420,638,482]]))
   body=alpha(a,[[409,494,852,766]],erase=[LEVER_BOX]);d=ImageDraw.Draw(body)
   d.line([(815,576),(818,614)],fill=(255,255,255,255),width=9)
   save_art(n,'toaster',body)
   lever=alpha(a,[LEVER_BOX]);mask=Image.new('L',(NATIVE,NATIVE));d=ImageDraw.Draw(mask)
   d.rounded_rectangle((785,575,849,609),radius=12,fill=255);d.rectangle((777,589,790,599),fill=255)
   rgba=np.array(lever);opaque=np.array(mask)>0;rgba[opaque,:3]=a[opaque];rgba[opaque,3]=255
   lever=Image.fromarray(rgba,'RGBA');save_art(n,'lever',lever,vector=False)
   save_art(n,'counter-filled',alpha(a,FILLED_BOXES),vector=False)
   save_art(n,'counter-empty',alpha(a,EMPTY_BOXES))
   save_art(n,'crumbs',alpha(a,[[148,781,1104,930]],erase=[[230,820,1020,912]]),vector=False)
   params.update({'cycleSeconds':10,'popCount':8,'firstPopCycleSeconds':.20,'popIntervalSeconds':1,'leverBounds':LEVER_BOX,'leverTravel':14,'leverDown':'14*smoothstep(u/.16) through u=.30','leverRelease':'14*(1-smoothstep((u-.30)/.12)) after u=.30','breadSourcePivot':[627,310],'breadCrop':[427,110,827,510],'breadClipBelowY':523,'launchSecondsWithinPop':.30,'flightSeconds':.48,'flightFraction':'s=clamp((u-.30)/.48,0,1)','breadOffsetY':'285-285*4*s*(1-s)','breadOffsetX':'4*sin(pi*s)','breadRotationDegrees':'-2*sin(2*pi*s) about pivot','breadHiddenAtRest':True,'acknowledgeAtSecondsWithinPop':.54,'tileCentersX':TILE_CENTERS,'tileCenterY':867.5,'filledSourceBoxes':FILLED_BOXES,'emptySourceBoxes':EMPTY_BOXES,'tileRule':'advance one tile only after its slice reaches apex; all prior tiles remain filled','rayOpacity':'exp(-((s-.5)/.14)^2) only in flight','risingVelocityOpacity':'max(0,sin(2*pi*s)) only in flight','velocityClipBelowY':490,'counterAndCrumbFadeOutSeconds':[8.60,9.40],'invisibleCounterResetSeconds':[9.40,10],'semantics':'eight-pop illustrative fixture, not baking duration, food temperature or real host completion; real item events must control real counters'})
  if n==174:params['emptyTileSizing']='First five empty templates resize to the corresponding filledSourceBox width/height; last three retain their source dimensions. This keeps the original unequal spacing without intersecting outlines.'
  (ROOT/f'{stem(n)}-parameters.json').write_text(json.dumps(params,indent=2)+'\n')
 print('Prepared layered reference artwork and authored geometry/timing',flush=True)
def load_art(n,role,full=True):
 layer=Image.open(ROOT/f'{stem(n)}-{role}.webp').convert('RGBA');return resize(layer,n==172) if full else layer
def layers(n):
 base={'word':load_art(n,'word')}
 if n==172:base['frame']=load_art(n,'frame')
 elif n==173:
  for role in ['snail','bar','snore-marks']:base[role]=load_art(n,role)
  for j,box in enumerate(Z_BOXES):base[f'z{j+1}']=load_art(n,f'z{j+1}',False).crop(box)
  # Warp only the local snail rectangle; shell and contact samples remain exactly registered.
  x0,y0,x1,y1=[round(v*K) for v in [420,480,735,680]]
  source=np.asarray(base['snail'].crop((x0,y0,x1,y1)),dtype=float);yy,xx=np.mgrid[y0:y1,x0:x1];x=xx/K;y=yy/K
  dist=np.sqrt((x-539)**2+(y-573)**2);w=smooth((dist-104)/12)*smooth((x-618)/20)*smooth((671-y)/20)
  base['warp']=(source,xx-x0,y,w,(x0,y0))
  bbox=[round(v*K) for v in [208,695,532,728]];clip=Image.new('L',(OUT*AA,OUT*AA));ImageDraw.Draw(clip).rounded_rectangle(bbox,radius=round(11*K),fill=255)
  base['stripeClip']=np.asarray(clip);yy,xx=np.mgrid[:OUT*AA,:OUT*AA];base['stripeSum']=(xx+yy)/K
 else:
  for role in ['toaster','rays','velocity','crumbs']:base[role]=load_art(n,role)
  bread=load_art(n,'bread',False).crop((427,110,827,510));base['bread']=bread.resize((round(400*K),round(400*K)),Image.Resampling.LANCZOS)
  base['lever']=load_art(n,'lever',False).crop(LEVER_BOX).resize((round((LEVER_BOX[2]-LEVER_BOX[0])*K),round((LEVER_BOX[3]-LEVER_BOX[1])*K)),Image.Resampling.LANCZOS)
  filled=load_art(n,'counter-filled',False);empty=load_art(n,'counter-empty',False)
  base['filled']=[filled.crop(b) for b in FILLED_BOXES];base['empty']=[empty.crop(b) for b in EMPTY_BOXES]
 return base
def place(im,layer,center,scale=1):
 size=(max(1,round(layer.width*K*scale)),max(1,round(layer.height*K*scale)));sprite=layer.resize(size,Image.Resampling.LANCZOS)
 im.alpha_composite(sprite,(round(center[0]*K-size[0]/2),round(center[1]*K-size[1]/2)))
def frame(n,t,art):
 seconds=SPECS[n][2];t=t%seconds
 im=Image.new('RGBA',(OUT*AA,OUT*AA),(0,0,0,255));diagnostics={}
 if n==172:
  im.alpha_composite(art['frame']);d=ImageDraw.Draw(im)
  fade=1-float(smooth((t-6.6)/.8));committed=0
  for j,(x1,y1,x2,y2) in enumerate(CELLS):
   native_rect(d,(x1,y1,x2-1,y2-1),None,(*GREEN,255),4)
   elapsed=t-.4-j*.46;rows=int(np.clip(math.floor(8*elapsed/.18),0,8))
   if elapsed>=.18:committed+=1
   if rows:
    ybottom=y2-1;ytop=y2-round((y2-y1)*rows/8)
    flash=.20*math.sin(math.pi*(elapsed-.18)/.20) if .18<=elapsed<=.38 else 0
    col=tuple(round(c+(255-c)*flash) for c in GREEN)
    moving=Image.new('RGBA',im.size);native_rect(ImageDraw.Draw(moving),(x1,ytop,x2-1,ybottom),(*col,round(255*fade)))
    im.alpha_composite(moving)
  diagnostics={'committedCells':committed,'fillOpacity':fade,'phase':'illustrative acknowledgments'}
 elif n==173:
  im.alpha_composite(art['bar']);source,xx,y,w,origin=art['warp'];phase=2*math.pi*(t%4)/4
  sample_y=(671+(y-671)/(1+.018*math.sin(phase)*w))*K-origin[1]
  warped=np.stack([map_coordinates(source[:,:,c],[sample_y,xx],order=1,mode='constant',cval=0) for c in range(4)],axis=2).clip(0,255).astype('uint8')
  im.alpha_composite(Image.fromarray(warped,'RGBA'),origin)
  im.alpha_composite(opacity(art['snore-marks'],.30+.70*(.5+.5*math.sin(phase))))
  zs=[]
  for j in range(3):
   p=(t/4+.24+j/3)%1;op=float(smooth(p/.15)*(1-smooth((p-.72)/.28)));pos=(730+119*p,530-141*p-6*math.sin(math.pi*p))
   sprite=opacity(art[f'z{j+1}'],op);place(im,sprite,pos,.70+.65*p);zs.append({'phase':p,'opacity':op,'center':pos})
  shift=20*(t%1);mask=(np.mod(art['stripeSum']-shift,20)<9);matte=(art['stripeClip']*mask).astype('uint8')
  stripe=np.dstack([np.full((OUT*AA,OUT*AA,3),255,dtype='uint8'),matte]);im.alpha_composite(Image.fromarray(stripe,'RGBA'))
  diagnostics={'breathSin':math.sin(phase),'shellDisplacement':0,'contactDisplacement':0,'zGlyphs':zs,'stripeOffset':shift,'stripeExtent':[208,532]}
 else:
  age=t-.2;j=min(7,max(0,int(math.floor(max(0,age)))));u=age-j
  active=0<=age<8;flight=active and .30<=u<=.78
  s=float(np.clip((u-.30)/.48,0,1));dy=285-285*4*s*(1-s);dx=4*math.sin(math.pi*s);rotation=-2*math.sin(2*math.pi*s)
  if flight:
   moving=Image.new('RGBA',im.size);bread=art['bread'].rotate(-rotation,resample=Image.Resampling.BICUBIC)
   moving.alpha_composite(bread,(round((627+dx)*K-bread.width/2),round((310+dy)*K-bread.height/2)))
   # The front surface occludes all bread pixels inside/below the slot.
   m=moving.getchannel('A');ImageDraw.Draw(m).rectangle((0,round(523*K),OUT*AA,OUT*AA),fill=0);moving.putalpha(m);im.alpha_composite(moving)
   rays=opacity(art['rays'],math.exp(-((s-.5)/.14)**2));im.alpha_composite(rays)
   trail=opacity(art['velocity'],max(0,math.sin(2*math.pi*s)));shifted=Image.new('RGBA',im.size);shifted.alpha_composite(trail,(0,round(dy*K)))
   m=shifted.getchannel('A');ImageDraw.Draw(m).rectangle((0,round(490*K),OUT*AA,OUT*AA),fill=0);shifted.putalpha(m);im.alpha_composite(shifted)
  im.alpha_composite(art['toaster'])
  lever_dy=14*float(smooth(max(0,u)/.16)) if active and u<=.30 else 14*(1-float(smooth((u-.30)/.12))) if active else 0
  im.alpha_composite(art['lever'],(round(LEVER_BOX[0]*K),round((LEVER_BOX[1]+lever_dy)*K)))
  committed=int(np.clip(math.floor(t-.74)+1,0,8));fade=1-float(smooth((t-8.6)/.8))
  for i,cx in enumerate(TILE_CENTERS):
   sprite=art['empty'][i%3 if i<5 else i-5]
   if i<5:
    box=FILLED_BOXES[i];sprite=sprite.resize((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS)
   if i<committed and fade>0:
    # Crossfade to empty while the committed layer quietly resets.
    place(im,opacity(sprite,1-fade),(cx,867.5))
    place(im,opacity(art['filled'][i%5],fade),(cx,867.5))
   else:place(im,sprite,(cx,867.5))
  im.alpha_composite(opacity(art['crumbs'],fade if committed else 0))
  diagnostics={'popIndex':j,'localTime':u,'inFlight':flight,'flightFraction':s,'breadOffset':[dx,dy],'leverOffsetY':lever_dy,'committedToasts':committed,'counterOpacity':fade,'acknowledgmentsOccurred':max(0,committed),'lastAcknowledgmentTime':.74+committed-1 if committed else None}
 im.alpha_composite(art['word'])
 return im.convert('RGB').resize((OUT,OUT),Image.Resampling.LANCZOS),diagnostics
def render(n):
 art=layers(n);seconds=SPECS[n][2];frames=round(seconds*FPS);path=ROOT/f'{stem(n)}.mp4'
 process=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','900x900','-r','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
 samples=ROOT/'samples';samples.mkdir(exist_ok=True);checks=[];hashes=set();first=None;last=None;fixed_reference=None
 yy,xx=np.mgrid[:OUT,:OUT];nx=xx*NATIVE/OUT;ny=yy*NATIVE/OUT;fixed=np.zeros((OUT,OUT),bool)
 for x1,y1,x2,y2 in WORDS[n]:fixed|=(nx>=x1)&(nx<x2)&(ny>=y1)&(ny<y2)
 if n==173:
  fixed|=(nx-539)**2+(ny-573)**2<98**2
  fixed|=(nx>=423)&(nx<=731)&(ny>=673)&(ny<=679)
 elif n==174:fixed|=(nx>=425)&(nx<=765)&(ny>=544)&(ny<=750)
 elif n==172:fixed|=(nx>=105)&(nx<=1150)&(ny>=605)&(ny<=622)
 for i in range(frames):
  t=seconds*i/(frames-1);picture,data=frame(n,t,art);b=picture.tobytes();hashes.add(hashlib.sha256(b).hexdigest())
  fixed_pixels=np.asarray(picture)[fixed]
  if fixed_reference is None:fixed_reference=fixed_pixels.copy()
  assert np.array_equal(fixed_reference,fixed_pixels),f'{n}: stationary artwork moved at frame {i}'
  if i==0:first=b
  last=b;process.stdin.write(b);checks.append({'frame':i,'time':t,**data})
  if i%30==0 or i==frames-1:picture.save(samples/f'{n}-frame-{i:03}.png')
  if i%60==0:print(f'{n}: {i}/{frames}',flush=True)
 process.stdin.close();assert process.wait()==0 and first==last,'Encoding/loop endpoint failure'
 if n==174:
  for c in checks:
   count=c['committedToasts']
   if count:assert c['time']>=.74+count-1-1e-9,'Toast counted before ejection apex'
 evidence={172:{'orderedCellCommit':True,'frameAndTypographyStationary':True,'resetWhileFillInvisible':True},173:{'shellRemainsRigid':True,'footContactRemainsFixed':True,'zResetWhileInvisible':True,'stripeExtentRemainsFixed':True},174:{'oneToastCountPerEjection':True,'acknowledgmentAfterApex':True,'breadOccludedBelowSlot':True,'counterResetWhileInvisible':True}}[n]
 poster,_=frame(n,SPECS[n][3],art);poster.save(ROOT/f'{stem(n)}-poster.webp',quality=94,method=6)
 report={'number':n,'video':info(path),'poster':info(ROOT/f'{stem(n)}-poster.webp'),'previewRender':{'width':900,'height':900,'fps':30,'frames':frames,'durationSeconds':seconds,'audio':False,'faststart':True,'loopEndpointPixelsEqual':first==last,'uniqueSourceFrames':len(hashes)},'motionEvidence':evidence}
 (ROOT/f'{n}-render-report.json').write_text(json.dumps(report,indent=2)+'\n');(ROOT/f'{n}-diagnostics.json').write_text(json.dumps(checks,indent=2)+'\n');print(json.dumps(report),flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--prepare',action='store_true');parser.add_argument('--render',type=int);parser.add_argument('--sample',type=int);args=parser.parse_args()
 if args.prepare:prepare()
 if args.render:render(args.render)
 if args.sample:
  art=layers(args.sample)
  for t in [0,.4,.74,1.5,2.74,4.74,5.8,6.9,7.8,9.7]:
   if t>SPECS[args.sample][2]:continue
   image,_=frame(args.sample,t,art);image.save(ROOT/f'test-{args.sample}-{t:.2f}.png')
  print('Sample frames ready')
