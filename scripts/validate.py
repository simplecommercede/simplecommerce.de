from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json,sys
root=Path(__file__).resolve().parents[1] if '/scripts/' in str(Path(__file__).resolve()) else Path('/Users/benjamin.bartels/develop/simplecommerce.de')
web=root/'public'; errors=[];warnings=[];info={}
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.refs=[];self.h1=0;self.title=False;self.canonical=[];self.ld=False;self.ldtext='';self.schemas=[];self.noindex=False
 def handle_starttag(self,t,a):
  a=dict(a)
  if a.get('id'):
   if a['id'] in self.ids:errors.append(f'{current}: doppelte ID {a["id"]}')
   self.ids.add(a['id'])
  if t=='h1':self.h1+=1
  if t=='title':self.title=True
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='meta' and a.get('name')=='robots':self.noindex='noindex' in a.get('content','')
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True;self.ldtext=''
  for key in ['href','src','action']:
   if key in a:self.refs.append(a[key])
  if t=='img' and not a.get('alt'):errors.append(f'{current}: Bild ohne Alternativtext')
 def handle_data(self,d):
  if self.ld:self.ldtext+=d
 def handle_endtag(self,t):
  if t=='script' and self.ld:
   try:self.schemas.append(json.loads(self.ldtext))
   except ValueError:errors.append(f'{current}: ungültiges JSON-LD')
   self.ld=False
for file in web.rglob('index.html'):
 current=str(file.relative_to(web));p=Page();p.feed(file.read_text());info[current]=p
 if p.h1!=1:errors.append(f'{current}: {p.h1} H1-Überschriften')
 if len(p.canonical)!=1:errors.append(f'{current}: Canonical fehlt/mehrfach')
 if not p.schemas:errors.append(f'{current}: strukturierte Daten fehlen')
 if not p.title:errors.append(f'{current}: Titel fehlt')
for current,p in info.items():
 for ref in p.refs:
  u=urlparse(ref)
  if u.scheme or u.netloc:continue
  target=(web/u.path.lstrip('/')) if ref.startswith('/') else (web/current).parent/u.path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{current}: fehlendes Ziel {ref}')
  if u.fragment and target.suffix=='.html':
   q=info.get(str(target.relative_to(web)))
   if q and unquote(u.fragment) not in q.ids:warnings.append(f'{current}: fehlender Anker {ref}')
print(f'{len(info)} Seiten: {len(errors)} Fehler, {len(warnings)} Ankerhinweise')
for x in errors+warnings:print(x)
sys.exit(bool(errors))
