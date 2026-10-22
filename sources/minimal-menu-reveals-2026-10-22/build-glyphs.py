from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
import json

root=Path(__file__).resolve().parent
chars=sorted(set('HomeAboutWorksStudioContactThoughtful design for modern brandsmenucloseEN'))
atlas={}
for key,file in [('light','Manrope-350.woff'),('bold','Manrope-650.woff')]:
    font=TTFont(root/'fonts'/file);glyphs=font.getGlyphSet();cmap=font.getBestCmap()
    record={'units':font['head'].unitsPerEm,'weight':font['OS/2'].usWeightClass,'glyphs':{}}
    for ch in chars:
        name=cmap.get(ord(ch));assert name,(file,ch)
        pen=DecomposingRecordingPen(glyphs);glyphs[name].draw(pen)
        svg=SVGPathPen(glyphs);pen.replay(svg)
        record['glyphs'][ch]={'advance':font['hmtx'].metrics[name][0],'d':svg.getCommands()}
    atlas[key]=record
(root/'glyphs.json').write_text(json.dumps(atlas,separators=(',',':'))+'\n')
print('Created exact glyph outlines for both frozen Manrope weights.')
