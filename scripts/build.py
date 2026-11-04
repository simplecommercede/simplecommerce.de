#!/usr/bin/env python3
"""Build dependency-free static HTML. Serve public/, never the repository root."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape,unescape
from urllib.parse import urlparse,unquote
import json,re,shutil
from help_render import render_help
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'; BASE='https://simplecommerce.de'
pages=json.loads((ROOT/'content/wordpress-public.json').read_text())
pages.append({'ID':'help-quickstart','post_parent':'288','post_name':'produkt-schnellstart','post_title':'Produkt-Schnellstart','post_content':''})
pages.append({'ID':'help-glossary','post_parent':'288','post_name':'begriffe-und-editor','post_title':'Begriffe und HTML-Editor','post_content':''})
byid={p['ID']:p for p in pages}
paths={p['ID']:('/' if p['ID']=='10' else '/'+(('hilfe/' if p['post_parent']=='288' else 'shopsystem/' if p['post_parent']=='727' else '')+p['post_name']).strip('/')+'/') for p in pages}
registry=[]
legacy=json.loads((ROOT/'content/legacy-links.json').read_text())
NAV=[('Shop','/shopsystem/'),('Leistungen','/leistungen/'),('Hilfe','/hilfe/'),('Kontakt','/kontakt/')]
def links(items):return ''.join(f'<a href="{u}">{escape(t)} <span aria-hidden="true">↗</span></a>' for t,u in items)
def card(n,t,desc,u):return f'<a class="service" href="{u}"><span class="number">{n}</span><h3>{t}</h3><p>{desc}</p><span class="arrow" aria-hidden="true">↗</span></a>'
def page(path,title,desc,body,section='',kind='WebPage',noindex=False):
 canonical=BASE+path
 shop_context=path.startswith('/shopsystem/') or path=='/preise/'
 subnav='<nav class="wrap shop-nav" aria-label="Shop-Navigation">'+''.join(f'<a href="{url}"'+(' aria-current="page"' if path==url else '')+f'>{label}</a>' for label,url in [('Shopsystem','/shopsystem/'),('Shop-Preise','/preise/'),('Shop-Hilfe','/hilfe/')])+'</nav>' if shop_context else ''
 schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':BASE+'/#organization','name':'simplecommerce GmbH','url':BASE,'logo':BASE+'/assets/logo.jpg','email':'info@simplecommerce.de','telephone':'+4915127036178','address':{'@type':'PostalAddress','streetAddress':'Vor den Höfen 20a','postalCode':'29646','addressLocality':'Bispingen','addressCountry':'DE'}},{'@type':kind,'@id':canonical+'#page','name':title,'description':desc,'url':canonical,'inLanguage':'de-DE','publisher':{'@id':BASE+'/#organization'}}]}
 if path!='/':schema['@graph'].append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Startseite','item':BASE+'/'},{'@type':'ListItem','position':2,'name':title,'item':canonical}]})
 html=f'''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} | simplecommerce</title><meta name="description" content="{escape(desc,quote=True)}"><link rel="canonical" href="{canonical}"><meta name="robots" content="{'noindex,follow' if noindex else 'index,follow'}"><meta name="theme-color" content="#ff6600"><meta property="og:type" content="website"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}/assets/logo.jpg"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')}</script></head><body><a class="skip" href="#inhalt">Zum Inhalt</a><header class="header"><a href="/" class="brand" aria-label="simplecommerce – Startseite"><img src="/assets/logo.jpg" width="309" height="78" alt="simplecommerce"></a><nav aria-label="Hauptnavigation">{''.join(f'<a href="{u}"'+(' aria-current="page"' if path==u else ' aria-current="true"' if u=='/shopsystem/' and shop_context else '')+f'>{t}</a>' for t,u in NAV)}</nav><a class="header-cta" href="/kontakt/">Projekt besprechen <span aria-hidden="true">↗</span></a></header><main id="inhalt"><span id="top"></span>{subnav}{body}</main><footer><div class="footer-main"><div><p class="eyebrow">SIMPLECOMMERCE · BISPINGEN</p><h2>Eine Idee ist ein<br>guter Anfang.</h2><a class="text-link" href="mailto:info@simplecommerce.de">info@simplecommerce.de ↗</a></div><div><h3>Was wir für Sie tun</h3>{links([('Shopsystem','/shopsystem/'),('Webseiten','/webseiten/'),('IT-Beratung','/it-beratung/'),('IT-Projekte','/it-projekte/'),('Service','/service/')])}</div><div><h3>Gut zu wissen</h3>{links([('Shop-Preise','/preise/'),('Online-Hilfe','/hilfe/'),('Vertriebspartner','/vertriebspartner/'),('Kontakt','/kontakt/')])}<p>+49 151 270 36 178<br>Vor den Höfen 20a<br>29646 Bispingen</p></div></div><div class="footer-bottom"><span>© 2026 simplecommerce GmbH</span><div><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><a href="/cookie-richtlinie-eu/">Cookies</a></div></div></footer></body></html>'''
 dest=OUT/path.strip('/')/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text('\n'.join(line.rstrip() for line in html.splitlines())+'\n')
 registry.append({'path':path,'title':title,'description':desc,'noindex':noindex})
def intro(label,title,desc):return f'<section class="page-intro wrap"><p class="eyebrow">{label}</p><h1>{title}</h1><p class="lead">{desc}</p></section>'
def cta():return '<section class="cta wrap"><div><p class="eyebrow">LASSEN SIE UNS ANFANGEN</p><h2>Was haben Sie vor?</h2><p>Ein neuer Shop, eine Website oder ein Prozess, der einfacher werden soll.</p></div><a class="button" href="/kontakt/">Projekt besprechen <span aria-hidden="true">↗</span></a></section>'
services=[('01','Webseiten','Ein klarer Auftritt, der Ihr Unternehmen verständlich macht. Schnell, zugänglich und auf jedem Bildschirm.','/webseiten/'),('02','IT-Beratung','Anforderungen sortieren. Möglichkeiten bewerten. Entscheidungen auf eine solide Grundlage stellen.','/it-beratung/'),('03','IT-Projekte','Schnittstellen, Automatisierung und individuelle Software für Ihre Arbeitsabläufe.','/it-projekte/'),('04','Service','Persönliche Unterstützung für Ihren Shop und Ihre Website. Auch nach dem Start.','/service/')]
# Preserve only inert editorial markup. Never execute old scripts, forms or shortcodes.
class Cleaner(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.out=[];self.skip=0;self.ids=set()
 def handle_starttag(self,t,attrs):
  if t in ('script','style','iframe','form','object'):self.skip+=1;return
  if self.skip:return
  a=dict(attrs)
  if t=='a':
   href=a.get('href','');u=urlparse(href)
   if u.scheme not in ('','http','https','mailto','tel'):return
   if u.hostname in ('simplecommerce.de','www.simplecommerce.de','new.simplecommerce.de'):
    href=u.path or '/'
    if u.fragment:href+='#'+u.fragment
   if href.startswith('/seiten/') or href.startswith('/sec_helpcenter/'):
    key=Path(urlparse(href).path).stem.removeprefix('_').removeprefix('help_')
    href=legacy.get(key,'/hilfe/')
   elif href.startswith('help_') or href.startswith('_help_'):
    href=legacy.get(Path(urlparse(href).path).stem.removeprefix('_').removeprefix('help_'),'/hilfe/')
   anchor=a.get('id') or a.get('name')
   extra=' id="'+escape(anchor,quote=True)+'"' if anchor and anchor not in self.ids else ''
   if anchor:self.ids.add(anchor)
   self.out.append('<a href="'+escape(href,quote=True)+'"'+extra+'>')
  elif t in ('p','br','strong','em','b','i','ul','ol','li','h2','h3','h4','table','thead','tbody','tr','th','td','blockquote','sup','sub'):
   extra=''
   if a.get('id') and a['id'] not in self.ids:
    extra=' id="'+escape(a['id'],quote=True)+'"';self.ids.add(a['id'])
   if t in ('th','td'):
    for key in ['colspan','rowspan']:
     if a.get(key,'').isdigit():extra+=f' {key}="{a[key]}"'
   self.out.append('<'+t+extra+'>')
 def handle_endtag(self,t):
  if t in ('script','style','iframe','form','object'):
   self.skip=max(0,self.skip-1);return
  if self.skip:return
  if t in ('a','p','strong','em','b','i','ul','ol','li','h2','h3','h4','table','thead','tbody','tr','th','td','blockquote','sup','sub'):self.out.append('</'+t+'>')
 def handle_data(self,d):
  if not self.skip:self.out.append(escape(d))
def clean(s):
 c=Cleaner();c.feed(s);return re.sub(r'\[(?:/?[\w-]+)[^\]]*\]','', ''.join(c.out))
hero='''<section class="hero wrap"><div class="hero-copy"><p class="eyebrow"><span class="dot"></span> SIMPLECOMMERCE · DIGITAL MIT PERSÖNLICHKEIT</p><h1>Gute Ideen.<br>Starke Technik.<br><span>Einfach Ihr Ding.</span></h1><p class="lead">Shops, die verkaufen. Websites, die zu Ihnen passen. Software, die Arbeit leichter macht. Wir entwickeln die digitale Lösung für Ihr Unternehmen.</p><div class="actions"><a class="button" href="/kontakt/">Ihr Projekt besprechen <span aria-hidden="true">↗</span></a><a class="text-link" href="/leistungen/">Unsere Leistungen entdecken</a></div><p class="hero-note">Persönlich aus Bispingen. Vom ersten Gespräch bis zum Betrieb.</p></div><div class="brand-stage"><span class="stage-label">UNVERWECHSELBAR SIMPLECOMMERCE</span><div class="frog-portrait"><img src="/assets/brand/v_shop_cms.jpg" alt="Unser simplecommerce-Frosch mit grüner Haut und orangefarbenen Augen" width="780" height="204" fetchpriority="high"></div><div class="stage-bottom"><span>Technik mit Verstand.<br><strong>Zusammen einen Sprung weiter.</strong></span><span class="stage-arrow" aria-hidden="true">↗</span></div></div></section><div class="expertise-strip"><div class="wrap"><span>SHOPSYSTEME</span><span>WEBSITES</span><span>IT-BERATUNG</span><span>INDIVIDUELLE SOFTWARE</span></div></div>'''

shopsection='''<section class="shop-section"><div class="wrap split"><div><p class="eyebrow">UNSER SHOPSYSTEM</p><h2>Ihr Handel.<br>Ein guter Überblick.</h2><p>Produkte, Bestellungen und Kunden an einem Ort. simplecommerce begleitet Ihren Onlinehandel – mit einem individuell gestalteten Shop und persönlicher Unterstützung.</p><a class="button light" href="/shopsystem/">Das Shopsystem kennenlernen ↗</a></div><div class="shop-details"><div class="shop-photo"><img src="/assets/help/artikelliste-desktop.jpg" alt="Artikelliste der neuen Shopverwaltung mit fiktiven Demoprodukten" width="1265" height="712" loading="lazy"><span>Ihr Shop. Alles im Blick. · Ansicht mit Demodaten</span></div><div><span>01</span><h3>Verkaufen & verwalten</h3><p>Vom Produkt mit Varianten bis zur Bestellabwicklung.</p></div><div><span>02</span><h3>Am Schreibtisch & unterwegs</h3><p>Die neue Verwaltung passt sich auch kleineren Bildschirmen an.</p></div><div><span>03</span><h3>Individuell & verbunden</h3><p>Ihr Design, passende Schnittstellen und Raum für Ihre Abläufe.</p></div><a href="/hilfe/">So funktioniert’s: zur Online-Hilfe →</a></div></div></section>'''
page('/','Shops, Webseiten & IT-Beratung','simplecommerce aus Bispingen: Shopsystem, Webseitenerstellung, IT-Beratung, individuelle Software und persönlicher Service.',hero+shopsection+'<section class="wrap section"><div class="section-head"><div><p class="eyebrow">MEHR ALS EIN SHOP</p><h2>Was Ihr Unternehmen<br>als Nächstes braucht.</h2></div><p>Eine passende Lösung beginnt mit den richtigen Fragen. Gemeinsam machen wir aus Ihren Anforderungen einen klaren nächsten Schritt.</p></div><div class="services">'+''.join(card(*s) for s in services)+'</div></section><section class="process wrap"><p class="eyebrow">SO ARBEITEN WIR ZUSAMMEN</p><h2>Persönlich. Verständlich. Schritt für Schritt.</h2><div class="steps"><div><b>01 / Verstehen</b><p>Wir besprechen Ihr Vorhaben, Ihre Abläufe und die Menschen, die damit arbeiten.</p></div><div><b>02 / Umsetzen</b><p>Aus Anforderungen werden nachvollziehbare Schritte und eine passende technische Lösung.</p></div><div><b>03 / Begleiten</b><p>Wir unterstützen Sie beim Start und bei den nächsten Aufgaben im Betrieb.</p></div></div></section>'+cta())
page('/leistungen/','Leistungen für Ihr digitales Unternehmen','Webseitenerstellung, IT-Beratung, individuelle Software und Service von simplecommerce.',intro('UNSERE LEISTUNGEN','Gute Technik beginnt<br>bei Ihrer Aufgabe.','Ob Website, Beratung oder individuelle Software: Wir richten die Umsetzung an Ihrem Unternehmen aus.')+'<section class="services wrap">'+''.join(card(*s) for s in services)+'</section>'+shopsection+cta())
texts={
'webseiten':('Webseitenerstellung','Ein Auftritt,<br>der zu Ihnen passt.','Wir erstellen Websites, die Ihr Angebot klar vermitteln und Besucher zum passenden nächsten Schritt führen.',['Konzept und Inhalte|Wir strukturieren Ihre Leistungen, Zielgruppen und Kontaktwege. So finden Besucher schnell, was sie suchen.','Gestaltung für alle Bildschirme|Ihre Website funktioniert auf Smartphone, Tablet und Desktop. Lesbarkeit und einfache Bedienung stehen im Mittelpunkt.','Technisch schlank|Für Unternehmenswebsites setzen wir auf eine passende, wartbare Lösung. Ein CMS kommt dort zum Einsatz, wo Sie es tatsächlich benötigen.','Auffindbar und verständlich|Saubere Seitenstruktur, klare Texte, Metadaten und strukturierte Informationen unterstützen Suchmaschinen und KI-gestützte Suche.']),
'it-beratung':('Professionelle IT-Beratung','Klarheit für Ihre<br>nächste Entscheidung.','Wir helfen Ihnen, Anforderungen zu ordnen, technische Möglichkeiten einzuschätzen und einen umsetzbaren Weg zu finden.',['Bestand verstehen|Welche Systeme nutzen Sie? Wo entstehen doppelte Arbeit, Medienbrüche oder unnötige Abhängigkeiten?','Lösungen vergleichen|Wir betrachten passende technische Ansätze und besprechen Nutzen, Aufwand und Grenzen.','Umsetzung planen|Aus der Empfehlung entsteht eine nachvollziehbare Reihenfolge mit klaren Aufgaben.','Projekte begleiten|Bei Bedarf unterstützen wir die Umsetzung und den Austausch mit beteiligten Dienstleistern.']),
'it-projekte':('IT-Projekte & individuelle Software','Software für Ihre Abläufe.<br>Nicht umgekehrt.','Wir entwickeln individuelle Lösungen, verbinden Systeme und vereinfachen wiederkehrende Aufgaben.',['Schnittstellen|Wir verbinden Shop, Datenquellen und bestehende Anwendungen über geeignete Schnittstellen.','Automatisierung|Wiederkehrende Arbeitsschritte lassen sich gezielt vereinfachen – von Datenübernahmen bis zu internen Prozessen.','Individuelle Anwendungen|Wenn Standardsoftware nicht ausreicht, entwickeln wir eine Lösung für Ihre konkrete Aufgabe.','Bestehendes weiterentwickeln|Wir prüfen vorhandene Anwendungen und planen sinnvolle Erweiterungen oder eine schrittweise Modernisierung.']),
'service':('Service & Unterstützung','Nach dem Start<br>geht es weiter.','Persönliche Unterstützung für Fragen, Änderungen und den laufenden Betrieb Ihrer digitalen Lösung.',['Shop-Unterstützung|Wir helfen bei Fragen zu Artikeln, Bestellungen, Einstellungen und den täglichen Abläufen.','Pflege und Weiterentwicklung|Neue Inhalte, technische Anpassungen und zusätzliche Funktionen planen wir passend zu Ihrem Bedarf.','Einweisung|Wir erklären die benötigten Funktionen verständlich. Die Online-Hilfe unterstützt Sie auch danach.','Persönlicher Kontakt|Beschreiben Sie uns Ihre Aufgabe per E-Mail oder Kontaktformular. Wir besprechen die nächsten Schritte mit Ihnen.'])}
def brand_motif(slug):
 motifs={'webseiten':('v_shop_cms','Ideen brauchen einen eigenen Auftritt.','Der simplecommerce-Frosch als Nahaufnahme'),'it-beratung':('v_sicherheit','Gut beraten. Persönlich begleitet.','Der simplecommerce-Frosch sitzt in einer Hand'),'it-projekte':('v_updates','Bereit für den nächsten Schritt.','Der simplecommerce-Frosch in Bewegung'),'service':('v_bedienung','Wir bleiben an Ihrer Seite.','Der simplecommerce-Frosch auf einem Stein'),'sicherheit':('v_sicherheit','Vertrauen braucht eine solide Grundlage.','Der simplecommerce-Frosch in einer Hand'),'warenwirtschaft':('v_warenwirtschaft','Viele Verkaufskanäle. Ein klarer Überblick.','Der simplecommerce-Frosch an einem Rechenrahmen')}
 if slug not in motifs:return ''
 image,caption,alt=motifs[slug]
 return f'<aside class="brand-motif wrap"><div><p class="eyebrow">TYPISCH SIMPLECOMMERCE</p><p class="motif-caption">{caption}</p></div><div class="motif-crop {image}"><img src="/assets/brand/{image}.jpg" alt="{alt}" width="780" height="204" loading="lazy"></div></aside>'
for slug,(title,h1,desc,sections) in texts.items():
 body=intro('LEISTUNGEN / '+title.upper(),h1,desc)+brand_motif(slug)+'<section class="wrap service-content">'
 for i,s in enumerate(sections,1):h,p=s.split('|');body+=f'<article><span class="number">0{i}</span><h2>{h}</h2><p>{p}</p></article>'
 body+='</section><section class="wrap note"><h2>Was kostet das?</h2><p>Umfang und Aufwand hängen von Ihrem Vorhaben ab. Wir besprechen die Anforderungen und erstellen ein individuelles Angebot.</p><a href="/kontakt/">Individuelles Angebot anfragen →</a></section>'+cta()
 page('/'+slug+'/',title,desc,body,kind='WebPage')
shop_pages=[p for p in pages if p['post_parent']=='727' and p['ID']!='10']+[byid[i] for i in ['32','34','38','52','72','76','80','84','370']]
page('/shopsystem/','Shopsystem für Ihren Onlinehandel','simplecommerce Shopsystem: Produkte, Bestellungen, Kunden und Inhalte verwalten. Individuelles Design, Schnittstellen und mobile Verwaltung.',intro('SIMPLECOMMERCE SHOPSYSTEM','Für Ihren Shop.<br>Und alles dahinter.','Ein individuell gestalteter Onlineshop und eine Verwaltung für die tägliche Arbeit. Lernen Sie die Funktionen und Möglichkeiten kennen.')+shopsection+'<section class="wrap section"><p class="eyebrow">DAS STECKT DRIN</p><h2>Ein System. Viele Möglichkeiten.</h2><div class="topic-grid">'+links([(p['post_title'],paths[p['ID']]) for p in shop_pages])+'</div></section><section class="wrap note"><h2>Auch mobil verwalten</h2><p>Die neue Shopverwaltung lässt sich auch auf einem Smartphone bedienen. In der Hilfe zeigen Desktop- und Mobilansichten, wo Sie die jeweiligen Funktionen finden.</p><a href="/hilfe/">Online-Hilfe öffnen →</a></section>'+cta())
# Help articles are kept as migration drafts until verified against the current UI.
help_pages=[p for p in pages if p['post_parent']=='288']
help_data_path=ROOT/'content/help-updates.json'
help_data=json.loads(help_data_path.read_text()) if help_data_path.exists() else {}
help_details=json.loads((ROOT/'content/help-details.json').read_text())
help_shots=json.loads((ROOT/'content/screenshots.json').read_text())
for slug,sections in help_details.items():
 help_data[slug]['html']=render_help(help_data[slug],sections,help_shots)
for p in pages:
 if p['ID'] in ['10','288','727'] or p['post_name'] in ['kontakt','preise','cookie-richtlinie-eu'] or p['post_name'] in ['veranstaltungen','veranstaltungsorte','schlagwoerter','ihre-buchungen'] or p['post_parent']=='816':continue
 ishelp=p['post_parent']=='288'; title=p['post_title']; content=clean(p['post_content']);slug=p['post_name'];path=paths[p['ID']]
 if ishelp:
  upd=help_data.get(slug)
  if upd:
   content=upd['html']; desc=upd['description']; title=upd.get('title',title); note=''
  else:
   desc=f'{title}: Anleitung aus dem bisherigen simplecommerce Helpcenter.'
   note='<aside class="migration-note"><strong>Diese Anleitung wird überarbeitet.</strong> Der folgende Text stammt aus der bisherigen Hilfe. Menünamen und Schritte können in der neuen Verwaltung abweichen. <a href="/kontakt/">Bei Fragen unterstützen wir Sie persönlich.</a></aside>'
  body=intro('ONLINE-HILFE',title,desc)+'<div class="help-layout wrap"><aside class="help-sidebar"><a href="/hilfe/">← Alle Hilfethemen</a><h2>Shopverwaltung</h2>'+links([(x['post_title'],paths[x['ID']]) for x in help_pages])+'</aside><article class="prose">'+note+content+'</article></div>'
  page(path,title+' – Hilfe',desc,body,kind='TechArticle',noindex=not bool(upd));continue
 desc=f'{title} bei simplecommerce: Informationen und Möglichkeiten für Ihren Onlineshop.'
 page(path,title,desc,intro('SIMPLECOMMERCE',title,desc)+brand_motif(slug)+'<article class="prose wrap narrow">'+content+'</article>'+('' if slug in ['impressum','datenschutz'] else cta()))
page('/hilfe/','Online-Hilfe zur Shopverwaltung','Anleitungen zu Produkten, Bestellungen, Kunden und Einstellungen in simplecommerce. Finden Sie das passende Thema für Ihre Shopverwaltung.',intro('SIMPLECOMMERCE HELPCENTER','Eine Frage?<br>Hier geht’s weiter.','Anleitungen für Ihre tägliche Arbeit mit simplecommerce – vom ersten Artikel bis zur Bestellabwicklung.')+'<section class="wrap help-search"><label for="hilfe-suche">Hilfethema suchen</label><input id="hilfe-suche" type="search" placeholder="Zum Beispiel Artikel, Versand oder Kunden" autocomplete="off"><p id="suchstatus" role="status" aria-live="polite"></p><div class="topic-grid" id="help-topics">'+''.join(f'<a href="{paths[p["ID"]]}" data-topic="{escape(p["post_title"].lower())}">{escape(p["post_title"])} <span aria-hidden="true">↗</span></a>' for p in help_pages)+'</div></section>'+cta())
price=byid['766']['post_content'];m=re.search(r'<table\b.*?</table>',price,re.S)
table=clean(m[0]) if m else clean(price)
page('/preise/','Shop-Preise – Miete und Umsatzprovision','Preise für das simplecommerce Shopsystem: Shopmiete, Umsatzprovision, Einrichtung und Gestaltung im Überblick.',intro('SHOPSYSTEM / PREISE','Die Preise für<br>Ihr Shopsystem.','Shopmiete und Umsatzprovision richten sich nach Ihrem monatlichen Umsatz. Hier finden Sie die laufenden Kosten und einmaligen Leistungen für Ihren Shop.')+'<section class="wrap"><div class="section-head"><div><p class="eyebrow">SHOPSYSTEM</p><h2>Die laufenden Kosten im Überblick.</h2></div></div><div class="table-scroll" tabindex="0" role="region" aria-label="Shoppreise nach Umsatzstufe">'+table+'</div><p class="fine">Alle genannten Beträge verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer.</p><div class="price-extras"><div><h3>Einrichtung & Gestaltung</h3><p>Template-Anpassung: 499,00 € einmalig.<br>Template nach Vorlage: 990,00 € einmalig.<br>Artikeldaten übernehmen: 150,00 € pauschal.<br>Einweisung: 500,00 € Tagespauschale zuzüglich Anfahrt und Übernachtung.</p><a href="/design-und-layout/">Details zu Design & Layout →</a></div><div><h3>Fragen zu Ihrem Shop?</h3><p>Wir besprechen die passende Umsatzstufe, die Einrichtung und individuelle Erweiterungen für Ihren Shop.</p><a href="/kontakt/">Shop-Angebot anfragen →</a></div></div></section>'+cta())
form='''<form action="/kontakt/senden.php" method="post" class="contact-form"><h2>Erzählen Sie uns von Ihrem Vorhaben.</h2><label for="name">Ihr Name</label><input id="name" name="name" autocomplete="name" maxlength="120" required><label for="email">E-Mail-Adresse</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required><label for="thema">Worum geht es?</label><select id="thema" name="thema"><option>Shopsystem</option><option>Webseitenerstellung</option><option>IT-Beratung</option><option>IT-Projekt</option><option>Service</option><option>Sonstiges</option></select><label for="nachricht">Ihre Nachricht</label><textarea id="nachricht" name="nachricht" rows="7" minlength="10" maxlength="10000" required></textarea><div class="honeypot" aria-hidden="true"><label for="website">Bitte leer lassen</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="fine">Wir verwenden Ihre Angaben, um Ihre Anfrage zu bearbeiten. Weitere Informationen finden Sie in unserer <a href="/datenschutz/">Datenschutzerklärung</a>.</p><button class="button" type="submit">Anfrage senden ↗</button></form>'''
page('/kontakt/','Kontakt – Ihr Projekt mit simplecommerce','Kontaktieren Sie simplecommerce in Bispingen: info@simplecommerce.de, +49 151 270 36 178 oder über das Kontaktformular.',intro('KONTAKT','Lassen Sie uns<br>darüber sprechen.','Sie planen etwas Neues oder benötigen Unterstützung? Beschreiben Sie uns kurz Ihr Anliegen.')+'<section class="wrap contact-grid"><div><h2>Direkt zu uns.</h2><a class="contact-link" href="mailto:info@simplecommerce.de">info@simplecommerce.de</a><a class="contact-link" href="tel:+4915127036178">+49 151 270 36 178</a><p>simplecommerce GmbH<br>Vor den Höfen 20a<br>29646 Bispingen</p><h3>Telefonische Erreichbarkeit</h3><p>Montag–Donnerstag: 11:00–16:30 Uhr<br>Freitag: 11:00–14:30 Uhr</p><p>Eine Frage zur Shopverwaltung?<br><a href="/hilfe/">Zur Online-Hilfe →</a></p></div>'+form+'</section>')
page('/cookie-richtlinie-eu/','Cookies & lokale Speicherung','Informationen zur Nutzung von Cookies und lokalem Speicher auf simplecommerce.de.',intro('DATENSCHUTZ','Cookies & lokale Speicherung','Diese Website lädt ihre Schriften, Styles und Skripte lokal.')+'<article class="prose wrap narrow"><p>Die statischen Seiten setzen keine Analyse- oder Marketing-Cookies und binden keine externen Trackingdienste ein. Die Hilfesuche arbeitet direkt im Browser und überträgt keine Suchbegriffe an einen Server.</p><p>Beim Absenden des Kontaktformulars werden die eingegebenen Angaben zur Bearbeitung Ihrer Anfrage an unseren Server übertragen. Informationen zur Verarbeitung personenbezogener Daten finden Sie in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p></article>')
page('/404/','Seite nicht gefunden','Die gesuchte Seite wurde nicht gefunden. Hier gelangen Sie zu den Leistungen oder zur Hilfe.',intro('404','Hier geht es leider<br>nicht weiter.','Vielleicht hat sich die Adresse geändert. Über die Navigation finden Sie zu den aktuellen Inhalten.')+'<div class="wrap actions"><a class="button" href="/">Zur Startseite</a><a class="text-link" href="/hilfe/">Zur Hilfe →</a></div>',noindex=True)

for slug,title,text in [
 ('andoo','Datenaustausch und Schnittstellen','Sie möchten Produkt- oder Bestelldaten mit einem weiteren System austauschen? Wir besprechen die passende Schnittstelle für Ihren Shop.'),
 ('shopbackup','Datensicherung des Shops','Stimmen Sie Sicherungsumfang, Aufbewahrung und Wiederherstellung mit dem zuständigen Betrieb ab. Wir unterstützen Sie bei einem passenden Sicherungskonzept.'),
 ('yatego','Weitere Verkaufskanäle','Sie planen einen zusätzlichen Verkaufskanal? Wir klären die Anforderungen, die benötigten Produktdaten und den passenden Ablauf mit Ihnen.')]:
 page('/hilfe/'+slug+'/',title,text,intro('ONLINE-HILFE / SERVICE',title,text)+'<article class="prose wrap narrow"><p><a href="/kontakt/">Anbindung oder Datensicherung besprechen →</a></p><p><a href="/hilfe/">Zur aktuellen Hilfe</a></p></article>')

(OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+BASE+p['path']+'</loc></url>' for p in registry if not p['noindex'])+'</urlset>\n')
(OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /kontakt/senden.php\nSitemap: '+BASE+'/sitemap.xml\n')
(ROOT/'content/page-index.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
print(f'{len(registry)} statische Seiten erstellt.')
