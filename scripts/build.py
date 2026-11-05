#!/usr/bin/env python3
"""Build dependency-free static HTML. Serve public/, never the repository root."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape,unescape
from urllib.parse import urlparse,unquote
import json,re,shutil
from help_render import render_help
from legacy_help import build_redirects, add_legacy_anchors
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
# Untermenüs führen direkt zu den Detailseiten; die vier Hauptpunkte bleiben wie festgelegt.
NAV_SUB={'/shopsystem/':[('Shopsystem','/shopsystem/'),('Shop-Preise','/preise/'),('Shop wechseln','/shopsystem/shop-wechseln/'),('Bestellwesen','/shopsystem/bestellwesen/'),('Warenwirtschaft','/warenwirtschaft/')],'/leistungen/':[('Webseiten','/webseiten/'),('IT-Beratung','/it-beratung/'),('IT-Projekte','/it-projekte/'),('KI-Anwendungen','/ki-anwendungen/'),('Service','/service/')],'/hilfe/':[('Alle Hilfethemen','/hilfe/'),('Artikel anlegen','/hilfe/artikel-anlegen/'),('Verkaufsmanager','/hilfe/verkaufsmanager/'),('Versand','/hilfe/versand/')]}
def nav_html(path,shop_context):
 out=''
 for t,u in NAV:
  current=' aria-current="page"' if path==u else ' aria-current="true"' if u=='/shopsystem/' and shop_context else ''
  sub=''.join(f'<a href="{x}"'+(' aria-current="page"' if path==x else '')+f'>{escape(n)}</a>' for n,x in NAV_SUB.get(u,[]))
  out+=f'<div class="nav-item"><a href="{u}"{current}>{t}</a>'+(f'<div class="nav-sub">{sub}</div>' if sub else '')+'</div>'
 return out
def links(items):return ''.join(f'<a href="{u}">{escape(t)}</a>' for t,u in items)
def card(t,desc,u,media=''):return f'<a class="service reveal" href="{u}">{media}<div class="service-body"><h3>{t}</h3><p>{desc}</p><span class="more">Mehr erfahren</span></div></a>'
def page(path,title,desc,body,section='',kind='WebPage',noindex=False):
 canonical=BASE+path
 shop_context=path.startswith('/shopsystem/') or path=='/preise/'
 subnav='<nav class="wrap shop-nav" aria-label="Shop-Navigation">'+''.join(f'<a href="{url}"'+(' aria-current="page"' if path==url else '')+f'>{label}</a>' for label,url in [('Shopsystem','/shopsystem/'),('Shop-Preise','/preise/'),('Shop-Hilfe','/hilfe/')])+'</nav>' if shop_context else ''
 schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':BASE+'/#organization','name':'simplecommerce GmbH','url':BASE,'logo':BASE+'/assets/logo.jpg','email':'info@simplecommerce.de','telephone':'+4915127036178','address':{'@type':'PostalAddress','streetAddress':'Vor den Höfen 20a','postalCode':'29646','addressLocality':'Bispingen','addressCountry':'DE'}},{'@type':kind,'@id':canonical+'#page','name':title,'description':desc,'url':canonical,'inLanguage':'de-DE','publisher':{'@id':BASE+'/#organization'}}]}
 if path!='/':schema['@graph'].append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Startseite','item':BASE+'/'},{'@type':'ListItem','position':2,'name':title,'item':canonical}]})
 html=f'''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} | simplecommerce</title><meta name="description" content="{escape(desc,quote=True)}"><link rel="canonical" href="{canonical}"><meta name="robots" content="{'noindex,follow' if noindex else 'index,follow'}"><meta name="theme-color" content="#ff6600"><meta property="og:type" content="website"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}/assets/logo.jpg"><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/guide.css"><script src="/assets/site.js" defer></script><script src="/assets/guide-glass.js" defer></script><script src="/assets/guide.js" defer></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')}</script></head><body><a class="skip" href="#inhalt">Zum Inhalt</a><header class="header"><a href="/" class="brand" aria-label="simplecommerce – Startseite" data-logo><img class="logo-word" src="/assets/logo.jpg" width="309" height="78" alt="simplecommerce"><span class="logo-e"></span><span class="logo-hero"><span class="logo-frog"></span><svg class="logo-face" viewBox="0 0 309 78" aria-hidden="true" focusable="false"><defs><radialGradient id="logo-throat-g"><stop offset="0" stop-color="#fff"/><stop offset=".65" stop-color="#f6f3f0"/><stop offset="1" stop-color="#f6f3f0" stop-opacity="0"/></radialGradient></defs><ellipse class="logo-throat" cx="58" cy="41" rx="20" ry="14" fill="url(#logo-throat-g)"/><g class="logo-mouth"><path d="M37 27 Q58 30 79 27 Q58 42 37 27Z" fill="#6e1b2a"/><ellipse cx="58" cy="31.5" rx="9" ry="3" fill="#e8658a"/></g><ellipse class="logo-lid" cx="37.5" cy="15.5" rx="6.2" ry="8.6" fill="#57c22f" stroke="#3f9a22" stroke-width=".6"/><ellipse class="logo-lid" cx="78" cy="15" rx="6.2" ry="8.6" fill="#57c22f" stroke="#3f9a22" stroke-width=".6"/></svg></span><svg class="logo-reach" viewBox="0 0 309 78" aria-hidden="true" focusable="false"><g class="logo-tongue" fill="none" stroke-linecap="round"><path d="M58 31 C78 46 96 8 128 8 S172 4 177 29" pathLength="1" stroke="#b5305a" stroke-width="5.4"/><path d="M58 31 C78 46 96 8 128 8 S172 4 177 29" pathLength="1" stroke="#ee6a90" stroke-width="3.8"/><path d="M58 31 C78 46 96 8 128 8 S172 4 177 29" pathLength="1" stroke="#ffc4d6" stroke-width="1"/></g><g class="logo-tip"><g class="logo-blob"><ellipse rx="6.4" ry="5.4" fill="#f0517f" stroke="#b5305a" stroke-width=".9"/><circle cx="-1.8" cy="-1.9" r="1.5" fill="#ffe0ea"/><circle cx="2.2" cy="1.4" r=".7" fill="#ffc4d6"/><circle cx="-1" cy="2.2" r=".6" fill="#ffc4d6"/></g></g></svg></a><nav aria-label="Hauptnavigation">{nav_html(path,shop_context)}</nav><a class="header-cta" href="/kontakt/">Projekt besprechen</a></header><main id="inhalt"><span id="top"></span>{subnav}{body}</main><footer><div class="footer-main"><div><p class="footer-title">simplecommerce GmbH</p><p>Vor den Höfen 20a<br>29646 Bispingen</p><a href="tel:+4915127036178">+49 151 270 36 178</a><a href="mailto:info@simplecommerce.de">info@simplecommerce.de</a></div><div><p class="footer-title">Leistungen</p>{links([('Shopsystem','/shopsystem/'),('Webseiten','/webseiten/'),('IT-Beratung','/it-beratung/'),('IT-Projekte','/it-projekte/'),('KI-Anwendungen','/ki-anwendungen/'),('Service','/service/')])}</div><div><p class="footer-title">Gut zu wissen</p>{links([('Shop-Preise','/preise/'),('Online-Hilfe','/hilfe/'),('Vertriebspartner','/vertriebspartner/'),('Kontakt','/kontakt/')])}</div></div><div class="footer-bottom"><span>© 2026 simplecommerce GmbH</span><div><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><a href="/cookie-richtlinie-eu/">Cookies</a></div></div></footer></body></html>'''
 dest=OUT/path.strip('/')/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(add_legacy_anchors(path, '\n'.join(line.rstrip() for line in html.splitlines())+'\n'))
 registry.append({'path':path,'title':title,'description':desc,'noindex':noindex})
def intro(label,title,desc):return f'<section class="page-intro wrap reveal"><h1>{title}</h1><p class="lead">{desc}</p></section>'
def cta(title='Was haben Sie vor?',text='Ein neuer Shop, eine Website oder ein Prozess, der einfacher werden soll.',label='Projekt besprechen',url='/kontakt/'):return f'<section class="cta wrap reveal"><div><h2>{title}</h2><p>{text}</p></div><a class="button" href="{url}">{label}</a></section>'
services=[('Webseiten','Ein klarer Auftritt, der Ihr Unternehmen verständlich macht. Schnell, zugänglich und auf jedem Bildschirm.','/webseiten/'),('IT-Beratung','Anforderungen sortieren. Möglichkeiten bewerten. Entscheidungen auf eine solide Grundlage stellen.','/it-beratung/'),('IT-Projekte','Schnittstellen, Automatisierung und individuelle Software für Ihre Arbeitsabläufe.','/it-projekte/'),('KI-Anwendungen','KI, die Ihnen Arbeit abnimmt. Auf Wunsch mit einem eigenen Modell, das Ihr Unternehmen kennt.','/ki-anwendungen/'),('Service','Persönliche Unterstützung für Ihren Shop und Ihre Website. Auch nach dem Start.','/service/')]
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

price=byid['766']['post_content'];m=re.search(r'<table\b.*?</table>',price,re.S)
# Nur die Schreibweise vereinheitlichen (10.00 € zu 10,00 €), die Beträge bleiben unverändert.
table=re.sub(r'(\d)\.(\d\d) €',r'\1,\2 €',clean(m[0]) if m else clean(price))
# Rechner und Preisübersicht lesen dieselbe Tabelle wie /preise/, damit nichts auseinanderläuft.
price_rows={}
for row in re.findall(r'<tr>(.*?)</tr>',table,re.S):
 cells=[' '.join(re.sub(r'<[^>]+>',' ',c).split()) for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',row,re.S)]
 if len(cells)==5:price_rows[cells[0]]=cells[1:]
def price_number(value):
 if value=='inklusive':return 0
 found=re.match(r'([\d.,]+)',value)
 return float(found[1].replace('.','').replace(',','.')) if found else None
def rent_html(value):
 amount,sep,unit=value.partition(' / ')
 return f'{amount} <small>/ {unit}</small>' if sep else amount
tier_limits=[10000,30000,80000,None]
price_tiers=[{'limit':tier_limits[i],'rent':price_number(price_rows['Shopmiete'][i]),'rate':price_number(price_rows['Umsatzprovision'][i]),'ssl':price_number(price_rows['SSL-Leitung'][i])} for i in range(4)]
tier_cards=''.join(f'<div class="tier" data-tier="{i}"><h3>{price_rows["Ihr Umsatz / Monat"][i]}</h3><p class="tier-rent">{rent_html(price_rows["Shopmiete"][i])}</p><dl><dt>Umsatzprovision</dt><dd>{price_rows["Umsatzprovision"][i]}</dd><dt>SSL-Leitung</dt><dd>{price_rows["SSL-Leitung"][i]}</dd></dl></div>' for i in range(4))
included=''.join(f'<li>{name}</li>' for name,values in price_rows.items() if all(v=='inklusive' for v in values))
def price_calculator():
 return f'''<section class="calculator-section" id="rechner" aria-labelledby="rechner-titel"><div class="wrap"><div class="section-title reveal"><h2 id="rechner-titel">Was würde Ihr Shop kosten?</h2><p>Schieben Sie den Regler auf Ihren Monatsumsatz.</p></div><div class="calculator reveal" data-calculator='{json.dumps(price_tiers)}' hidden><div class="calc-input"><label for="umsatz">Ihr Umsatz im Monat</label><output id="umsatz-wert" for="umsatz">5.000 €</output><input id="umsatz" type="range" min="0" max="100000" step="1000" value="5000"><div class="calc-scale" aria-hidden="true"><span>0 €</span><span>100.000 €</span></div></div><div class="calc-result" aria-live="polite"><p class="calc-label">Kosten im Monat, Beispielrechnung</p><p class="calc-total" id="calc-total"></p><dl id="calc-parts"></dl></div></div><div class="tiers reveal">{tier_cards}</div><ul class="included reveal"><li>In jeder Stufe enthalten:</li>{included}</ul><p class="fine">Unverbindliche Beispielrechnung für Bestellungen aus Ihrem eigenen Shop, zuzüglich gesetzlicher Mehrwertsteuer. Für externe und manuelle Bestellungen gilt eine eigene Provision.</p></div></section>'''
# Nur Ansichten ohne Amazon-Reiter verwenden: Amazon wird vorerst nicht öffentlich erklärt.
tour_views=[('bestellungen','Bestellungen','verkaufsmanager','Verkaufsmanager mit einer fiktiven Bestellung','Alle Angaben zu einer Bestellung auf einer Seite.'),('bestand','Bestand','bestanduebersicht','Bestandübersicht mit fiktiven Demoartikeln und Varianten','Lagerbestand je Artikel und Variante auf einen Blick.'),('artikel','Artikel','artikelliste','Artikelliste mit fiktiven Demoprodukten','Artikel nach Kategorie, Lieferant oder Hersteller filtern.'),('kunden','Kunden','kundenliste','Kundenliste mit fiktiven Beispielkunden','Kunden schnell finden.')]
tour_tabs=''.join(f'<button type="button" role="tab" id="tab-{k}" aria-controls="ansicht-{k}" aria-selected="{"true" if i==0 else "false"}">{label}</button>' for i,(k,label,_,_,_) in enumerate(tour_views))
tour_panels=''.join(f'<div class="tour-panel" role="tabpanel" id="ansicht-{k}" aria-labelledby="tab-{k}"><img class="screen tour-desktop" src="/assets/help/{shot}-desktop.jpg" alt="{alt}" width="1265" height="540" loading="lazy"><div class="phone{" pixel" if i%2 else ""}"><img src="/assets/help/{shot}-mobile.jpg" alt="{label} auf dem Smartphone mit fiktiven Daten" width="390" height="844" loading="lazy"></div><p class="tour-caption">{text}</p></div>' for i,(k,label,shot,alt,text) in enumerate(tour_views))
def frog(image,alt,cls=''):return f'<span class="frog {image} {cls}"><img src="/assets/brand/{image}.jpg" alt="{alt}" width="780" height="204" loading="lazy"></span>'
ki_frog='<span class="frog-flip">'+frog('v_updates','Der simplecommerce-Frosch läuft voran')+'</span>'
offers=[('Shopsystem','Ein individuell gestalteter Onlineshop und eine Verwaltung für die tägliche Arbeit.','/shopsystem/',f'<span class="service-media">{frog("v_warenwirtschaft","Der simplecommerce-Frosch an einem Rechenrahmen")}</span>')]
offer_frogs={'Webseiten':('v_shop_cms','Der simplecommerce-Frosch als Nahaufnahme'),'IT-Beratung':('v_sicherheit','Der simplecommerce-Frosch sitzt in einer Hand'),'IT-Projekte':('v_updates','Der simplecommerce-Frosch in Bewegung'),'Service':('v_bedienung','Der simplecommerce-Frosch auf einem Stein')}
offers+=[(t,d,u,f'<span class="service-media">{ki_frog if t=="KI-Anwendungen" else frog(*offer_frogs[t])}</span>') for t,d,u in services]
offer_cards=''.join(card(*o) for o in offers)
def slider(cards,label):return f'<div class="slider" data-slider><div class="slider-track" tabindex="0" role="region" aria-label="{label}">{cards}</div><div class="wrap slider-bar" hidden><div class="slider-progress"><span></span></div><div class="slider-buttons"><button type="button" class="slider-button" data-step="-1" aria-label="Vorherige Leistung"></button><button type="button" class="slider-button" data-step="1" aria-label="Nächste Leistung"></button></div></div></div>'
hero='<div class="hero hero-home"><div class="wrap hero-intro hero-copy"><h1>Gute Ideen.<br>Starke Technik.<br>Einfach Ihr Ding.</h1><div><p class="lead">Shops, die verkaufen. Websites, die zu Ihnen passen. Software, die Arbeit leichter macht. KI, die wirklich hilft.</p><div class="actions"><a class="button" href="/kontakt/">Ihr Projekt besprechen</a><a class="text-link" href="/leistungen/">Unsere Leistungen entdecken</a></div></div></div>'+slider(offer_cards,'Unsere Leistungen')+'</div>'
questions=[('Wo fange ich an?','Mit einem Gespräch. Wir sortieren gemeinsam, was Sie wirklich brauchen.','/kontakt/','Gespräch vereinbaren'),('Was kostet das?','Shops haben feste Preise. Alles andere bekommt ein individuelles Angebot.','/preise/','Shop-Preise ansehen'),('Muss ich die Technik verstehen?','Nein. Wir erklären verständlich und kümmern uns um die Umsetzung.','/it-beratung/','Zur IT-Beratung'),('Sind Sie nach dem Start noch da?','Ja. Wir unterstützen Sie auch bei den nächsten Aufgaben im Betrieb.','/service/','Zum Service')]
question_cards=''.join(f'<a class="question reveal" href="{u}"><h3>{q}</h3><p>{a}</p><span class="more">{l}</span></a>' for q,a,u,l in questions)
steps=f'<section class="wrap section steps-section" data-steps data-guide="So arbeiten wir zusammen."><div class="section-title reveal"><h2>Persönlich. Verständlich. Schritt für Schritt.</h2></div><div class="steps-frog" aria-hidden="true">{frog("v_updates","Der Frosch hüpft zum nächsten Schritt")}</div><ol class="steps"><li class="reveal"><h3>Verstehen</h3><p>Wir besprechen Ihr Vorhaben, Ihre Abläufe und die Menschen, die damit arbeiten.</p></li><li class="reveal"><h3>Umsetzen</h3><p>Aus Anforderungen werden nachvollziehbare Schritte und eine passende technische Lösung.</p></li><li class="reveal"><h3>Begleiten</h3><p>Wir unterstützen Sie beim Start und bei den nächsten Aufgaben im Betrieb.</p></li></ol></section>'
tour=f'<section class="tour-section" id="einblick" aria-labelledby="einblick-titel" data-guide="Das ist die echte Verwaltung. Probieren Sie die Reiter aus."><div class="wrap"><div class="section-title reveal"><h2 id="einblick-titel">Ihr Handel. Ein guter Überblick.</h2><p>Produkte, Bestellungen und Kunden an einem Ort. Echte Ansichten mit fiktiven Demodaten.</p></div><div data-tour class="reveal"><div class="tour-tabs" role="tablist" aria-label="Ansichten der Shopverwaltung" hidden>{tour_tabs}</div>{tour_panels}</div><div class="actions reveal"><a class="button" href="/shopsystem/">Das Shopsystem kennenlernen</a><a class="text-link" href="/preise/#rechner">Shop-Preis berechnen</a></div></div></section>'
faq_items=[('Was kann KI für mein Unternehmen tun?','Zum Beispiel Texte erstellen, Anfragen vorsortieren oder Daten auswerten. Auf Wunsch trainieren wir auch ein eigenes Modell. Mehr dazu unter <a href="/ki-anwendungen/">KI-Anwendungen</a>.'),('Erstellen Sie auch Websites ohne Shop?','Ja. <a href="/webseiten/">Webseiten</a> sind eine eigene Leistung, klar aufgebaut und auf jedem Bildschirm nutzbar.'),('Können Sie bestehende Software weiterentwickeln?','Ja. Wir prüfen vorhandene Anwendungen und planen sinnvolle Erweiterungen oder eine schrittweise Modernisierung.'),('Was kostet eine Website oder ein IT-Projekt?','Das hängt vom Vorhaben ab. Wir besprechen die Anforderungen und erstellen ein individuelles Angebot.'),('Was kostet ein Onlineshop?','Das hängt von Ihrem Umsatz ab. Die <a href="/preise/">Shop-Preise</a> zeigen alle Stufen und einen Rechner.'),('Wie erreiche ich Sie?','Per <a href="/kontakt/">Kontaktformular</a>, unter <a href="mailto:info@simplecommerce.de">info@simplecommerce.de</a> oder unter <a href="tel:+4915127036178">+49 151 270 36 178</a>.')]
def faq_list(items):return '<div class="faq reveal">'+''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q,a in items)+'</div>'
# Kurze Fragen und ausführliche Antworten stehen gemeinsam in einem Abschnitt.
faq='<section class="question-section" data-guide="Die häufigsten Fragen, kurz beantwortet."><div class="wrap section"><div class="section-title reveal"><h2>Gut zu wissen</h2><p>Was die meisten zuerst fragen. Kurz beantwortet.</p></div><div class="questions">'+question_cards+'</div>'+faq_list(faq_items)+'</div></section>'
contact_band=f'<section class="wrap contact-band reveal" data-guide="Schön, dass Sie bis hier gekommen sind. Sprechen wir?"><div><h2>Eine Idee ist ein guter Anfang.</h2><p>Ein neuer Shop, eine Website oder ein Prozess, der einfacher werden soll.</p><div class="actions"><a class="button" href="/kontakt/">Projekt besprechen</a><a class="text-link" href="tel:+4915127036178">+49 151 270 36 178</a></div></div><span data-hop>{frog("v_shop_cms","Der simplecommerce-Frosch schaut neugierig")}</span></section>'
page('/','Shops, Webseiten & IT-Beratung','simplecommerce aus Bispingen: Shopsystem, Webseitenerstellung, IT-Beratung, individuelle Software, KI-Anwendungen und persönlicher Service.',hero+steps+tour+faq+contact_band)
page('/leistungen/','Leistungen für Ihr digitales Unternehmen','Webseitenerstellung, IT-Beratung, individuelle Software und Service von simplecommerce.',intro('UNSERE LEISTUNGEN','Gute Technik beginnt<br>bei Ihrer Aufgabe.','Ob Shop, Website, Beratung, KI oder individuelle Software: Wir richten die Umsetzung an Ihrem Unternehmen aus.')+f'<section class="services wrap">{offer_cards}</section>'+cta())
texts={
'webseiten':('Webseitenerstellung','Ein Auftritt,<br>der zu Ihnen passt.','Wir erstellen Websites, die Ihr Angebot klar vermitteln und Besucher zum passenden nächsten Schritt führen.',['Konzept und Inhalte|Wir strukturieren Ihre Leistungen, Zielgruppen und Kontaktwege. So finden Besucher schnell, was sie suchen.','Gestaltung für alle Bildschirme|Ihre Website funktioniert auf Smartphone, Tablet und Desktop. Lesbarkeit und einfache Bedienung stehen im Mittelpunkt.','Technisch schlank|Für Unternehmenswebsites setzen wir auf eine passende, wartbare Lösung. Ein CMS kommt dort zum Einsatz, wo Sie es tatsächlich benötigen.','Auffindbar und verständlich|Saubere Seitenstruktur, klare Texte, Metadaten und strukturierte Informationen unterstützen Suchmaschinen und KI-gestützte Suche.']),
'it-beratung':('Professionelle IT-Beratung','Klarheit für Ihre<br>nächste Entscheidung.','Wir helfen Ihnen, Anforderungen zu ordnen, technische Möglichkeiten einzuschätzen und einen umsetzbaren Weg zu finden.',['Bestand verstehen|Welche Systeme nutzen Sie? Wo entstehen doppelte Arbeit, Medienbrüche oder unnötige Abhängigkeiten?','Lösungen vergleichen|Wir betrachten passende technische Ansätze und besprechen Nutzen, Aufwand und Grenzen.','Umsetzung planen|Aus der Empfehlung entsteht eine nachvollziehbare Reihenfolge mit klaren Aufgaben.','Projekte begleiten|Bei Bedarf unterstützen wir die Umsetzung und den Austausch mit beteiligten Dienstleistern.']),
'it-projekte':('IT-Projekte & individuelle Software','Software für Ihre Abläufe.<br>Nicht umgekehrt.','Wir entwickeln individuelle Lösungen, verbinden Systeme und vereinfachen wiederkehrende Aufgaben.',['Schnittstellen|Wir verbinden Shop, Datenquellen und bestehende Anwendungen über geeignete Schnittstellen.','Automatisierung|Wiederkehrende Arbeitsschritte lassen sich gezielt vereinfachen – von Datenübernahmen bis zu internen Prozessen.','Individuelle Anwendungen|Wenn Standardsoftware nicht ausreicht, entwickeln wir eine Lösung für Ihre konkrete Aufgabe.','Bestehendes weiterentwickeln|Wir prüfen vorhandene Anwendungen und planen sinnvolle Erweiterungen oder eine schrittweise Modernisierung.']),
'ki-anwendungen':('KI-Anwendungen','KI, die wirklich<br>für Sie arbeitet.','Wir bauen KI-Anwendungen für Ihren Alltag und trainieren auf Wunsch ein eigenes Modell. Einfach erklärt, ohne Fachchinesisch.',['KI im Alltag|Texte erstellen, Anfragen vorsortieren, Daten auswerten: Wir finden heraus, wo KI Ihnen wirklich Arbeit abnimmt.','Ihr eigenes KI-Modell|Wir trainieren ein Modell mit Ihren Daten. So kennt es Ihre Produkte, Ihre Begriffe und Ihre Abläufe.','Dort, wo Sie arbeiten|Wir binden die KI in Ihren Shop, Ihre Website oder Ihre Software ein. Sie müssen dafür nichts Neues lernen.','Klein anfangen|Wir starten mit einer konkreten Aufgabe und prüfen gemeinsam, ob sie sich lohnt. Erst dann geht es weiter.']),
'service':('Service & Unterstützung','Nach dem Start<br>geht es weiter.','Persönliche Unterstützung für Fragen, Änderungen und den laufenden Betrieb Ihrer digitalen Lösung.',['Shop-Unterstützung|Wir helfen bei Fragen zu Artikeln, Bestellungen, Einstellungen und den täglichen Abläufen.','Pflege und Weiterentwicklung|Neue Inhalte, technische Anpassungen und zusätzliche Funktionen planen wir passend zu Ihrem Bedarf.','Einweisung|Wir erklären die benötigten Funktionen verständlich. Die Online-Hilfe unterstützt Sie auch danach.','Persönlicher Kontakt|Beschreiben Sie uns Ihre Aufgabe per E-Mail oder Kontaktformular. Wir besprechen die nächsten Schritte mit Ihnen.'])}
# Ausführliche Leistungsseiten: Inhalte aus content/service-details.json, Darstellung mit vorhandenen Bausteinen.
service_details=json.loads((ROOT/'content/service-details.json').read_text())
def service_detail(slug):
 d=service_details[slug]
 fit='<section class="wrap fit-section reveal"><h2>Passt zu Ihnen, wenn …</h2><ul class="fit-list">'+''.join(f'<li>{escape(x)}</li>' for x in d['passt'])+'</ul></section>'
 flow='<section class="wrap section steps-section"><div class="section-title reveal"><h2>So läuft es ab</h2></div><ol class="steps">'+''.join(f'<li class="reveal"><h3>{escape(h)}</h3><p>{escape(p)}</p></li>' for h,p in d['ablauf'])+'</ol></section>'
 return fit+flow+'<section class="wrap faq-section"><div class="section-title reveal"><h2>Häufige Fragen</h2></div>'+faq_list(d['fragen'])+'</section>'
def related_services(slug):return '<section class="wrap section related-section"><div class="section-title reveal"><h2>Das passt auch dazu</h2></div><div class="services">'+''.join(card(*o) for o in offers if o[2] in service_details[slug]['verwandt'])+'</div></section>'
def brand_motif(slug):
 motifs={'webseiten':('v_shop_cms','Ideen brauchen einen eigenen Auftritt.','Der simplecommerce-Frosch als Nahaufnahme'),'it-beratung':('v_sicherheit','Gut beraten. Persönlich begleitet.','Der simplecommerce-Frosch sitzt in einer Hand'),'it-projekte':('v_updates','Bereit für den nächsten Schritt.','Der simplecommerce-Frosch in Bewegung'),'ki-anwendungen':('v_updates','Einfach schlauer arbeiten.','Der simplecommerce-Frosch läuft los'),'service':('v_bedienung','Wir bleiben an Ihrer Seite.','Der simplecommerce-Frosch auf einem Stein'),'sicherheit':('v_sicherheit','Vertrauen braucht eine solide Grundlage.','Der simplecommerce-Frosch in einer Hand'),'warenwirtschaft':('v_warenwirtschaft','Viele Verkaufskanäle. Ein klarer Überblick.','Der simplecommerce-Frosch an einem Rechenrahmen')}
 if slug not in motifs:return ''
 image,caption,alt=motifs[slug]
 return f'<aside class="brand-motif wrap"><div><p class="motif-caption">{caption}</p></div><div class="motif-crop {image}"><img src="/assets/brand/{image}.jpg" alt="{alt}" width="780" height="204" loading="lazy"></div></aside>'
for slug,(title,h1,desc,sections) in texts.items():
 body=intro('LEISTUNGEN / '+title.upper(),h1,desc)+brand_motif(slug)+'<section class="wrap service-content">'
 for i,s in enumerate(sections,1):h,p=s.split('|');body+=f'<article class="reveal"><h2>{h}</h2><p>{p}</p></article>'
 body+='</section>'+service_detail(slug)+'<section class="wrap note"><h2>Was kostet das?</h2><p>Umfang und Aufwand hängen von Ihrem Vorhaben ab. Wir besprechen die Anforderungen und erstellen ein individuelles Angebot.</p><a href="/kontakt/">Individuelles Angebot anfragen →</a></section>'+related_services(slug)+cta()
 page('/'+slug+'/',title,desc,body,kind='WebPage')
shop_pages=[p for p in pages if p['post_parent']=='727' and p['ID']!='10']+[byid[i] for i in ['32','34','38','52','72','76','80','84','370']]
# Jede Themenseite erscheint genau einmal; die Prüfung verhindert, dass beim Umbau Links verloren gehen.
shop_groups=[
 ('Verkaufen und abwickeln','verkaufsmanager','Verkaufsmanager mit einer fiktiven Bestellung',[('50','Bestellungen bearbeiten, Rechnungen und Lieferscheine erstellen.'),('84','Warenbestände steuern und verwalten.'),('72','Verkäufe und Mengen auswerten.'),('34','Daten mit Plattformen und Buchhaltung austauschen.')]),
 ('Präsentieren','startseite-artikel','Auswahl der Startseitenprodukte mit fiktiven Demoartikeln',[('62','Bestimmen, was Ihre Kunden zuerst sehen.'),('56','Kunden gestalten Artikel über Attribute selbst.'),('32','Ein Layout nach Ihrem Corporate Design.'),('166','Eigene Seiten und Formulare ohne HTML-Kenntnisse.')])]
shop_duo=[
 ('Wachsen und anpassen',[('54','Mehrere Shops auf einer Warenwirtschaft.'),('755','Struktur und Produkte aus Ihrem bisherigen System übernehmen.'),('370','Erweiterungen für besondere Anforderungen.'),('38','Arbeitsfenster für den Alltag.')]),
 ('Betrieb',[('52','Betreute Server, im Preis enthalten.'),('80','Neue Funktionen werden zentral bereitgestellt.'),('76','So sichern wir Shops ab.')])]
listed={i for g in shop_groups for i,_ in g[3]}|{i for g in shop_duo for i,_ in g[1]}
assert listed=={p['ID'] for p in shop_pages},'Shopseite: Themenliste und Seitenbestand weichen ab'
def feature_list(items):return '<ul class="feature-list">'+''.join(f'<li><a href="{paths[i]}"><strong>{escape(byid[i]["post_title"])}</strong><span>{text}</span></a></li>' for i,text in items)+'</ul>'
shop_body='<div class="hero hero-small"><div class="wrap hero-grid"><div class="hero-copy"><h1>Alles für Ihren Shop, an einem Ort.</h1><p class="lead">Ein individuell gestalteter Onlineshop und eine Verwaltung für die tägliche Arbeit.</p><div class="actions"><a class="button" href="/preise/">Preise ansehen</a><a class="text-link" href="/kontakt/">Shop anfragen</a></div></div><span class="hero-frog" data-hop>'+frog('v_warenwirtschaft','Der simplecommerce-Frosch an einem Rechenrahmen')+'</span></div></div><div class="wrap">'
shop_body+=''.join(f'<section class="feature-group reveal"><img class="screen" src="/assets/help/{shot}-desktop.jpg" alt="{alt}" width="1265" height="540" loading="lazy"><div><h2>{title}</h2>{feature_list(items)}</div></section>' for title,shot,alt,items in shop_groups)
shop_body+='<div class="feature-duo">'+''.join(f'<section class="reveal"><h2>{title}</h2>{feature_list(items)}</section>' for title,items in shop_duo)+'</div></div>'
shop_body+='<section class="mobile-admin"><div class="wrap reveal"><div><h2>Auch auf dem Smartphone</h2><p class="lead">Bestellung prüfen, Artikel finden: Die Verwaltung passt sich kleinen Bildschirmen an.</p><a class="text-link" href="/hilfe/">Online-Hilfe öffnen</a></div><div class="mobile-phones"><div class="phone"><img src="/assets/help/verkauf-bestelldetails-mobile.jpg" alt="Bestelldetails auf dem Smartphone mit fiktiver Bestellung" width="390" height="844" loading="lazy"></div><div class="phone pixel"><img src="/assets/help/artikelliste-mobile.jpg" alt="Artikelliste auf dem Smartphone mit fiktiven Demoprodukten" width="390" height="844" loading="lazy"></div></div></div></section>'
page('/shopsystem/','Shopsystem für Ihren Onlinehandel','simplecommerce Shopsystem: Produkte, Bestellungen, Kunden und Inhalte verwalten. Individuelles Design, Schnittstellen und mobile Verwaltung.',shop_body+cta('Passt das zu Ihrem Shop?','Wir schauen uns das gemeinsam an.','Shop anfragen'))
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
 if slug in ['impressum','datenschutz']:
  content=(ROOT/'content/legal'/f'{slug}.html').read_text()
  desc='Anbieterkennzeichnung und Kontaktdaten der simplecommerce GmbH.' if slug=='impressum' else 'Informationen zur Verarbeitung personenbezogener Daten auf unserer Website und bei Kontaktanfragen.'
  page(path,title,desc,intro('RECHTLICHES',title,desc)+'<article class="prose wrap narrow">'+content+'</article>');continue
 desc=f'{title} bei simplecommerce: Informationen und Möglichkeiten für Ihren Onlineshop.'
 # Reste der alten WordPress-Unternavigation (Linkketten ohne Text) entfernen.
 content=re.sub(r'(?:<a [^>]*>[^<]*</a>\s*\|?\s*){5,}','',content)
 topic_side='<aside class="topic-side"><h2>Weitere Themen</h2>'+links([(x['post_title'],paths[x['ID']]) for x in shop_pages if x['ID']!=p['ID']])+'<a class="button" href="/preise/">Preise ansehen</a></aside>' if p in shop_pages else ''
 page(path,title,desc,intro('SIMPLECOMMERCE',title,desc)+brand_motif(slug)+(f'<div class="wrap topic-layout"><article class="prose">{content}</article>{topic_side}</div>' if topic_side else '<article class="prose wrap narrow">'+content+'</article>')+cta())
help_groups=[('Produkte',['Artikel anlegen','Produkt-Schnellstart','Artikelliste','Artikel Attribute','Bestandübersicht','Kategorien','Hersteller']),('Verkauf und Kunden',['Verkaufsmanager','Kundenliste','Gutscheine','Rabattsystem','Versand','Zahlungsarten','Länder','Währungen']),('Shop einrichten',['Shopdaten','Benutzer verwalten und anlegen','Sprachen','Dokumentvorlagen','Emailvorlagen']),('Inhalte und Marketing',['Startseite','Eigene Seiten & Shop CMS','Boxen anlegen und verwalten','Google Export','Begriffe und HTML-Editor'])]
help_by_title={p['post_title']:p for p in help_pages}
assert sorted(t for _,ts in help_groups for t in ts)==sorted(help_by_title),'Hilfe: Gruppen und Seitenbestand weichen ab'
help_grid=''.join(f'<section class="help-group reveal" data-help-group><h2>{name}</h2><div class="topic-grid">'+''.join(f'<a href="{paths[help_by_title[t]["ID"]]}" data-topic="{escape(t.lower())}">{escape(t)}</a>' for t in titles)+'</div></section>' for name,titles in help_groups)
page('/hilfe/','Online-Hilfe zur Shopverwaltung','Anleitungen zu Produkten, Bestellungen, Kunden und Einstellungen in simplecommerce. Finden Sie das passende Thema für Ihre Shopverwaltung.',intro('SIMPLECOMMERCE HELPCENTER','Eine Frage?<br>Hier geht’s weiter.','Anleitungen für Ihre tägliche Arbeit, vom ersten Artikel bis zur Bestellabwicklung.')+'<section class="wrap help-search"><label for="hilfe-suche">Hilfethema suchen</label><input id="hilfe-suche" type="search" placeholder="Zum Beispiel Artikel, Versand oder Kunden" autocomplete="off"><p id="suchstatus" role="status" aria-live="polite"></p><div id="help-topics">'+help_grid+'</div></section>'+cta('Nichts Passendes gefunden?','Wir helfen Ihnen persönlich weiter.','Kontakt aufnehmen'))
page('/preise/','Shop-Preise – Miete und Umsatzprovision','Preise für das simplecommerce Shopsystem: Shopmiete, Umsatzprovision, Einrichtung und Gestaltung im Überblick.',intro('SHOPSYSTEM / PREISE','Die Preise für<br>Ihr Shopsystem.','Shopmiete und Umsatzprovision richten sich nach Ihrem Umsatz im Monat.')+price_calculator()+'<section class="wrap section"><div class="section-title reveal"><h2>Alle Preise im Detail</h2></div><div class="table-scroll reveal" tabindex="0" role="region" aria-label="Shoppreise nach Umsatzstufe">'+table+'</div><div class="price-extras"><div class="reveal"><h3>Einrichtung & Gestaltung</h3><p>Template-Anpassung: 499,00 € einmalig.<br>Template nach Vorlage: 990,00 € einmalig.<br>Artikeldaten übernehmen: 150,00 € pauschal.<br>Einweisung: 500,00 € Tagespauschale zuzüglich Anfahrt und Übernachtung.</p><a class="text-link" href="/design-und-layout/">Details zu Design & Layout</a></div><div class="reveal"><h3>Fragen zu Ihrem Shop?</h3><p>Wir besprechen die passende Umsatzstufe, die Einrichtung und individuelle Erweiterungen.</p><a class="text-link" href="/kontakt/">Shop-Angebot anfragen</a></div></div></section>'+cta('Bereit für Ihren Shop?','Wir besprechen die nächsten Schritte persönlich.','Shop anfragen'))
form='''<form action="/kontakt/senden.php" method="post" class="contact-form"><h2>Erzählen Sie uns von Ihrem Vorhaben.</h2><label for="name">Ihr Name</label><input id="name" name="name" autocomplete="name" maxlength="120" required><label for="email">E-Mail-Adresse</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required><label for="thema">Worum geht es?</label><select id="thema" name="thema"><option>Shopsystem</option><option>Webseitenerstellung</option><option>IT-Beratung</option><option>IT-Projekt</option><option>KI-Anwendungen</option><option>Service</option><option>Sonstiges</option></select><label for="nachricht">Ihre Nachricht</label><textarea id="nachricht" name="nachricht" rows="7" minlength="10" maxlength="10000" required></textarea><div class="honeypot" aria-hidden="true"><label for="website">Bitte leer lassen</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="fine">Wir verwenden Ihre Angaben, um Ihre Anfrage zu bearbeiten. Weitere Informationen finden Sie in unserer <a href="/datenschutz/">Datenschutzerklärung</a>.</p><button class="button" type="submit">Anfrage senden</button></form>'''
page('/kontakt/','Kontakt – Ihr Projekt mit simplecommerce','Kontaktieren Sie simplecommerce in Bispingen: info@simplecommerce.de, +49 151 270 36 178 oder über das Kontaktformular.',intro('KONTAKT','Lassen Sie uns<br>darüber sprechen.','Sie planen etwas Neues oder benötigen Unterstützung? Schreiben Sie uns kurz.')+'<section class="wrap contact-grid"><div class="reveal"><h2>Direkt zu uns.</h2><a class="contact-link" href="mailto:info@simplecommerce.de">info@simplecommerce.de</a><a class="contact-link" href="tel:+4915127036178">+49 151 270 36 178</a><p>simplecommerce GmbH<br>Vor den Höfen 20a<br>29646 Bispingen</p><h3>Telefonische Erreichbarkeit</h3><p>Montag–Donnerstag: 11:00–16:30 Uhr<br>Freitag: 11:00–14:30 Uhr</p><p>Eine Frage zur Shopverwaltung?<br><a class="text-link" href="/hilfe/">Zur Online-Hilfe</a></p><span class="contact-frog" data-hop>'+frog('v_bedienung','Der simplecommerce-Frosch sitzt auf einem Stein')+'</span></div>'+form+'</section>')
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

build_redirects(ROOT)
