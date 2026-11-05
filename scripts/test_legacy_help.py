#!/usr/bin/env python3
"""Test actual Apache responses; emit a complete local manual review list."""
import argparse,json,re
from pathlib import Path
from urllib.request import Request,build_opener,HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import urlsplit,urljoin,urldefrag
from html import escape
from legacy_help import config,resolve,ROOT
class NoRedirect(HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
opener=build_opener(NoRedirect())
def get(url,host=None):
 req=Request(url,headers={'Host':host} if host else {})
 try:r=opener.open(req,timeout=10)
 except HTTPError as e:r=e
 return r.code,dict(r.headers),r.read().decode('utf-8',errors='replace')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--base',default='http://127.0.0.1:1894');ap.add_argument('--report-dir',default='/private/tmp/sc-legacy-review');args=ap.parse_args();base=args.base.rstrip('/');rows=[];errors=[]
 for old in config()['audit_urls']:
  expected=resolve(old);code,headers,body=get(base+urldefrag(old)[0]);location=headers.get('Location');status='';target=None
  if expected:
   assert code==301,(old,code)
   target=urljoin(base,location);u=urlsplit(target)
   assert u.netloc==urlsplit(base).netloc,(old,'left local origin',target)
   assert not u.query,(old,'legacy query retained')
   effective=target+('#'+urlsplit(old).fragment if not u.fragment and urlsplit(old).fragment else '')
   assert effective==base+expected,(old,effective,expected)
   final,fh,html=get(urldefrag(target)[0]);assert final==200,(old,final)
   frag=urlsplit(effective).fragment
   found=not frag or re.search(r'\bid=["\']'+re.escape(frag)+r'["\']',html)
   assert bool(found)==(old not in config()['unresolved_fragments']),(old,'unexpected anchor status')
   status='301 → 200'+(' · Anker OK' if frag and found else ' · OFFEN: alter Detailanker fehlt' if frag else '')
   target=effective
   if u.path.startswith('/hilfe/'):
    assert 'X-Frame-Options' not in fh,(old,'iframe blocked')
    assert 'http: https:' in fh.get('Content-Security-Policy',''),(old,'frame policy')
   # Production-host requests must go straight to canonical HTTPS; never follow live.
   for host in ['simplecommerce.de','www.simplecommerce.de']:
    pc,ph,_=get(base+urldefrag(old)[0],host)
    assert pc==301 and ph.get('Location')=='https://simplecommerce.de'+urlsplit(expected).path+('#'+urlsplit(location).fragment if urlsplit(location).fragment else ''),(old,host,ph)
  else:
   assert code==404 and not location,(old,code,location)
   slug=Path(urlsplit(old).path).stem.removeprefix('help_')
   status='404 · OFFEN: '+config()['unresolved'].get(slug,'Keine Zuordnung')
  rows.append({'old':old,'target':target,'status':status})
 for path in ['/kontakt/','/impressum/','/']:
  code,h,_=get(base+path);assert code==200 and h.get('X-Frame-Options')=='SAMEORIGIN',path
 code,h,_=get(base+'/sec_helpcenter/nicht-vorhanden.html');assert code==404
 # Popupflag mixed with other obsolete query parameters must not produce duplicates.
 code,h,_=get(base+'/seiten/50/de/artikeldaten.html?x=1&pop=1');assert code==301 and '?' not in h['Location']
 out=Path(args.report_dir);out.mkdir(parents=True,exist_ok=True)
 table=''.join('<tr><td><a href="'+escape(base+x['old'],quote=True)+'">'+escape(x['old'])+'</a></td><td>'+('<a href="'+escape(x['target'],quote=True)+'">'+escape(x['target'].removeprefix(base))+'</a>' if x['target'] else 'Kein fachlich passendes Ziel')+'</td><td>'+escape(x['status'])+'</td></tr>' for x in rows)
 (out/'index.html').write_text('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Alte Hilfelinks – vollständige Prüfliste</title><style>body{font:16px system-ui;margin:32px;color:#222}table{border-collapse:collapse;width:100%}td,th{padding:12px;text-align:left;border-bottom:1px solid #ddd;overflow-wrap:anywhere}a{color:#a43e00}tr:hover{background:#fff4eb}</style><h1>Alte Hilfelinks – 66 Varianten</h1><p>Apache-Testserver '+escape(base)+'. Jeder alte Link und jedes vorhandene Ziel sind anklickbar. 301 ist eine permanente HTTP-Weiterleitung. OFFEN bedeutet fehlender Fachinhalt oder Detailanker, keine technische Erfolgsbehauptung.</p><p>Fragmente werden vom Browser übernommen und auf native HTML-IDs geprüft. Hilfe darf aus Shop-Admins eingebettet werden. Andere Seiten behalten SAMEORIGIN. Nicht live bereitgestellt.</p><table><thead><tr><th>Alter Link</th><th>Neues Ziel</th><th>Prüfstatus</th></tr></thead><tbody>'+table+'</tbody></table></html>')
 (out/'results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 print(f'{len(rows)} Varianten HTTP-geprüft; '+str(sum(x['target'] is not None for x in rows))+' Weiterleitungen; '+str(sum(x['target'] is None for x in rows))+' ohne Ersatz; '+str(sum('Detailanker' in x['status'] for x in rows))+' offene Detailanker.')
 print(base+'/__legacy-review/')
if __name__=='__main__':main()
