"""Central legacy help routes; Apache redirects and native fragment aliases."""
from pathlib import Path
from urllib.parse import urlsplit
from html import escape
import json,re
ROOT=Path(__file__).resolve().parents[1]
def config(root=ROOT):
 return json.loads((root/'content/legacy-help.json').read_text())
def routes(root=ROOT):
 result=[]
 for slug,target in json.loads((root/'content/legacy-links.json').read_text()).items():
  result.extend([(r'/sec_helpcenter/_?help_'+re.escape(slug)+r'\.html',target),(r'/seiten/[0-9]+/de/(?:help_)?'+re.escape(slug)+r'\.html',target)])
 result.extend((re.escape(source),target) for source,target in config(root)['exact'].items())
 result.extend([(r'/sec_helpcenter/lexikon/[^/]+\.html','/hilfe/begriffe-und-editor/'),(r'/sec_helpcenter/sonderzeichen\.php','/hilfe/begriffe-und-editor/#html')])
 return result

def resolve(url,root=ROOT):
 u=urlsplit(url)
 for pattern,target in routes(root):
  if re.fullmatch(pattern,u.path):
   dest=urlsplit(target);fragment=dest.fragment or u.fragment
   return dest.path+('#'+fragment if fragment else '')
 return None

def add_legacy_anchors(path,html):
 for alias,target in config()['anchors'].get(path,{}).items():
  assert f'id="{alias}"' not in html,alias
  pattern=r'(<section\b[^>]*\bid="'+re.escape(target)+r'"[^>]*>)'
  html,n=re.subn(pattern,lambda m:m[0]+f'<span id="{escape(alias,quote=True)}" class="legacy-anchor" style="display:block;height:0;scroll-margin-top:100px" aria-hidden="true"></span>',html,count=1)
  assert n==1,(path,alias,target)
 return html

def build_redirects(root=ROOT):
 lines=['# Generated from content/legacy-links.json and content/legacy-help.json.']
 for pattern,target in routes(root):
  # Real production hosts canonicalize together with the path in a single hop.
  lines+=['RewriteCond %{HTTP_HOST} ^(?:www\\.)?simplecommerce\\.de(?::(?:80|443))?$ [NC]',f'RewriteRule ^{pattern.lstrip("/")}$ https://simplecommerce.de{target} [R=301,L,NE,QSD]',f'RewriteRule ^{pattern.lstrip("/")}$ {target} [R=301,L,NE,QSD]']
 # These routes deliberately do not have an equivalent. Never hide them behind a generic 301.
 for slug in config(root)['unresolved']:
  pattern=r'(?:sec_helpcenter/_?help_'+re.escape(slug)+r'|seiten/[0-9]+/de/(?:help_)?'+re.escape(slug)+r')\.html'
  lines.append(f'RewriteRule ^{pattern}$ - [R=404,L]')
 template=(root/'content/htaccess.conf').read_text()
 (root/'public/.htaccess').write_text(template.replace('# LEGACY_HELP_RULES','\n'.join(lines)))

if __name__=='__main__':build_redirects()
