from pathlib import Path
from functools import lru_cache
import hashlib, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'assets'
OUT = ROOT / 'output'
ASSETS.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True)
W = H = 1080
S = 1.5
PW, PH = 440, 680
ASSET_COMMIT = '82a4e30dc9e4b0d73a5e7a73e8dc4ac779725550'
PHOTO_BASE = f'https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/{ASSET_COMMIT}/images/editorial/photos/sedona-perspective-carousel-2026-10-08/'
FONT_URL = 'https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d4256c6ca9d175defe67e3c4965a2d1bfa0f1114/fonts/app-assets/pulse-go-next-place-2026-09-30/Inter-Latin.woff'
PHOTO_RECORDS = [
    ('adobe-courtyard', 222730, '51a83d33046bbd96ceaa1d879462223d3591362415045a4499f703533986c7bf'),
    ('sunset-viewpoint', 182082, 'db0dd7c2178778f09af58a6e04e5fbcad1720cd01a9a0da5c376c46692052ddd'),
    ('canyon-creek', 238976, '9138c1199228e32f00602c24483f8dd01c66c695838154c9abce33ddb051b720'),
]

def bootstrap():
    from urllib.request import urlopen
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
    for name, length, digest in PHOTO_RECORDS:
        path = ASSETS / (name + '.webp')
        if not path.exists():path.write_bytes(urlopen(PHOTO_BASE + path.name).read())
        data = path.read_bytes()
        assert len(data) == length and hashlib.sha256(data).hexdigest() == digest
    path = ASSETS / 'Inter-Latin.woff'
    if not path.exists():path.write_bytes(urlopen(FONT_URL).read())
    assert hashlib.sha256(path.read_bytes()).hexdigest() == '4554a7b83628b1e6629b0726dad143539b117033cd0c059abef351051da499b8'
    if not (ASSETS / 'Inter-500.ttf').exists():
        font = TTFont(path)
        if 'fvar' in font:font = instantiateVariableFont(font, {'wght': 500}, inplace=False)
        font.flavor = None
        font.save(ASSETS / 'Inter-500.ttf')

bootstrap()

@lru_cache(maxsize=None)
def font(size):return ImageFont.truetype(str(ASSETS / 'Inter-500.ttf'), round(size * S))

def ease(t):
    if t <= 0:return 0.
    if t >= 1:return 1.
    lo, hi = 0., 1.
    for _ in range(18):
        u = (lo + hi) / 2
        x = 3 * (1-u)**2 * u * .22 + 3 * (1-u) * u*u * .36 + u**3
        if x < t:lo = u
        else:hi = u
    return 1 - (1 - (lo + hi)/2)**3

POSES = {
    -2: (-135, 456, 210, 382, .12, .025, 0., 0.),
    -1: (204, 456, 219, 392, .10, .020, 1., 0.),
     0: (574, 461, 444, 686, .052, 0., 1., 1.),
     1: (893, 616, 196, 382, -.05, .085, 1., 0.),
     2: (1190, 616, 190, 375, -.07, .10, 0., 0.),
}

def pose(slot):return POSES[max(-2, min(2, slot))]

def quad(values):
    cx, cy, width, height, shear, depth, opacity, active = values
    xl, xr = cx-width/2, cx+width/2
    yl, yr = cy-shear*width/2, cy+shear*width/2
    hl, hr = height/2*(1-depth), height/2*(1+depth)
    return [(xl, yl-hl), (xr, yr-hr), (xr, yr+hr), (xl, yl+hl)]

def warp_panel(source, corners):
    corners = np.asarray(corners) * S
    left, top = np.floor(corners.min(axis=0)).astype(int)-1
    right, bottom = np.ceil(corners.max(axis=0)).astype(int)+1
    dst = corners - [left, top]
    src = [(0,0),(source.width,0),(source.width,source.height),(0,source.height)]
    matrix, values = [], []
    for (x,y),(u,v) in zip(dst,src):
        matrix.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]])
        values.extend([u,v])
    coefficients = np.linalg.solve(np.asarray(matrix), np.asarray(values))
    result = source.transform((int(right-left),int(bottom-top)), Image.Transform.PERSPECTIVE, coefficients, Image.Resampling.BICUBIC)
    return result, (int(left),int(top))

PHOTO_LAYERS = []
for name,_,_ in PHOTO_RECORDS:
    photo = ImageOps.fit(Image.open(ASSETS/(name+'.webp')).convert('RGB'), (round(PW*S),round(PH*S)), method=Image.Resampling.LANCZOS, centering=(.5,.5)).convert('RGBA')
    mask = Image.new('L',photo.size)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,photo.width-1,photo.height-1),radius=24*S,fill=255)
    photo.putalpha(mask)
    PHOTO_LAYERS.append(photo)
BADGE = Image.new('RGBA',PHOTO_LAYERS[0].size)
draw = ImageDraw.Draw(BADGE)
draw.rounded_rectangle((28*S,24*S,204*S,74*S),radius=25*S,fill='#FF703F')
draw.text((116*S,49*S),'Sedona, AZ',font=font(26),fill='white',anchor='mm')

def background():
    yy,xx = np.mgrid[0:round(H*S),0:round(W*S)]
    radial = np.clip(((xx/(W*S)-.50)**2+(yy/(H*S)-.46)**2)/.5,0,1)
    gray = np.asarray(245+8*radial,dtype=np.uint8)
    image = Image.fromarray(np.repeat(gray[:,:,None],3,axis=2),'RGB').convert('RGBA')
    for corners in [[(165,226),(326,183),(380,776),(188,740)],[(728,370),(877,322),(924,768),(799,812)]]:
        glass = Image.new('RGBA',(round(180*S),round(560*S)))
        ImageDraw.Draw(glass).rounded_rectangle((0,0,glass.width-1,glass.height-1),radius=38*S,fill=(255,255,255,150),outline=(255,255,255,200),width=round(S))
        layer,xy=warp_panel(glass,corners)
        shadow=Image.new('RGBA',layer.size,(26,35,50,0));shadow.putalpha(layer.getchannel('A').point(lambda p:round(p*.08)))
        padded=Image.new('RGBA',(layer.width+round(160*S),layer.height+round(160*S)))
        padded.alpha_composite(shadow,(round(80*S),round(80*S)))
        image.alpha_composite(padded.filter(ImageFilter.GaussianBlur(36*S)),(xy[0]-round(80*S),xy[1]-round(65*S)))
        image.alpha_composite(layer,xy)
    return image

BACKGROUND = background()

def phase(t):
    for index,start,end in [(1,.7,1.4),(2,2.3,3.0),(0,3.9,4.6)]:
        if start <= t < end:return index,ease((t-start)/.7)
    return (1,0.) if t<.7 or t>=4.6 else ((2,0.) if t<2.3 else (0,0.))

def frame(t):
    index,p=phase(t)
    image=BACKGROUND.copy()
    panels=[]
    for slot in range(-2,3):
        a,b=pose(slot),pose(slot-1)
        values=tuple(x+(y-x)*p for x,y in zip(a,b))
        if values[6]<.001:continue
        panels.append((values[2]*values[3],(index+slot)%3,values))
    for _,photo_index,values in sorted(panels,key=lambda item:item[0]):
        source=PHOTO_LAYERS[photo_index].copy()
        active=values[7]
        if active>.001:
            badge=BADGE.copy();badge.putalpha(badge.getchannel('A').point(lambda x:round(x*active)))
            source.alpha_composite(badge)
        layer,xy=warp_panel(source,quad(values))
        if values[6]<.999:layer.putalpha(layer.getchannel('A').point(lambda x:round(x*values[6])))
        pad=round(80*S)
        shadow=Image.new('RGBA',(layer.width+2*pad,layer.height+2*pad),(0,0,0,0))
        alpha=layer.getchannel('A').point(lambda x:round(x*(.10+.065*active)))
        ink=Image.new('RGBA',layer.size,(28,31,39,0));ink.putalpha(alpha)
        shadow.alpha_composite(ink,(pad,pad))
        image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur((18+10*active)*S)),(xy[0]-pad,xy[1]-pad+round((12+10*active)*S)))
        image.alpha_composite(layer,xy)
    weights=[(1-p if k==index else 0)+(p if k==(index+1)%3 else 0) for k in range(3)]
    widths=[16+22*a for a in weights]
    draw=ImageDraw.Draw(image)
    for center,width,weight in zip([478,535,592],widths,weights):
        x=center-width/2
        color=tuple(round(a+(b-a)*weight) for a,b in zip((201,200,249),(85,71,255)))
        draw.rounded_rectangle((x*S,950*S,(x+width)*S,966*S),radius=8*S,fill=color)
    return image.convert('RGB').resize((W,H),Image.Resampling.LANCZOS)

def render():
    stem='175-sedona-perspective-carousel-2026-10-08-a1'
    path=OUT/(stem+'.mp4')
    process=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1080','-r','30','-i','-','-an','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
    first=last=None;unique=set()
    for i in range(180):
        picture=frame(i/30);raw=picture.tobytes();unique.add(hashlib.sha256(raw).digest())
        if i==0:
            first=raw;picture.save(OUT/(stem+'.webp'),'WEBP',quality=93,method=6)
        if i==179:last=raw
        if i in [0,24,35,55,75,95,125,145,179]:picture.save(OUT/f'frame-{i}.png')
        process.stdin.write(raw)
    process.stdin.close()
    assert process.wait()==0
    assert first==last
    result={'width':W,'height':H,'fps':30,'frames':180,'durationSeconds':6,'audio':False,'faststart':True,'loopEndpointPixelsEqual':True,'uniqueSourceFrames':len(unique),'transitionMs':700,'easing':[.22,1,.36,1],'featuredSequence':['sunset-viewpoint','canyon-creek','adobe-courtyard','sunset-viewpoint']}
    for key,file in [('video',path),('poster',OUT/(stem+'.webp'))]:
        data=file.read_bytes();result[key]={'path':file.name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
    (OUT/'metadata.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result),flush=True)

if __name__=='__main__':render()
