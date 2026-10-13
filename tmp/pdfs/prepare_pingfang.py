import sys
from pathlib import Path
sys.path.insert(0,'/Users/zhangxinyi/.cache/uv/archive-v0/O7NnmNWQn1Th89innkAR8')
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
src='/System/Library/AssetsV2/com_apple_MobileAsset_Font8/86ba2c91f017a3749571a82f2c6d890ac7ffb2fb.asset/AssetData/PingFang.ttc'
chars=Path('tmp/pdfs/build_resume.py').read_text()+''.join(chr(i) for i in range(32,127))
for idx,weight in [(3,'Regular'),(11,'Semibold')]:
 f=TTFont(src,fontNumber=idx)
 options=Options(); options.name_IDs=['*']; options.name_legacy=True; options.name_languages=['*']
 subset=Subsetter(options=options); subset.populate(text=chars); subset.subset(f)
 gs=f.getGlyphSet(); glyphs={}
 for name in f.getGlyphOrder():
  pen=TTGlyphPen(gs); convert=Cu2QuPen(pen,1.0,reverse_direction=True)
  gs[name].draw(convert); glyphs[name]=pen.glyph()
 del f['CFF ']
 f.sfntVersion='\x00\x01\x00\x00'
 fb=FontBuilder(font=f,isTTF=True); fb.isTTF=True; fb.setupGlyf(glyphs); fb.setupMaxp()
 f['post'].formatType=3.0
 output=Path('tmp/pdfs')/f'PingFangSC-{weight}-Resume.ttf'
 f.save(output)
 print(output)
