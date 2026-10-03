"""Deterministic authored motion from three supplied stills; never original UI code.

Python 3.11+, Pillow 12.3.0, numpy 2.3.5, ffmpeg/libx264 and ffprobe.
Download the pinned reference WebPs beside this file; run python3 this_file.py.
The crops retain source pixels, including baked reference copy. Production
implementations must use separate live text/actions and clean client imagery.
"""
from pathlib import Path
import hashlib
import json
import math
import subprocess

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
FPS, FRAMES = 30, 180
ATTACHMENTS = json.loads((ROOT / 'attachments.json').read_text())
STUDIES = {
    155: {'slug': '155-curated-product-rail-slide', 'category': 'hero-sections', 'frame': (1080, 608)},
    156: {'slug': '156-spaces-diagonal-project-reveal', 'category': 'editorial', 'frame': (1080, 608)},
    157: {'slug': '157-iconic-product-depth-tilt', 'category': 'editorial', 'frame': (1080, 810)},
}


def ease(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


def excursion(t):
    if t <= .8:
        return 0.0
    if t < 1.7:
        return ease((t - .8) / .9)
    if t <= 3.3:
        return 1.0
    if t < 4.2:
        return 1 - ease((t - 3.3) / .9)
    return 0.0


def source(number):
    rec = next(r for r in ATTACHMENTS if r['number'] == number)
    stem = STUDIES[number]['slug'] + '-2026-10-03-a1'
    ref = ROOT / (stem + '-reference.webp')
    if ref.exists():
        return Image.open(ref).convert('RGB')
    im = Image.open(ROOT / rec['filename']).convert('RGB')
    im.save(ref, 'WEBP', lossless=True, method=6, exact=True)
    assert Image.open(ref).convert('RGB').tobytes() == im.tobytes()
    return im


def rail_frames(im):
    # Four real records plus one inert visual clone, not a fifth product.
    bounds = (361, 177, 1605, 834)
    rail = im.crop(bounds)
    panorama = Image.new('RGB', (rail.width + 316, rail.height))
    panorama.paste(rail, (0, 0))
    panorama.paste(rail.crop((0, 0, 316, rail.height)), (rail.width, 0))
    font = ImageFont.load_default(size=14)

    def render(t):
        p = excursion(t)
        if p == 0:
            return im.copy()
        result = im.copy()
        offset = round(316 * p)
        result.paste(panorama.crop((offset, 0, offset + rail.width, rail.height)), bounds[:2])
        # Commit the visible first-record counter only at the settled states.
        if 1.7 <= t < 4.2:
            draw = ImageDraw.Draw(result)
            draw.rectangle((190, 728, 252, 758), fill=im.getpixel((183, 742)))
            draw.text((198, 737), '02 / 04', font=font, fill=(166, 166, 163))
        return result
    return render


def diagonal_polygon(w, h, q):
    # Clip normalized u+v <= 2q against the unit rectangle.
    poly = [(0., 0.), (float(w), 0.), (float(w), float(h)), (0., float(h))]
    out = []
    bound = 2 * q
    for a, b in zip(poly, poly[1:] + poly[:1]):
        fa, fb = a[0] / w + a[1] / h - bound, b[0] / w + b[1] / h - bound
        ina, inb = fa <= 0, fb <= 0
        if ina:
            out.append(a)
        if ina != inb:
            lam = fa / (fa - fb)
            out.append((a[0] + lam * (b[0] - a[0]), a[1] + lam * (b[1] - a[1])))
    return out


def project_frames(im):
    boxes = [(514, 164, 855, 623), (882, 164, 1224, 623), (1249, 164, 1589, 623)]
    photos = [im.crop(box) for box in boxes]
    clean = im.copy()
    d = ImageDraw.Draw(clean)
    for box in boxes:
        d.rectangle((box[0], box[1], box[2] - 1, box[3] - 1), fill=(240, 239, 237))

    def render(t):
        if t <= .5 or t >= 2.6:
            return im.copy()
        result = clean.copy()
        for i, (box, photo) in enumerate(zip(boxes, photos)):
            if t < .8:
                mask = Image.new('L', photo.size, round(255 * (1 - ease((t - .5) / .3))))
            else:
                q = ease((t - 1.0 - .15 * i) / 1.3)
                mask = Image.new('L', photo.size, 0)
                if q >= 1:
                    mask.paste(255, (0, 0, photo.width, photo.height))
                elif q > 0:
                    ImageDraw.Draw(mask).polygon(diagonal_polygon(photo.width, photo.height, q), fill=255)
            result.paste(photo, box[:2], mask)
        return result
    return render


def inverse_perspective(src, dst):
    rows, values = [], []
    for (u, v), (x, y) in zip(src, dst):
        rows.extend([[x, y, 1, 0, 0, 0, -u*x, -u*y], [0, 0, 0, x, y, 1, -v*x, -v*y]])
        values.extend([u, v])
    return tuple(np.linalg.solve(np.array(rows), np.array(values)))


def product_frames(im):
    box = (504, 294, 948, 1023)
    tile = im.crop(box).convert('RGBA')
    shape = Image.new('L', tile.size)
    ImageDraw.Draw(shape).rounded_rectangle((0, 0, tile.width-1, tile.height-1), radius=14, fill=255)
    tile.putalpha(shape)
    clean = im.copy()
    # Reconstruct only the vacated card slot using the adjacent blank gutter.
    a = np.array(im)
    column = np.median(a[294:1023, 498:502, :], axis=1).astype(np.uint8)
    bg = np.repeat(column[:, None, :], box[2]-box[0], axis=1)
    clean.paste(Image.fromarray(bg), box[:2])
    envelope = Image.new('L', im.size)
    ImageDraw.Draw(envelope).rectangle((493, 266, 957, 1042), fill=255)
    src = [(0, 0), (tile.width, 0), (tile.width, tile.height), (0, tile.height)]

    def render(t):
        if t <= .8 or t >= 4.4:
            p = 0.0
        elif t < 2.0:
            p = ease((t - .8) / 1.2)
        elif t <= 3.2:
            p = 1.0
        else:
            p = 1 - ease((t - 3.2) / 1.2)
        if p == 0:
            return im.copy()
        theta, phi, distance = math.radians(-6*p), math.radians(2.5*p), 1600
        dst = []
        for u, v in src:
            x, y = u-tile.width/2, v-tile.height/2
            X = x * math.cos(theta)
            Y = y * math.cos(phi) + x * math.sin(theta) * math.sin(phi)
            Z = y * math.sin(phi) - x * math.sin(theta) * math.cos(phi)
            scale = distance/(distance-Z)
            dst.append((726 + X*scale, 658.5-12*p + Y*scale))
        warped = tile.transform(im.size, Image.Transform.PERSPECTIVE, inverse_perspective(src, dst), Image.Resampling.BICUBIC)
        alpha = warped.getchannel('A')
        shadow_alpha = ImageChops.offset(alpha.filter(ImageFilter.GaussianBlur(12*p)), 0, round(10*p))
        shadow_alpha = ImageChops.multiply(shadow_alpha, envelope).point(lambda v: round(v*.17*p))
        shadow = Image.new('RGBA', im.size, (0, 0, 0, 0)); shadow.putalpha(shadow_alpha)
        result = clean.convert('RGBA')
        result.alpha_composite(shadow)
        result.alpha_composite(warped)
        return result.convert('RGB')
    return render


def file_meta(path):
    b = path.read_bytes()
    return {'filename': path.name, 'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest()}


def export(number):
    study = STUDIES[number]
    im = source(number)
    renderer = {155: rail_frames, 156: project_frames, 157: product_frames}[number](im)
    stem = study['slug'] + '-2026-10-03-a1'
    movie = ROOT / (stem + '.mp4')
    poster = ROOT / (stem + '.webp')
    target = study['frame']
    cmd = ['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo',
           '-pixel_format', 'rgb24', '-video_size', f'{target[0]}x{target[1]}', '-framerate', str(FPS),
           '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-threads', '2', str(movie)]
    encoder = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    hashes, first, last = set(), None, None
    photo_boxes = [(514, 164, 855, 623), (882, 164, 1224, 623), (1249, 164, 1589, 623)]
    for n in range(FRAMES):
        native = renderer(n/FPS)
        if number == 156 and n in (36, 51, 63):
            outside = np.ones((im.height, im.width), dtype=bool)
            for x1, y1, x2, y2 in photo_boxes: outside[y1:y2, x1:x2] = False
            assert np.array_equal(np.array(native)[outside], np.array(im)[outside])
        frame = native.resize(target, Image.Resampling.LANCZOS)
        raw = frame.tobytes()
        hashes.add(hashlib.sha256(raw).hexdigest())
        if n == 0:
            first = raw
            frame.save(poster, 'WEBP', quality=95, method=6)
        if n == FRAMES-1: last = raw
        if n in (0, 36, 51, 66, 96, 126, 179): frame.save(ROOT/'samples'/f'{number}-{n:03}.png')
        encoder.stdin.write(raw)
    encoder.stdin.close()
    errors = encoder.stderr.read().decode()
    assert encoder.wait() == 0, errors
    assert first == last, 'Loop source frames differ'
    assert len(hashes) > 35, 'Insufficient visible motion'
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames',
       '-show_entries', 'stream=codec_name,pix_fmt,width,height,nb_read_frames:format=duration', '-of', 'json', str(movie)]))
    stream = probe['streams'][0]
    assert stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p'
    assert (stream['width'], stream['height']) == target and int(stream['nb_read_frames']) == FRAMES
    assert abs(float(probe['format']['duration'])-6) < .01
    b = movie.read_bytes(); assert b.index(b'moov') < b.index(b'mdat')
    result = {'number': number, 'category': study['category'], 'sourceAttachment': next(r for r in ATTACHMENTS if r['number'] == number),
      'video': file_meta(movie), 'poster': file_meta(poster), 'reference': file_meta(ROOT/(stem+'-reference.webp')),
      'previewRender': {'width': target[0], 'height': target[1], 'fps': FPS, 'frames': FRAMES, 'durationSeconds': 6,
                        'audio': False, 'faststart': True, 'loopEndpointPixelsEqual': True, 'uniqueSourceFrames': len(hashes)}}
    print(json.dumps(result), flush=True)
    return result


if __name__ == '__main__':
    results = []
    for number in STUDIES:
        print(f'Rendering section {number}', flush=True)
        results.append(export(number))
    (ROOT/'media-manifest.json').write_text(json.dumps(results, indent=2)+'\n')
