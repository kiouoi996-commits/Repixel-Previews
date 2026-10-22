"""Fetch the two pinned scene assets; raster data URIs stay local to the renderer."""
import base64
import hashlib
import io
import json
import urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).parent
photos={}
for item in json.loads((root/'assets.json').read_text()):
    data=urllib.request.urlopen(item['url']).read()
    assert len(data)==item['bytes']
    assert hashlib.sha256(data).hexdigest()==item['sha256']
    target=root/'assets'/Path(item['url']).name
    target.parent.mkdir(exist_ok=True)
    target.write_bytes(data)
    decoded=io.BytesIO()
    Image.open(io.BytesIO(data)).save(decoded,format='PNG')
    key='frostedLandscape' if 'frosted' in target.name else 'landscape'
    photos[key]='data:image/png;base64,'+base64.b64encode(decoded.getvalue()).decode()
(root/'photos-raster.json').write_text(json.dumps(photos))
print('Two original scene assets verified and prepared for offline raster rendering')
