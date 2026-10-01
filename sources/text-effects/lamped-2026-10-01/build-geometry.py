"""Freeze source typography and shape the three selected headings into real glyph paths.

Usage: PYTHONPATH=<uharfbuzz-install> python build-geometry.py <upstream-font-dir> <archive> <extracted-source-dir>
Python dependencies: fonttools, uharfbuzz. The effect renderer itself needs no fonts.
"""
import hashlib
import json
import math
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools import subset
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
UPSTREAM, ARCHIVE, SOURCE = map(Path, sys.argv[1:4])
FONTS = ROOT / 'fonts/text-effects/lamped-2026-10-01'
VECTORS = ROOT / 'images/text-effects/lamped-2026-10-01'
FONTS.mkdir(parents=True, exist_ok=True)
VECTORS.mkdir(parents=True, exist_ok=True)

def fingerprint(path):
    data = path.read_bytes()
    return {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

fonts = {}
for name, pattern, axes in [
    ('Manrope-650', 'manrope-Manrope[[]wght].ttf', {'wght': 650}),
    ('Manrope-350', 'manrope-Manrope[[]wght].ttf', {'wght': 350}),
    ('CormorantGaramond-400', 'cormorantgaramond-CormorantGaramond[[]wght].ttf', {'wght': 400}),
    ('CormorantGaramond-Italic-400', 'cormorantgaramond-CormorantGaramond-Italic[[]wght].ttf', {'wght': 400}),
    ('BodoniModa-400-opsz96', 'bodonimoda-BodoniModa[[]opsz,wght].ttf', {'wght': 400, 'opsz': 96}),
]:
    original = next(UPSTREAM.glob(pattern))
    font = instantiateVariableFont(TTFont(original), axes, inplace=False)
    opts = subset.Options()
    opts.name_IDs = ['*']
    opts.name_languages = ['*']
    sub = subset.Subsetter(options=opts)
    sub.populate(unicodes=list(range(32, 256)))
    sub.subset(font)
    target = FONTS / (name + '.woff')
    font.flavor = 'woff'
    font.save(target)
    font.flavor = None
    import io
    buffer = io.BytesIO()
    font.save(buffer)
    fonts[name] = (font, buffer.getvalue())

for family in ('manrope', 'cormorantgaramond', 'bodonimoda'):
    (FONTS / (family + '-OFL.txt')).write_bytes((UPSTREAM / (family + '-OFL.txt')).read_bytes())

def shape(text, font_name, size, tracking, baseline, *, left=None, center=540, gold_from=None):
    font, raw = fonts[font_name]
    units = font['head'].unitsPerEm
    scale = size / units
    face = hb.Face(raw)
    hfont = hb.Font(face)
    hfont.scale = (units, units)
    hb.ot_font_set_funcs(hfont)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hfont, buf, {'kern': True, 'liga': False, 'clig': False})
    positions = buf.glyph_positions
    width = sum(p.x_advance for p in positions) * scale + tracking * (len(positions) - 1)
    x = left if left is not None else center - width / 2
    glyph_set = font.getGlyphSet()
    order = font.getGlyphOrder()
    pen_x = 0
    glyphs = []
    for info, pos in zip(buf.glyph_infos, positions):
        name = order[info.codepoint]
        origin_x = x + pen_x + pos.x_offset * scale
        origin_y = baseline - pos.y_offset * scale
        transform = (scale, 0, 0, -scale, origin_x, origin_y)
        pen = SVGPathPen(glyph_set, ntos=lambda n: str(round(n, 5)))
        glyph_set[name].draw(TransformPen(pen, transform))
        bounds = BoundsPen(glyph_set)
        glyph_set[name].draw(TransformPen(bounds, transform))
        if bounds.bounds:
            glyphs.append({
                'char': text[info.cluster], 'cluster': info.cluster, 'glyph': name,
                'originX': round(origin_x, 5), 'baseline': baseline,
                'bounds': [round(v, 5) for v in bounds.bounds], 'd': pen.getCommands(),
                'fill': '#DCB440' if gold_from is not None and info.cluster >= gold_from else '#F4F2F1',
            })
        pen_x += pos.x_advance * scale + tracking
    return {
        'text': text, 'font': font_name, 'fontSize': size, 'tracking': tracking,
        'baseline': baseline, 'originX': round(x, 5), 'advanceWidth': round(width, 5),
        'glyphs': glyphs,
    }

compositions = {
    'lighting': {'label': 'Lighting Up / Creative Minds', 'lines': [
        shape('Lighting Up', 'Manrope-650', 100, -4.5, 289, left=180, gold_from=9),
        shape('Creative Minds', 'Manrope-650', 100, -4.5, 388, left=180, gold_from=0),
    ]},
    'space': {'label': 'SPACE / OF QUALITY / INTERIOR', 'lines': [
        shape('SPACE', 'CormorantGaramond-400', 84, -2.94, 238),
        shape('OF QUALITY', 'CormorantGaramond-Italic-400', 84, -2.94, 309.4),
        shape('INTERIOR', 'CormorantGaramond-400', 120, -4.2, 411.4),
    ]},
    'inside': {'label': 'THE / INSIDE / LOOK®', 'lines': [
        shape('THE', 'Manrope-350', 98, -3.92, 254),
        shape('INSIDE', 'BodoniModa-400-opsz96', 98, -4.41, 336.32),
        shape('LOOK', 'Manrope-350', 106, -5.3, 425.36),
    ]},
}

look = compositions['inside']['lines'][2]
registered = shape('®', 'Manrope-350', 24.38, 0, 367.36, left=look['originX'] + look['advanceWidth'] + 4.24)
registered['glyphs'][0]['attachedToPreviousGlyph'] = True
look['glyphs'].extend(registered['glyphs'])
look['trademark'] = {k: v for k, v in registered.items() if k != 'glyphs'}
for key, composition in compositions.items():
    index = 0
    for line_index, line in enumerate(composition['lines']):
        if key == 'space':
            for g in line['glyphs']:
                g['fill'] = '#F5F4F1'
        bounds = [g['bounds'] for g in line['glyphs']]
        line['bounds'] = [min(b[0] for b in bounds), min(b[1] for b in bounds), max(b[2] for b in bounds), max(b[3] for b in bounds)]
        for glyph_index, g in enumerate(line['glyphs']):
            g['index'] = index
            g['lineIndex'] = line_index
            g['indexInLine'] = glyph_index
            index += 1
    composition['glyphCount'] = index
    paths = ''.join(f'<path d="{g["d"]}" fill="{g["fill"]}"/>' for l in composition['lines'] for g in l['glyphs'])
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 608" role="img" aria-label="{composition["label"]}">{paths}</svg>\n'
    (VECTORS / (key + '-heading.svg')).write_text(svg)
    print(key, [(l['text'], l['advanceWidth'], l['originX'], l['baseline']) for l in composition['lines']])

geometry = {'width': 1080, 'height': 608, 'background': '#121018', 'compositions': compositions}
(HERE / 'geometry.json').write_text(json.dumps(geometry, ensure_ascii=False, indent=2) + '\n')
archive_bytes = ARCHIVE.read_bytes()
provenance = {
    'driveFolder': {'id': '1VZzbK7d3YdpSUJz1_ZJTQsXE6oMJUJm9', 'name': 'Коды моих сайтов'},
    'archive': {'id': '1L5VSeNOCi0zDKqx5nZA90RgpV6z6bdTO', 'name': 'шрифты-анимации.zip',
                **fingerprint(ARCHIVE), 'md5': hashlib.md5(archive_bytes).hexdigest(),
                'url': 'https://drive.google.com/file/d/1L5VSeNOCi0zDKqx5nZA90RgpV6z6bdTO/view'},
    'sourceFiles': [{'path': str(p), **fingerprint(SOURCE / p)} for p in (Path('src/App.tsx'), Path('src/index.css'), Path('index.html'))],
    'selectedHeadings': [['Lighting Up', 'Creative Minds'], ['SPACE', 'OF QUALITY', 'INTERIOR'], ['THE', 'INSIDE', 'LOOK®']],
    'sourceTypography': {'lighting': {'family': 'Manrope', 'weight': 650, 'trackingEm': -.045, 'lineHeight': .99},
                         'space': {'family': 'Cormorant Garamond', 'weight': 400, 'italicLine': 'OF QUALITY', 'trackingEm': -.035, 'lineHeight': .85},
                         'inside': {'families': ['Manrope', 'Bodoni Moda', 'Manrope'], 'weights': [350, 400, 350], 'trackingEm': [-.04, -.045, -.05]}},
    'previewChoices': 'Isolated 1080×608 composition; fonts frozen at exact weights, Bodoni optical size 96; trademark is raised by 58px in the new preview.',
    'motion': 'Six new authored effects. The archive supplies text, fonts and palette; these motions are not claimed to be original archive behavior.',
    'fontUpstream': json.loads((UPSTREAM / 'manifest.json').read_text()),
}
(HERE / 'source-provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')
