from pathlib import Path
import requests,hashlib,os
BASE='https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/65e9759ddad33685ab4ddb6c6981c257e1544ab6/images/orange-apex-sport-cluster/'
ROOT=Path(__file__).resolve().parent
FILES={'car-top-view.webp': {'bytes': 81706, 'sha256': '9e7b96e448761c0b6ad1a5b0b31ae4d54b0072a5f2e7fbc07c1f73fdd3662b95'}, 'gauge-speed-left.svg': {'bytes': 15950, 'sha256': 'cfc17bcf20c06e8d0839a07c3d2018e9edf71fe2044f72487cf93b0f849f0891'}, 'gauge-rpm-right.svg': {'bytes': 14635, 'sha256': '7f9745a6ae729f74d4cbd0866b3cedd1c8b1e96c73ce42c3b8eb77ff407324c7'}, 'icons/fuel-pump.svg': {'bytes': 736, 'sha256': 'e076a672729e7d0aec72fa005dca0a072ff1ec857106a480c5aa61c6f3201419'}, 'icons/coolant-temperature.svg': {'bytes': 882, 'sha256': '64553a0f2e4832208acaaca6d14cb1e569183bc4e3d5e35363ba976f4b558559'}, 'icons/gear-bracket.svg': {'bytes': 235, 'sha256': 'f5c516ddfac2dba8c159bcedd25b1a679ced73e4ef2e9593e524a127a8a0479b'}}
def install_asset_routes(page):
 assets=Path(os.environ.get('APEX_ASSET_CACHE',str(ROOT/'.asset-cache')))
 assets.mkdir(parents=True,exist_ok=True)
 for name,expected in FILES.items():
  path=assets/name
  if not path.exists():
   response=requests.get(BASE+name,timeout=30);response.raise_for_status();path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(response.content)
  data=path.read_bytes();assert len(data)==expected['bytes'];assert hashlib.sha256(data).hexdigest()==expected['sha256']
 def route_asset(route):
  relative=route.request.url[len(BASE):].split('?')[0]
  path=assets/relative
  assert path.is_file(),relative
  kind='image/webp' if path.suffix=='.webp' else 'image/svg+xml'
  route.fulfill(status=200,body=path.read_bytes(),content_type=kind)
 page.route(BASE+'**',route_asset)

 def route_local(route):
  name=route.request.url.split('/',3)[3].split('?')[0] or 'index.html'
  path=ROOT/name
  assert path.parent==ROOT and path.is_file(),name
  kind='application/javascript' if path.suffix=='.mjs' else 'text/html' if path.suffix=='.html' else 'image/svg+xml'
  route.fulfill(status=200,body=path.read_bytes(),content_type=kind)
 page.route('http://127.0.0.1:4177/**',route_local)
