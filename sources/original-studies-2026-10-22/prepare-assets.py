"""Prepare exact existing resources for offline rendering, without resampling them."""
import base64, concurrent.futures, io, json, urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).parent
origins=json.loads((root/'asset-origins.json').read_text())
(root/'assets').mkdir(exist_ok=True)
def get(entry):
    name,url=entry
    target=root/'assets'/name
    if not target.exists():
        urllib.request.urlretrieve(url,target)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    list(pool.map(get,origins.items()))
photos={}; raster={}
for name in ['adobe-courtyard.webp','sunset-viewpoint.webp','canyon-creek.webp']:
    data=(root/'assets'/name).read_bytes()
    image=Image.open(io.BytesIO(data)); buffer=io.BytesIO();image.save(buffer,format='PNG')
    photos[name]='data:image/webp;base64,'+base64.b64encode(data).decode()
    raster[name]='data:image/png;base64,'+base64.b64encode(buffer.getvalue()).decode()
    photos[name+':dimensions']=raster[name+':dimensions']=list(image.size)
(root/'photos.json').write_text(json.dumps(photos,separators=(',',':')))
(root/'photos-raster.json').write_text(json.dumps(raster,separators=(',',':')))
print('Exact photos and font resources are ready.')
