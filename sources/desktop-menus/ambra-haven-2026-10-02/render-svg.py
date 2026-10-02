"""Render frozen outline SVGs with the installed librsvg/Cairo; no browser/font lookup."""
import ctypes as C
import ctypes.util
import json
import sys
from pathlib import Path
rsvg=C.CDLL(ctypes.util.find_library('rsvg-2'));cairo=C.CDLL(ctypes.util.find_library('cairo'));gobject=C.CDLL(ctypes.util.find_library('gobject-2.0'))
def bind(lib,name,result,args):
 f=getattr(lib,name);f.restype=result;f.argtypes=args;return f
ptr=C.c_void_p;integer=C.c_int
new=bind(rsvg,'rsvg_handle_new_from_data',ptr,[C.c_void_p,C.c_size_t,C.POINTER(ptr)])
class Rect(C.Structure):_fields_=[('x',C.c_double),('y',C.c_double),('width',C.c_double),('height',C.c_double)]
render=bind(rsvg,'rsvg_handle_render_document',integer,[ptr,ptr,C.POINTER(Rect),C.POINTER(ptr)])
surface=bind(cairo,'cairo_image_surface_create',ptr,[integer,integer,integer]);context=bind(cairo,'cairo_create',ptr,[ptr]);png=bind(cairo,'cairo_surface_write_to_png',integer,[ptr,C.c_char_p]);destroy_context=bind(cairo,'cairo_destroy',None,[ptr]);destroy_surface=bind(cairo,'cairo_surface_destroy',None,[ptr]);unref=bind(gobject,'g_object_unref',None,[ptr])
jobs=json.load(sys.stdin)
for j in jobs:
 data=Path(j['svg']).read_bytes();error=ptr();handle=new(data,len(data),C.byref(error))
 if not handle:raise RuntimeError('Invalid SVG')
 s=surface(0,1080,608);c=context(s);rect=Rect(0,0,1080,608)
 if not render(handle,c,C.byref(rect),C.byref(error)):raise RuntimeError('SVG render failed')
 if png(s,str(j['png']).encode())!=0:raise RuntimeError('PNG write failed')
 destroy_context(c);destroy_surface(s);unref(handle)
