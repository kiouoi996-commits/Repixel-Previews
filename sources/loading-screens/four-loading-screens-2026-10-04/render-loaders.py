"""Deterministic authored loading studies from four user-supplied stills.
Pillow/numpy/scipy preserve supplied visible artwork; no recovered animation is claimed.
"""
from pathlib import Path
import hashlib, json, math, subprocess
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import map_coordinates, label, find_objects
import contourpy

ROOT = Path(__file__).parent
SIZE, OUT, FPS, FRAMES, DURATION = 1254, 900, 30, 180, 6
ATTACHMENTS = json.loads((ROOT / 'attachments.json').read_text())
NAMES = ['neon-liquid-cup-loader', 'golden-sand-hourglass-loader', 'cyan-paper-plane-orbit-loader', 'neon-rocket-orbit-loader']
LAYERS = {
    1: {'frame': (409, 526, 920, 820), 'steam': (550, 269, 689, 506), 'liquid': (445, 616, 813, 791), 'bubbles': (548, 557, 644, 648), 'label': (446, 932, 656, 992)},
    2: {'frame': (440, 278, 815, 904), 'upper-sand': (505, 442, 739, 615), 'lower-sand': (483, 764, 769, 853), 'grains': (592, 613, 654, 787), 'label': (441, 975, 657, 1035)},
    3: {'flight': (307, 249, 931, 886), 'label': (411, 970, 635, 1036)},
    4: {'rocket': (731, 216, 936, 425), 'trail': (449, 422, 959, 899), 'flame': (702, 368, 797, 465), 'label': (444, 1008, 657, 1068)},
}
DOTS = {1: [(705,962,13), (751,962,12), (797,962,12)], 2: [(706,1004,12),(754,1004,12),(800,1004,12)], 3: [(684,1000,14),(736,1000,14),(785,1000,14)], 4: [(703,1038,13),(751,1038,12),(797,1038,12)]}
COLORS = {1:(251,2,94), 2:(255,222,4), 3:(0,250,253), 4:(11,251,59)}
BUBBLES=[(572,606,15.5),(609,574,7.5),(620,627,4.5),(628,638,8)]
TRAIL_BEADS=[(881,452,25),(928,618,23),(850,794,23),(707,875,18),(559,870,11),(468,821,9)]

def clean_colored_layer(a, box, mask, threshold):
    x1,y1,x2,y2=box
    crop=a[y1:y2,x1:x2]
    matte=(mask[y1:y2,x1:x2] & (crop.max(2)>threshold)).astype('uint8')*255
    alpha=Image.fromarray(matte).filter(ImageFilter.GaussianBlur(.45))
    image=Image.fromarray(crop).convert('RGBA');image.putalpha(alpha)
    return image

def clean_bubbles(box):
    image=Image.new('RGBA',(SIZE,SIZE))
    draw=ImageDraw.Draw(image)
    for x,y,r in BUBBLES:draw.ellipse((x-r,y-r,x+r,y+r),fill=(*COLORS[1],255))
    return image.crop(box)

def clean_trail(box):
    image=Image.new('RGBA',(SIZE,SIZE));draw=ImageDraw.Draw(image)
    for angle in range(-37,133):
        f=(132-angle)/169
        color=(0,round(30+225*f**1.3),round(10+49*f**1.3),255)
        points=[]
        for value in [angle,angle+1.2]:
            r=math.radians(value);points.append((650+279*math.cos(r),618+273*math.sin(r)))
        draw.line(points,fill=color,width=8)
    for x,y,r in TRAIL_BEADS:draw.ellipse((x-r,y-r,x+r,y+r),fill=(142,251,160,255))
    glow=image.filter(ImageFilter.GaussianBlur(7));glow.putalpha(glow.getchannel('A').point(lambda x:round(x*.12)))
    glow.alpha_composite(image)
    return glow.crop(box)

def info(path):
    b=path.read_bytes()
    return {'filename':path.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}

def color_mask(a, kind):
    a=a.astype(float)
    if kind==1: return (a[...,0]>25)&(a[...,0]>a[...,1]*2)&(a[...,2]>a[...,1]*1.7)
    if kind==2: return (a[...,0]>25)&(a[...,1]>a[...,2]*2)&(a[...,0]>a[...,2]*2)
    if kind==3: return (a[...,2]>25)&(a[...,2]>a[...,0]*1.8)&(a[...,1]>a[...,0]*1.8)
    return (a[...,1]>5)&(a[...,1]>a[...,0]*1.025)&(a[...,1]>a[...,2]*1.025)

def alpha_layer(a, box, selection=None):
    x1,y1,x2,y2=box
    crop=a[y1:y2,x1:x2].astype(float)
    alpha=crop.max(2)
    if selection is not None: alpha*=selection[y1:y2,x1:x2]
    rgb=np.divide(crop*255,alpha[...,None],out=np.zeros_like(crop),where=alpha[...,None]>0)
    layer=Image.fromarray(np.dstack([np.clip(rgb,0,255),alpha]).astype('uint8'),'RGBA')
    return layer

def paste(frame, layer, pos, opacity=1):
    if opacity!=1:
        layer=layer.copy();layer.putalpha(layer.getchannel('A').point(lambda x:round(x*opacity)))
    frame.paste(layer,pos,layer)

def full_layer(a,box,selection=None):
    result=Image.new('RGBA',(SIZE,SIZE))
    result.alpha_composite(alpha_layer(a,box,selection),box[:2])
    return result

def warp_vertical(layer, phase, amplitude, anchor, span, spatial=0.017):
    a=np.array(layer).astype(float)
    h,w=a.shape[:2];ys,xs=np.mgrid[:h,:w]
    factor=np.clip(np.abs(ys-anchor)/span,0,1)
    dy=amplitude*(np.sin(xs*spatial-phase)-np.sin(xs*spatial))*factor
    sy=np.clip(ys-dy,0,h-1)
    out=np.stack([map_coordinates(a[...,c],[sy,xs],order=1,mode='constant',cval=0) for c in range(4)],2)
    return Image.fromarray(np.clip(out,0,255).astype('uint8'),'RGBA')

def trace(mask):
    loops=contourpy.contour_generator(z=mask.astype(float),name='serial').lines(.5)
    parts=[]
    for points in loops:
        if len(points)<6:continue
        points=points[::2] if len(points)>30 else points
        parts.append('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+' Z')
    return ' '.join(parts)

def vectors(a, kind, stem):
    hi=a.max(2).astype(float);lo=a.min(2).astype(float)
    white=(lo>115)&(hi-lo<40)
    label_y={1:932,2:975,3:970,4:1008}[kind]
    white[:label_y]=False
    label_path=trace(white)
    label_svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><path fill="white" fill-rule="evenodd" d="{label_path}"/></svg>\n'
    (ROOT/f'{stem}-loading-word.svg').write_text(label_svg)
    paths={}
    for name,box in LAYERS[kind].items():
        mask=np.zeros((SIZE,SIZE),bool);x1,y1,x2,y2=box
        if name=='label': continue
        region=(lo>115)&(hi-lo<40) if name in ['frame','steam','rocket'] else color_mask(a,kind)
        mask[y1:y2,x1:x2]=region[y1:y2,x1:x2]
        paths[name]=trace(mask)
    return paths

def render(kind):
    source=Image.open(ROOT/f'reference-{kind}.png').convert('RGB')
    a=np.array(source)
    n=162+kind;stem=f'{n}-{NAMES[kind-1]}-2026-10-04-a1'
    saturation=color_mask(a,kind)
    layer_files=[]
    layers={}
    for name,box in LAYERS[kind].items():
        sel=saturation if name in ['liquid','bubbles','upper-sand','lower-sand','grains','trail','flame'] else None
        if name=='trail':
            sel=saturation.copy();sel[368:465,702:797]=False
        if name=='frame': sel=(a.min(2)>10)&((a.max(2).astype(float)-a.min(2))<12)
        if name=='rocket':
            yy=np.indices(a.shape[:2])[0]
            sel=((a.min(2)>10)&((a.max(2).astype(float)-a.min(2))<30))|(saturation&(yy<350))
        layer=alpha_layer(a,box,sel)
        if name in ['liquid','upper-sand','lower-sand']:
            layer=clean_colored_layer(a,box,saturation,100 if kind==1 else 150)
        if name=='bubbles':layer=clean_bubbles(box)
        if name=='trail':layer=clean_trail(box)
        if name=='flame':layer=clean_colored_layer(a,box,sel,70)
        filename=f'{stem}-{name}.webp';layer.save(ROOT/filename,lossless=True)
        layer_files.append({'role':name,'bounds':list(box),**info(ROOT/filename)})
        layers[name]=layer
    paths=vectors(a,kind,stem)
    params={
        'number':n,'nativeSize':[SIZE,SIZE],'durationSeconds':DURATION,'fps':FPS,'frames':FRAMES,
        'source':'user-supplied still','motionAuthorship':'authored','layers':layer_files,
        'loadingWord':info(ROOT/f'{stem}-loading-word.svg'),'vectorContours':paths,
        'dotCentersAndRadii':DOTS[kind],'accentRGB':COLORS[kind],
        'dotPulse':{'periodSeconds':1.5,'phaseSeparationRadians':2*math.pi/3,'minimumBrightness':.42,'power':2},
        'referenceDotRGB':[a[y,x].tolist() for x,y,r in DOTS[kind]],
    }
    if kind==1:params['motion']={'liquidPeriodSeconds':3,'amplitudePixels':8,'spatialRadiansPerPixel':.017,'liquidAnchorLocalY':175,'liquidAnchorSpan':175,'steamPeriodSeconds':3,'steamHorizontalAmplitude':6,'steamVerticalAmplitude':10,'steamOpacityMinimum':.75,'bubblePeriodSeconds':2,'bubbleHorizontalAmplitude':4,'bubbleRisePixels':16}
    if kind==2:params['motion']={'upperPeriodSeconds':3,'upperAmplitudePixels':4,'upperAnchorLocalY':169,'upperAnchorSpan':169,'lowerPeriodSeconds':3,'lowerAmplitudePixels':5,'lowerAnchorLocalY':89,'lowerAnchorSpan':89,'grainYRange':[618,784],'grainSpeedPixelsPerSecond':110.66666666666667,'grainCycleSeconds':1.5}
    if kind==3:params['motion']={'center':[612,575],'rotationDegreesPerSecond':-60,'periodSeconds':6,'direction':'counterclockwise','rotatingLayer':'flight','labelStationary':True}
    if kind==4:params['motion']={'center':[650,618],'trailRotationDegreesPerSecond':-60,'trailPeriodSeconds':6,'trackEllipseBounds':[371,345,929,891],'trackStrokePixels':8,'trackRGB':[39,40,39],'rocketStationary':True,'flamePeriodSeconds':.6,'flameOpacityMinimum':.66,'flameScaleAmplitude':.14,'flameAnchor':[777,385],'flameAxis':[-.67,.742],'starPeriodsSeconds':[3,2],'starOpacityMinimum':.65,'trailBeads':TRAIL_BEADS,'trailStartDegrees':-37,'trailEndDegrees':132,'trailRadii':[279,273],'trailGlowBlur':7,'trailGlowOpacity':.12}
    if kind==1:params['motion']['bubbles']=BUBBLES
    params['assetReconstruction']='White artwork and wording preserve supplied visible pixels. Colored fill mattes are cleaned; cup bubbles and rocket trail are redrawn from measured visible geometry to avoid moving baked shadows.'
    (ROOT/f'{stem}-parameters.json').write_text(json.dumps(params,indent=2)+'\n')
    source.save(ROOT/f'{stem}-reference.webp',lossless=True)
    source.resize((OUT,OUT),Image.Resampling.LANCZOS).save(ROOT/f'{stem}.webp',quality=91,method=6)
    base=source.copy()
    d=ImageDraw.Draw(base)
    if kind==1:
        for name in ['steam','liquid','bubbles']:d.rectangle(LAYERS[kind][name],fill='black')
    elif kind==2:
        for name in ['upper-sand','lower-sand','grains']:d.rectangle(LAYERS[kind][name],fill='black')
    elif kind==3:d.rectangle(LAYERS[kind]['flight'],fill='black')
    else:
        base=Image.new('RGB',(SIZE,SIZE),'black')
        base.paste(source.crop((440,1008,825,1070)),(440,1008))
        ImageDraw.Draw(base).ellipse([371,345,929,891],outline=(39,40,39),width=8)
        for x,y in [(292,282),(388,363),(328,519),(491,661),(1057,497),(1006,798),(335,850)]:
            base.paste(source.crop((x-9,y-9,x+9,y+9)),(x-9,y-9))
        paste(base,layers['rocket'],LAYERS[kind]['rocket'][:2])
    grain_records=[]
    if kind==2:
        ids,count=label(saturation[613:787,592:654])
        for idx,sl in enumerate(find_objects(ids),1):
            if sl is None:continue
            block=(ids[sl]==idx)
            if block.sum()<8 or block.sum()>200:continue
            yy,xx=np.where(block)
            grain_records.append({'x':592+sl[1].start+float(xx.mean()),'y':613+sl[0].start+float(yy.mean()),'radius':max(1.5,math.sqrt(block.sum()/math.pi)),'rgb':a[613+sl[0].start+int(yy.mean()),592+sl[1].start+int(xx.mean())].tolist()})
        params['grains']=grain_records
        (ROOT/f'{stem}-parameters.json').write_text(json.dumps(params,indent=2)+'\n')
    flight=full_layer(a,LAYERS[3]['flight']) if kind==3 else None
    trail_selection=saturation.copy()
    if kind==4:trail_selection[368:465,702:797]=False
    trail=Image.new('RGBA',(SIZE,SIZE)) if kind==4 else None
    flame=Image.new('RGBA',(SIZE,SIZE)) if kind==4 else None
    if kind==4:
        trail.alpha_composite(layers['trail'],LAYERS[4]['trail'][:2])
        flame.alpha_composite(layers['flame'],LAYERS[4]['flame'][:2])
    samples=ROOT/'samples';samples.mkdir(exist_ok=True)
    output=ROOT/f'{stem}.mp4'
    process=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OUT}x{OUT}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
    hashes=set();first=last=None
    for f in range(FRAMES):
        t=f*DURATION/(FRAMES-1)
        phase=2*math.pi*t/3
        frame=base.copy()
        if kind==1:
            liquid=warp_vertical(layers['liquid'],phase,8,175,175)
            paste(frame,liquid,LAYERS[kind]['liquid'][:2])
            paste(frame,layers['steam'],(550+round(6*math.sin(phase)),269-round(10*(1-math.cos(phase)))),.75+.25*math.cos(phase)**2)
            bp=2*math.pi*t/2
            paste(frame,layers['bubbles'],(548+round(4*math.sin(bp)),557-round(16*math.sin(bp/2)**2)),.72+.28*math.cos(bp/2)**2)
        elif kind==2:
            paste(frame,warp_vertical(layers['upper-sand'],phase,4,169,169),LAYERS[kind]['upper-sand'][:2])
            paste(frame,warp_vertical(layers['lower-sand'],phase,5,89,89),LAYERS[kind]['lower-sand'][:2])
            draw=ImageDraw.Draw(frame)
            for g in grain_records:
                y=618+((g['y']-618+110.66666666666667*t)%166)
                x=g['x']+1.5*math.sin(phase+g['y']*.1);r=g['radius']
                fade=min(1,(y-618)/8,(784-y)/8)
                color=tuple(round(v*max(0,fade)) for v in g['rgb'])
                draw.ellipse((x-r,y-r,x+r,y+r),fill=color)
        elif kind==3:
            moving=flight.rotate(60*t,Image.Resampling.BICUBIC,center=(612,575))
            paste(frame,moving,(0,0))
        else:
            moving=trail.rotate(60*t,Image.Resampling.BICUBIC,center=(650,618))
            paste(frame,moving,(0,0))
            fp=2*math.pi*t/.6
            k=1+.14*math.sin(fp)
            v=np.array([-.67,.742]);v=v/np.linalg.norm(v)
            mat=np.eye(2)+(1/k-1)*np.outer(v,v)
            anchor=np.array([777,385]);bias=anchor-mat@anchor
            flame_frame=flame.transform((SIZE,SIZE),Image.Transform.AFFINE,tuple([mat[0,0],mat[0,1],bias[0],mat[1,0],mat[1,1],bias[1]]),resample=Image.Resampling.BICUBIC)
            paste(frame,flame_frame,(0,0),.66+.34*(.5+.5*math.cos(fp)))
            for bx,by,star_period in [(507,235,3),(965,915,2)]:
                crop=source.crop((bx-30,by-30,bx+30,by+30))
                brightness=.65+.35*(.5+.5*math.cos(2*math.pi*t/star_period))
                arr=(np.array(crop).astype(float)*brightness).astype('uint8')
                frame.paste(Image.fromarray(arr),(bx-30,by-30))
        if kind in [1,2]:paste(frame,layers['frame'],LAYERS[kind]['frame'][:2])
        draw=ImageDraw.Draw(frame)
        for i,(x,y,r) in enumerate(DOTS[kind]):
            p=2*math.pi*t/1.5-2*math.pi*i/3
            opacity=.42+.58*(.5+.5*math.cos(p))**2
            initial=.42+.58*(.5+.5*math.cos(-2*math.pi*i/3))**2
            color=tuple(min(255,round(v*opacity/initial)) for v in a[y,x])
            draw.ellipse((x-r,y-r,x+r,y+r),fill=color)
        # The true supplied resting composition is retained at both loop endpoints.
        if f in [0,FRAMES-1]:frame=source.copy()
        final=frame.resize((OUT,OUT),Image.Resampling.LANCZOS)
        raw=final.tobytes();hashes.add(hashlib.sha256(raw).hexdigest())
        if f==0:first=raw
        if f==FRAMES-1:last=raw
        if f in [0,30,60,90,120,150,179]:final.save(samples/f'{n}-frame-{f:03}.png')
        process.stdin.write(raw)
    process.stdin.close();assert process.wait()==0
    assert first==last and len(hashes)>120
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(output)]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    assert int(video['nb_frames'])==FRAMES and video['pix_fmt']=='yuv420p'
    assert abs(float(probe['format']['duration'])-DURATION)<.01
    b=output.read_bytes();assert b.find(b'moov')<b.find(b'mdat')
    return {'number':n,'slug':NAMES[kind-1],'sourceAttachment':ATTACHMENTS[kind-1],'video':info(output),'poster':info(ROOT/f'{stem}.webp'),'reference':info(ROOT/f'{stem}-reference.webp'),'parameters':info(ROOT/f'{stem}-parameters.json'),'loadingWord':info(ROOT/f'{stem}-loading-word.svg'),'layers':layer_files,'previewRender':{'width':OUT,'height':OUT,'fps':FPS,'frames':FRAMES,'durationSeconds':DURATION,'audio':False,'faststart':True,'loopEndpointPixelsEqual':True,'uniqueSourceFrames':len(hashes)}}

if __name__=='__main__':
    manifest=json.loads((ROOT/'media-manifest.json').read_text()) if (ROOT/'media-manifest.json').exists() else []
    kinds=[int(x) for x in sys.argv[1:]] or list(range(1,5))
    for kind in kinds:
        item=render(kind);manifest=[m for m in manifest if m['number']!=item['number']]+[item];manifest.sort(key=lambda m:m['number'])
        (ROOT/'media-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        print(json.dumps({'number':item['number'],'videoBytes':item['video']['bytes'],'uniqueFrames':item['previewRender']['uniqueSourceFrames']}),flush=True)
