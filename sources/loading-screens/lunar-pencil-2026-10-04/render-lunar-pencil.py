"""Two authored loading mechanisms from supplied stills, not recovered motion.
Pillow/numpy/contourpy + ffmpeg. --prepare, then --render 170 or 171.
"""
from pathlib import Path
import argparse, hashlib, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw
import contourpy

ROOT=Path(__file__).parent
NATIVE,OUT,AA,FPS,FRAMES,SECONDS=1254,900,2,30,240,8
K=OUT*AA/NATIVE
SPECS={170:('lunar-phase-sequence-loader',1,0),171:('pencil-hatch-loader',2,3.5)}
LABELS={170:[470,757,778,845],171:[448,842,778,938]}
MOONS=[(292,594.5,54),(452,595,54),(624,594,55),(801.5,594.5,54),(961.5,594.5,54.5)]
PHASES=[2.55,1.35,0,-1.35,-2.55]
BURST=[[622,478,627,514],[563,498,584,527],[665,498,686,527],[519,592,546,597],[702,592,731,597],[565,661,585,689],[666,661,686,689],[623,672,628,706]]
DOTS=[[159,590,216,601],[1038,590,1095,601]]
PENCIL_POLY=[(807,670),(839,576),(960,408),(978,405),(1011,429),(1011,446),(889,618)]
PENCIL_PIVOT=(812,666)
BAR_POINTS=[(254,666),(605,667),(809,667),(850,661),(975,661),(979,671),(979,750),(974,757),(258,756),(253,753),(253,667),(254,666)]
INK_SAMPLES=3201

def stem(n):return f'{n}-{SPECS[n][0]}-2026-10-04-c1'
def smooth(x):x=max(0,min(1,float(x)));return x*x*(3-2*x)
def info(path):
    data=path.read_bytes();return {'filename':path.name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def alpha(a,boxes=None,polygon=None):
    gray=a.max(2).astype(float);mask=Image.new('L',(NATIVE,NATIVE));d=ImageDraw.Draw(mask)
    for x1,y1,x2,y2 in boxes or []:d.rectangle((x1,y1,x2-1,y2-1),fill=255)
    if polygon:d.polygon(polygon,fill=255)
    matte=np.where((np.array(mask)>0)&(gray>16),np.clip((gray-8)*255/247,0,255),0).astype('uint8')
    return Image.fromarray(np.dstack([np.full((*gray.shape,3),255,dtype='uint8'),matte]),'RGBA')
def trace(layer):
    loops=contourpy.contour_generator(z=(np.asarray(layer.getchannel('A'))>128).astype(float),name='serial').lines(.5)
    paths=['M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in p)+' Z' for p in loops if len(p)>=4]
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><path fill="#fff" fill-rule="evenodd" d="'+' '.join(paths)+'"/></svg>\n'
def line(draw,points,width,color=(255,255,255,255)):
    xy=[(x*K,y*K) for x,y in points];w=max(1,round(width*K));draw.line(xy,fill=color,width=w,joint='curve');r=width*K/2
    for x,y in [xy[0],xy[-1]]:draw.ellipse((x-r,y-r,x+r,y+r),fill=color)
def ink_at(p):
    phase=52*math.pi*p
    return np.array([270+686*p+18*math.sin(phase),711-29*math.sin(phase)])
INK_P=np.linspace(0,1,INK_SAMPLES)
INK=np.asarray([ink_at(float(p)) for p in INK_P])
def ink_position(p):
    return np.array([np.interp(p,INK_P,INK[:,i]) for i in range(2)])
def prepare():
    for n,(slug,index,poster) in SPECS.items():
        original=Image.open(ROOT/f'reference-{index}.png').convert('RGB');a=np.array(original)
        original.save(ROOT/f'{stem(n)}-reference.webp',lossless=True)
        word=alpha(a,[LABELS[n]]);word.save(ROOT/f'{stem(n)}-word.webp',lossless=True)
        (ROOT/f'{stem(n)}-word.svg').write_text(trace(word))
        params={'nativeStage':[1254,1254],'preview':{'width':900,'height':900,'fps':30,'frames':240,'durationSeconds':8,'audio':False,'faststart':True,'closedSampling':'t=8*frameIndex/239; component uses actual elapsed seconds'},'labelBounds':LABELS[n],'stationaryLabel':True,'motionAuthorship':'authored from a supplied still'}
        if n==170:
            decorations=alpha(a,DOTS);decorations.save(ROOT/f'{stem(n)}-dots.webp',lossless=True)
            (ROOT/f'{stem(n)}-dots.svg').write_text(trace(decorations))
            rays=alpha(a,BURST);rays.save(ROOT/f'{stem(n)}-rays.webp',lossless=True)
            (ROOT/f'{stem(n)}-rays.svg').write_text(trace(rays))
            texture=original.crop((569,539,679,649));texture.save(ROOT/f'{stem(n)}-moon-texture.webp',lossless=True)
            params.update({'moonDiscs':MOONS,'phaseOffsetsRadians':PHASES,'phasePeriodSeconds':8,'textureSourceCrop':[569,539,679,649],'textureMapping':'same visible central full-moon texture mapped without rotation to each local disc; hidden original outer-moon pixels are not recovered','sphere':'u=(pixel-center)/radius, v=(pixel-center)/radius, z=sqrt(max(0,1-u*u-v*v))','light':'L=(sin(theta),0,cos(theta)); theta=offset-2*pi*t/8','terminator':'d=u*sin(theta)+z*cos(theta); q=clamp((d+0.018)/0.036,0,1); illuminated=q*q*(3-2*q)','luminance':'sourceTexture*(0.075+0.925*illuminated); outside u*u+v*v<=1 is black','centralRayOpacity':'((1+cos(2*pi*t/8))/2)^6','stationaryDots':DOTS,'rayBoxes':BURST,'astronomicalData':False})
        else:
            pencil=alpha(a,polygon=PENCIL_POLY);pencil.save(ROOT/f'{stem(n)}-pencil.webp',lossless=True)
            (ROOT/f'{stem(n)}-pencil.svg').write_text(trace(pencil))
            bar=Image.new('RGBA',(OUT*AA,OUT*AA));line(ImageDraw.Draw(bar),BAR_POINTS,6.5)
            bar=bar.resize((NATIVE,NATIVE),Image.Resampling.LANCZOS);bar.save(ROOT/f'{stem(n)}-bar.webp',lossless=True)
            (ROOT/f'{stem(n)}-bar.svg').write_text(trace(bar))
            params.update({'pencilSourcePivot':PENCIL_PIVOT,'pencilMaskPolygon':PENCIL_POLY,'barPolyline':BAR_POINTS,'barStroke':6.5,'inkClip':[264,677,967,746],'inkStroke':5.1,'inkLinecap':'round','inkPath':'x=270+686*p+18*sin(52*pi*p); y=711-29*sin(52*pi*p), 0<=p<=1','inkLookupSamples':INK_SAMPLES,'strokePrefix':'ink lookup only up to p; include interpolated head as final point','draw':{'startSeconds':.35,'durationSeconds':5.6,'p':'smoothstep((t-.35)/5.6)','tip':'exact interpolated ink prefix head, with no offset during contact','wristDegrees':'3*sin(52*pi*p)','approachLift':'18*(1-smoothstep((t-.1)/.25))','finalLift':'22*smoothstep((t-5.95)/.25)','finalTiltDegrees':'-5*smoothstep((t-5.95)/.25)','pencilFadeIn':[.05,.25],'endHold':[6.2,6.6],'inkAndPencilFadeOut':[6.6,7.4],'invisibleReset':[7.4,8]},'progressSemantics':'indeterminate decorative hatch, not a measured task percentage; optional real progress may replace p only when host reports genuine progress'})
        (ROOT/f'{stem(n)}-parameters.json').write_text(json.dumps(params,indent=2)+'\n')
    print('Prepared clean independent artwork and exact motion parameters',flush=True)
def layers(n):
    word=Image.open(ROOT/f'{stem(n)}-word.webp').convert('RGBA').resize((OUT*AA,OUT*AA),Image.Resampling.LANCZOS)
    if n==170:
        dots=Image.open(ROOT/f'{stem(n)}-dots.webp').convert('RGBA').resize(word.size,Image.Resampling.LANCZOS)
        rays=Image.open(ROOT/f'{stem(n)}-rays.webp').convert('RGBA').resize(word.size,Image.Resampling.LANCZOS)
        texture=Image.open(ROOT/f'{stem(n)}-moon-texture.webp').convert('RGB')
        discs=[]
        for x,y,r in MOONS:
            dim=math.ceil(2*r*K)+4;c=(dim-1)/2
            yy,xx=np.mgrid[:dim,:dim];u=(xx-c)/(r*K);v=(yy-c)/(r*K)
            valid=u*u+v*v<=1;z=np.sqrt(np.maximum(0,1-u*u-v*v))
            tex=np.asarray(texture.resize((dim,dim),Image.Resampling.LANCZOS),dtype=float)
            discs.append((dim,u,z,valid,tex))
        return word,dots,rays,discs
    bar=Image.open(ROOT/f'{stem(n)}-bar.webp').convert('RGBA').resize(word.size,Image.Resampling.LANCZOS)
    full=Image.open(ROOT/f'{stem(n)}-pencil.webp').convert('RGBA')
    # A square centered on the nib allows exact local rotations around contact.
    crop=Image.new('RGBA',(720,720));crop.alpha_composite(full.crop((452,306,1172,1026)))
    pencil=crop.resize((round(720*K),round(720*K)),Image.Resampling.LANCZOS)
    return word,bar,pencil
def frame(n,t,art):
    im=Image.new('RGBA',(OUT*AA,OUT*AA),(0,0,0,255))
    if n==170:
        word,dots,rays,discs=art;im.alpha_composite(dots)
        # A modulo clock makes t=8 exactly t=0, including floating-point endpoints.
        phase=2*math.pi*(t%8)/8
        illum=[]
        for (x,y,r),offset,(dim,u,z,valid,tex) in zip(MOONS,PHASES,discs):
            theta=offset-phase;d=u*math.sin(theta)+z*math.cos(theta)
            q=np.clip((d+.018)/.036,0,1);light=q*q*(3-2*q)
            rgb=np.clip(tex*(.075+.925*light[...,None]),0,255).astype('uint8');rgb[~valid]=0
            patch=Image.fromarray(np.dstack([rgb,(valid*255).astype('uint8')]),'RGBA')
            im.alpha_composite(patch,(round(x*K-(dim-1)/2),round(y*K-(dim-1)/2)))
            illum.append((1+math.cos(theta))/2)
        opacity=((1+math.cos(phase))/2)**6
        ray=rays.copy();ray.putalpha(ray.getchannel('A').point(lambda a:round(a*opacity)));im.alpha_composite(ray)
        diagnostics={'phaseRadians':phase,'illuminatedFractions':illum,'centralRayOpacity':opacity}
    else:
        word,bar,pencil=art;im.alpha_composite(bar)
        moving=Image.new('RGBA',im.size);draw=ImageDraw.Draw(moving)
        p=smooth((t-.35)/5.6);q=ink_position(p)
        op=1-smooth((t-6.6)/.8)
        end=int(np.searchsorted(INK_P,p,side='right'))
        pts=np.vstack([INK[:end],q])
        if p>0:line(draw,pts.tolist(),5.1,(255,255,255,round(255*op)))
        # Clip only the ink layer, never the independent pencil or status word.
        clip=Image.new('L',im.size);ImageDraw.Draw(clip).rectangle(tuple(round(v*K) for v in (264,677,967,746)),fill=255)
        moving.putalpha(Image.fromarray((np.asarray(moving.getchannel('A'),dtype=np.uint16)*np.asarray(clip,dtype=np.uint16)//255).astype('uint8')))
        phase=52*math.pi*p;lift=18*(1-smooth((t-.1)/.25))+22*smooth((t-5.95)/.25)
        angle=3*math.sin(phase)-5*smooth((t-5.95)/.25)
        nib=q+np.array([0,-lift]);icon=pencil.rotate(-angle,resample=Image.Resampling.BICUBIC,expand=False)
        pencil_op=op*smooth((t-.05)/.2)
        icon.putalpha(icon.getchannel('A').point(lambda a:round(a*pencil_op)))
        moving.alpha_composite(icon,(round(nib[0]*K-icon.width/2),round(nib[1]*K-icon.height/2)))
        im.alpha_composite(moving)
        diagnostics={'pathFraction':p,'inkHead':q.tolist(),'pencilNib':nib.tolist(),'contact':.35<=t<=5.95,'wristDegrees':angle,'lift':lift,'layerOpacity':op}
    im.alpha_composite(word)
    return im.convert('RGB').resize((OUT,OUT),Image.Resampling.LANCZOS),diagnostics
def render(n):
    art=layers(n);path=ROOT/f'{stem(n)}.mp4'
    process=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','900x900','-r','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
    samples=ROOT/'samples';samples.mkdir(exist_ok=True);first=None;last=None;hashes=set();checks=[]
    for i in range(FRAMES):
        t=SECONDS*i/(FRAMES-1);image,data=frame(n,t,art);b=image.tobytes();hashes.add(hashlib.sha256(b).hexdigest())
        if i==0:first=b
        last=b;process.stdin.write(b)
        if i%30==0 or i==239:image.save(samples/f'{n}-frame-{i:03}.png')
        checks.append({'frame':i,'time':t,**data})
        if i%60==0:print(f'{n}: {i}/240',flush=True)
    process.stdin.close();assert process.wait()==0
    assert first==last,'Loop endpoints differ'
    if n==171:
        assert all(np.linalg.norm(np.asarray(c['inkHead'])-np.asarray(c['pencilNib']))<1e-9 for c in checks if c['contact'])
        assert np.min(INK[:,0])-5.1/2>264 and np.max(INK[:,0])+5.1/2<967
        assert np.min(INK[:,1])-5.1/2>677 and np.max(INK[:,1])+5.1/2<746
    poster,_=frame(n,SPECS[n][2],art);poster.save(ROOT/f'{stem(n)}-poster.webp',quality=94,method=6)
    report={'number':n,'video':info(path),'poster':info(ROOT/f'{stem(n)}-poster.webp'),'previewRender':{'width':900,'height':900,'fps':30,'frames':240,'durationSeconds':8,'audio':False,'faststart':True,'loopEndpointPixelsEqual':first==last,'uniqueSourceFrames':len(hashes)}}
    if n==171:report['motionEvidence']={'nibMatchesInkHeadDuringDrawing':True,'inkRemainsInsideBar':True,'resetWhileInvisible':True,'pathSamples':INK_SAMPLES}
    else:report['motionEvidence']={'fixedMoonCenters':True,'fixedTextureMapping':True,'sphereTerminator':True,'fullPhaseOnlyRayEmphasis':True}
    (ROOT/f'{n}-render-report.json').write_text(json.dumps(report,indent=2)+'\n')
    (ROOT/f'{n}-diagnostics.json').write_text(json.dumps(checks,indent=2)+'\n')
    print(json.dumps(report),flush=True)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--prepare',action='store_true');parser.add_argument('--render',type=int);parser.add_argument('--sample',type=int);args=parser.parse_args()
    if args.prepare:prepare()
    if args.render:render(args.render)
    if args.sample:
        for t in [0,.35,1,2,3,4,5,5.95,6.4,7.2]:
            image,_=frame(args.sample,t,layers(args.sample));image.save(ROOT/f'test-{args.sample}-{t:.2f}.png')
        print('Sample frames ready')
