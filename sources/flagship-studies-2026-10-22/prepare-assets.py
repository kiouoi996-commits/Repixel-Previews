"""Verify pinned photographs and prepare renderer-local PNG data URIs."""
import base64
import hashlib
import io
import json
import urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).parent
photos={}
for item in json.loads((root/'asset-origins.json').read_text()):
    data=urllib.request.urlopen(item['url']).read()
    assert len(data)==item['bytes']
    assert hashlib.sha256(data).hexdigest()==item['sha256']
    target=root/'assets'/(item['kind']+'.webp')
    target.parent.mkdir(exist_ok=True)
    target.write_bytes(data)
    buffer=io.BytesIO()
    Image.open(io.BytesIO(data)).save(buffer,format='PNG')
    photos[item['kind']]='data:image/png;base64,'+base64.b64encode(buffer.getvalue()).decode()
(root/'photos-raster.json').write_text(json.dumps(photos))
print('Three pinned photographs verified and prepared')
