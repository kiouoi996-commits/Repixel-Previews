import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

root = Path(__file__).parent
atlas = {}
for key, filename, weight in [('sans', 'Inter.woff', 400), ('medium', 'Inter.woff', 600), ('serif', 'InstrumentSerif.woff', None)]:
    font = TTFont(root / 'assets' / filename)
    if weight and 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': weight})
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    out = {}
    for char in ''.join(chr(n) for n in range(32, 127)) + '®—–→↗·°':
        name = cmap.get(ord(char))
        if not name:
            continue
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        out[char] = {'d': pen.getCommands(), 'advance': font['hmtx'][name][0]}
    atlas[key] = {'units': font['head'].unitsPerEm, 'glyphs': out}
(root / 'glyphs.json').write_text(json.dumps(atlas, separators=(',', ':')))
print('Exact font outlines:', (root / 'glyphs.json').stat().st_size)
