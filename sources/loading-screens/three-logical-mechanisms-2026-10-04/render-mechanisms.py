"""Three authored loader mechanisms. Native stage 1254; no original animation supplied.
Pillow/numpy/scipy/contourpy, ffmpeg. --prepare then --render 167|168|169.
"""
from pathlib import Path
import argparse, hashlib, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw
from scipy.interpolate import CubicSpline
import contourpy

ROOT=Path(__file__).parent
NATIVE,OUT,AA,FPS,FRAMES,SECONDS=1254,900,2,30,240,8
K=OUT*AA/NATIVE
SPECS={167:('dot-wave-loader',1,0.5),168:('loop-flight-loader',2,6.1),169:('step-climb-loader',3,3.15)}
DOTS=[(636,439,11.1),(707.5,459,9.2),(755,510,8.2),(772.5,581.5,6.7),(746.5,657.5,7.3),(676.5,707,13.7),(600,709.5,16.9),(533,671.5,19.7),(498.5,603.5,20.25),(505.5,528.5,20.5),(549,468.5,20.65)]
CUBICS=[[[305,744.5],[386,803],[514,812],[601,720]],[[601,720],[648.85,669.4],[643,618],[607,604]],[[607,604],[546,580.277778],[506,634],[531,685]],[[531,685],[559,742.12],[635,756],[710,713]],[[710,713],[809,656.24],[844,541],[906,493]]]
STEPS=[[399,723],[484.5,695],[567.5,660],[651.5,622],[742.5,567],[849.5,492]]
LABEL_BOX={167:[506,786,750,890],168:[487,826,775,943],169:[482,814,770,936]}
PLANE_BOX=[824,423,996,565]
STEP_BOXES=[[339,720,915,772],[456,692,513,757],[538,657,597,757],[622,618,681,757],[708,563,777,757],[814,489,885,757]]

def stem(n):return f'{n}-{SPECS[n][0]}-2026-10-04-c1'
def info(path):
    b=path.read_bytes();return {'filename':path.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
def smooth(x):x=max(0,min(1,float(x)));return x*x*(3-2*x)
def mix(a,b,p):return np.asarray(a,dtype=float)*(1-p)+np.asarray(b,dtype=float)*p
def alpha(a,boxes):
    g=a.max(2).astype(float);mask=np.zeros(g.shape,bool)
    for x1,y1,x2,y2 in boxes:mask[y1:y2,x1:x2]=True
    matte=np.where(mask & (g>16),np.clip((g-8)*255/247,0,255),0).astype('uint8')
    return Image.fromarray(np.dstack([np.full((*g.shape,3),255,dtype='uint8'),matte]),'RGBA')
def trace(layer):
    z=np.asarray(layer.getchannel('A'))>128
    loops=contourpy.contour_generator(z=z.astype(float),name='serial').lines(.5)
    paths=[]
    for loop in loops:
        if len(loop)<4:continue
        paths.append('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in loop)+' Z')
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><path fill="#fff" fill-rule="evenodd" d="'+' '.join(paths)+'"/></svg>\n'

def flight_path():
    points=[];derivatives=[]
    for segment in CUBICS:
        a,b,c,d=np.array(segment,float)
        for t in np.linspace(0,1,401,endpoint=False):
            points.append((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d)
            derivatives.append(3*(1-t)**2*(b-a)+6*(1-t)*t*(c-b)+3*t*t*(d-c))
    points.append(np.array(CUBICS[-1][-1],float));derivatives.append(np.array(CUBICS[-1][-1],float)-CUBICS[-1][-2])
    xy=np.asarray(points);d=np.asarray(derivatives)
    lengths=np.r_[0,np.cumsum(np.linalg.norm(np.diff(xy,axis=0),axis=1))]
    angle=np.unwrap(np.arctan2(d[:,1],d[:,0]))
    return xy,lengths,angle
PATH,ARC,ANGLES=flight_path()
def at_distance(distance):
    s=max(0,min(ARC[-1],distance))
    return np.array([np.interp(s,ARC,PATH[:,i]) for i in range(2)]),float(np.interp(s,ARC,ANGLES))
RADII=CubicSpline(np.arange(12),[p[2] for p in DOTS]+[DOTS[0][2]],bc_type='periodic')

def prepare():
    for n,(slug,index,poster) in SPECS.items():
        original=Image.open(ROOT/f'reference-{index}.png').convert('RGB');a=np.array(original)
        original.save(ROOT/f'{stem(n)}-reference.webp',lossless=True)
        label_layer=alpha(a,[LABEL_BOX[n]])
        label_layer.save(ROOT/f'{stem(n)}-word.webp',lossless=True)
        (ROOT/f'{stem(n)}-word.svg').write_text(trace(label_layer))
        params={'nativeStage':[1254,1254],'preview':{'width':900,'height':900,'fps':30,'frames':240,'durationSeconds':8,'audio':False,'faststart':True,'closedSampling':'t=8*frameIndex/239; app uses elapsed seconds'},'labelBounds':LABEL_BOX[n],'stationaryLabel':True,'motionAuthorship':'authored from a supplied still'}
        if n==167:
            params.update({'centersAndReferenceRadii':DOTS,'radiusWave':{'periodSeconds':2,'coordinate':'(i-11*t/2) modulo 11','interpolation':'periodic cubic spline through native radius table; clamp to [6.7,20.65]','color':'#ffffff','centerMovement':False}})
        if n==168:
            layer=alpha(a,[PLANE_BOX]);layer.save(ROOT/f'{stem(n)}-plane.webp',lossless=True)
            (ROOT/f'{stem(n)}-plane.svg').write_text(trace(layer))
            params.update({'planeBounds':PLANE_BOX,'planePivot':[906,493],'sourceForwardAngleDegrees':math.degrees(math.atan2(431-493,987-906)),'cubicBezierSegments':CUBICS,'pathLength':float(ARC[-1]),'flight':{'startSeconds':.30,'travelSeconds':5.4,'arcLengthFraction':'smoothstep((t-.30)/5.4)','scale':'0.65+0.35*smoothstep((arcFraction-.45)/.45)','orientation':'continuous atan2(path tangent); do not independently spin','outlineFadeInSeconds':[.10,.40],'endHoldSeconds':[5.70,6.60],'fadeOutSeconds':[6.60,7.40],'hiddenResetSeconds':[7.40,8]},'trail':{'dash':17,'gap':27,'stroke':5.2,'linecap':'round','revealUpTo':'max(0,headArcLength-80)','stationaryOrigin':[305,744.5,20.5]},'velocityLines':{'distanceBehind':94,'length':22,'separation':13,'opacityEnvelope':'sin(pi*arcFraction)'}})
        if n==169:
            layer=alpha(a,STEP_BOXES);layer.save(ROOT/f'{stem(n)}-steps.webp',lossless=True)
            (ROOT/f'{stem(n)}-steps.svg').write_text(trace(layer))
            params.update({'stepContacts':STEPS,'stepArtworkBoxes':STEP_BOXES,'cycle':{'settleSeconds':[0,.30],'climbSeconds':[.30,5.70],'hopCount':5,'hopSeconds':1.08,'lastTreadHoldSeconds':[5.70,6.60],'fadeOutSeconds':[6.60,7.40],'hiddenResetSeconds':[7.40,8],'fadeInSeconds':[.05,.25]},'pose':{'hipHeightAboveSupport':53,'flightHipLift':26,'upperLeg':40,'lowerLeg':39,'upperArm':25,'lowerArm':24,'headRadius':18,'legStroke':7.5,'torsoStroke':10,'armStroke':6.5,'hipPosition':'mix(previousContact,nextContact,smoothstep(u))+(0,-53-26*sin(pi*smoothstep((u-.16)/.69))+7*exp(-((u-.86)/.075)^2))','leadFoot':'plant through u=.10; move with smoothstep((u-.10)/.72), add y=-24*sin(pi*q); plant at target from u=.82','rearFoot':'plant through u=.20; move with smoothstep((u-.20)/.80), add y=-32*sin(pi*q); reach target at u=1','leadLeg':'alternate each hop','joints':'two-bone inverse kinematics; knees bend forward; preserve limb lengths','arms':'opposite leading leg, shoulder follows torso; hands use same two-bone IK','shoulderOffset':'(12+6*sin(pi*u),-41)','headOffsetFromShoulder':[4,-28]},'contactRule':'feet hit measured tread coordinates, never float, slide or penetrate bars; reset only while invisible'})
        (ROOT/f'{stem(n)}-parameters.json').write_text(json.dumps(params,indent=2)+'\n')
    print('Prepared exact stills, alpha art, traced contours and motion parameters',flush=True)

def base_layers(n):
    label=Image.open(ROOT/f'{stem(n)}-word.webp').convert('RGBA').resize((OUT*AA,OUT*AA),Image.Resampling.LANCZOS)
    if n==169:
        art=Image.open(ROOT/f'{stem(n)}-steps.webp').convert('RGBA').resize((OUT*AA,OUT*AA),Image.Resampling.LANCZOS)
    else:art=None
    if n==168:
        source=Image.open(ROOT/f'{stem(n)}-plane.webp').convert('RGBA')
        plane=Image.new('RGBA',(360,360));plane.alpha_composite(source.crop((726,313,1086,673)))
    else:plane=None
    return label,art,plane
def line(draw,points,width,color=(255,255,255)):
    xy=[tuple((np.asarray(p)*K).tolist()) for p in points];w=max(1,round(width*K))
    draw.line(xy,fill=color,width=w,joint='curve');r=width*K/2
    for x,y in xy:draw.ellipse((x-r,y-r,x+r,y+r),fill=color)
def circle(draw,p,r,color=(255,255,255)):
    x,y=np.asarray(p)*K;r*=K;draw.ellipse((x-r,y-r,x+r,y+r),fill=color)
def ik(a,b,l1,l2,bend=-1):
    a=np.asarray(a);b=np.asarray(b);v=b-a;dist=float(np.linalg.norm(v));d=min(l1+l2-.02,max(abs(l1-l2)+.02,dist));direction=v/max(dist,.001)
    along=(l1*l1-l2*l2+d*d)/(2*d);height=math.sqrt(max(0,l1*l1-along*along));normal=np.array([-direction[1],direction[0]])
    return a+direction*along+bend*normal*height,dist
def opacity_cycle(t,start):
    return smooth((t-start[0])/(start[1]-start[0]))*(1-smooth((t-6.6)/.8))

def runner_pose(t):
    if t<.30:hop,u=0,0.
    elif t>=5.70:hop,u=4,1.
    else:hop=int((t-.30)/1.08);u=((t-.30)/1.08)%1
    p=smooth(u);a=np.array(STEPS[hop]);b=np.array(STEPS[hop+1]);hip=mix(a,b,p)
    lift=26*math.sin(math.pi*smooth((u-.16)/.69));compression=7*math.exp(-((u-.86)/.075)**2)
    hip+=np.array([0,-53-lift+compression])
    front_q=smooth((u-.10)/.72);rear_q=smooth((u-.20)/.80)
    lead=mix(a+[-8,0],b+[8,0],front_q)+[0,-24*math.sin(math.pi*front_q)]
    rear=mix(a+[8,0],b+[-8,0],rear_q)+[0,-32*math.sin(math.pi*rear_q)]
    feet=[lead,rear] if hop%2==0 else [rear,lead]
    shoulder=hip+[12+6*math.sin(math.pi*u),-41]
    head=shoulder+[4,-28]
    swing=(1 if hop%2==0 else -1)*math.cos(math.pi*u)
    hands=[shoulder+[25+15*swing,22-9*swing],shoulder+[-21-11*swing,25+9*swing]]
    knees=[ik(hip,foot,40,39)[0] for foot in feet]
    elbows=[ik(shoulder,hand,25,24,-1 if j==0 else 1)[0] for j,hand in enumerate(hands)]
    return {'hop':hop,'u':u,'hip':hip,'shoulder':shoulder,'head':head,'feet':feet,'knees':knees,'hands':hands,'elbows':elbows,'maxLegReach':max(np.linalg.norm(foot-hip) for foot in feet)}

def frame(n,t,layers):
    label,art,plane=layers
    im=Image.new('RGBA',(OUT*AA,OUT*AA),'black');draw=ImageDraw.Draw(im)
    diagnostics={}
    if n==167:
        for i,(x,y,r0) in enumerate(DOTS):
            r=float(np.clip(RADII((i-11*t/2)%11),6.7,20.65));circle(draw,(x,y),r)
    elif n==168:
        p=smooth((t-.3)/5.4);s=p*ARC[-1];q,angle=at_distance(s)
        op=opacity_cycle(t,(.1,.4));color=(255,255,255,round(255*op))
        circle(draw,(305,744.5),20.5)
        moving=Image.new('RGBA',im.size);draw=ImageDraw.Draw(moving)
        reveal=max(0,s-80)
        for start in np.arange(0,reveal,44):
            end=min(start+17,reveal)
            pts=[at_distance(d)[0] for d in np.linspace(start,end,max(3,int((end-start)/2)))];line(draw,pts,5.2,color)
        if op>0:
            scale=.65+.35*smooth((p-.45)/.45)
            size=round(360*K*scale)
            icon=plane.resize((size,size),Image.Resampling.LANCZOS)
            source_angle=math.atan2(431-493,987-906)
            icon=icon.rotate(-math.degrees(angle-source_angle),resample=Image.Resampling.BICUBIC,expand=False)
            icon.putalpha(icon.getchannel('A').point(lambda a:round(a*op)))
            moving.alpha_composite(icon,(round(q[0]*K-size/2),round(q[1]*K-size/2)))
            draw=ImageDraw.Draw(moving)
            tangent=np.array([math.cos(angle),math.sin(angle)]);normal=np.array([-tangent[1],tangent[0]])
            velo=math.sin(math.pi*p)*op
            for side in [-6.5,6.5]:
                front=q-tangent*94+normal*side;line(draw,[front-tangent*22,front],4.6,(255,255,255,round(255*velo)))
        im.alpha_composite(moving)
        diagnostics={'pathFraction':p,'noseAngle':math.degrees(angle),'scale':.65+.35*smooth((p-.45)/.45)}
    else:
        im.alpha_composite(art);moving=Image.new('RGBA',im.size);draw=ImageDraw.Draw(moving)
        pose=runner_pose(t);op=opacity_cycle(t,(.05,.25));color=(255,255,255,round(255*op))
        for j in [1,0]:
            line(draw,[pose['hip'],pose['knees'][j],pose['feet'][j]],7.5,color)
            foot=pose['feet'][j];line(draw,[foot+[-2,0],foot+[6,0]],6.8,color)
        for j in [1,0]:line(draw,[pose['shoulder'],pose['elbows'][j],pose['hands'][j]],6.5,color)
        line(draw,[pose['hip'],pose['shoulder']],10,color)
        line(draw,[pose['shoulder'],pose['head']],5.5,color);circle(draw,pose['head'],18,color)
        speed=math.sin(math.pi*pose['u'])**2*op
        if speed>0:
            for dy in [9,23]:
                origin=pose['hip']+[-58,dy];line(draw,[origin+[-18,10],origin],4.5,(255,255,255,round(255*speed)))
        im.alpha_composite(moving)
        diagnostics={'hop':pose['hop'],'u':pose['u'],'hip':pose['hip'].tolist(),'feet':[p.tolist() for p in pose['feet']],'maxLegReach':float(pose['maxLegReach'])}
    im.alpha_composite(label)
    return im.convert('RGB').resize((OUT,OUT),Image.Resampling.LANCZOS),diagnostics

def render(n):
    layers=base_layers(n);path=ROOT/f'{stem(n)}.mp4'
    process=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','900x900','-r','30','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
    samples=ROOT/'samples';samples.mkdir(exist_ok=True);diagnostics=[];first=None;last=None;hashes=set()
    for i in range(FRAMES):
        t=SECONDS*i/(FRAMES-1)
        image,data=frame(n,t,layers);b=image.tobytes();hashes.add(hashlib.sha256(b).hexdigest())
        if i==0:first=b
        last=b;process.stdin.write(b)
        if i%30==0 or i==239:image.save(samples/f'{n}-frame-{i:03}.png')
        diagnostics.append({'frame':i,'time':t,**data})
        if i%60==0:print(f'{n}: {i}/240',flush=True)
    process.stdin.close();assert process.wait()==0
    assert first==last,'loop endpoints differ'
    poster,_=frame(n,SPECS[n][2],layers);poster.save(ROOT/f'{stem(n)}-poster.webp',quality=94,method=6)
    (ROOT/f'{stem(n)}-diagnostics.json').write_text(json.dumps(diagnostics,indent=2)+'\n')
    report={'number':n,'slug':SPECS[n][0],'video':info(path),'poster':info(ROOT/f'{stem(n)}-poster.webp'),'previewRender':{'width':900,'height':900,'fps':30,'frames':240,'durationSeconds':8,'audio':False,'faststart':True,'loopEndpointPixelsEqual':first==last,'uniqueSourceFrames':len(hashes)}}
    if n==169:
        report['maxLegReach']=max(p['maxLegReach'] for p in diagnostics);assert report['maxLegReach']<79.02
    (ROOT/f'{n}-render-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--prepare',action='store_true');parser.add_argument('--render',type=int);parser.add_argument('--sample',type=int)
    args=parser.parse_args()
    if args.prepare:prepare()
    if args.render:render(args.render)
    if args.sample:
        for t in [0,.3,.55,.9,1.1,1.5,2.3,3.15,4.3,5.7,6.1,7.2]:
            im,data=frame(args.sample,t,base_layers(args.sample));im.save(ROOT/f'test-{args.sample}-{t:.2f}.png')
        print('Samples ready')
