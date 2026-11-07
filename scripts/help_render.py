"""Render maintained help sections and their documented screenshot pairs."""
from html import escape

def render_help(meta, sections, shots):
    toc='<nav class="help-toc" aria-label="Inhaltsverzeichnis"><h2>In dieser Anleitung</h2><ol>'+''.join(f'<li><a href="#{escape(s["id"])}">{escape(s["title"])}</a></li>' for s in sections)+'</ol></nav>'
    body=f'<p class="eyebrow">SHOPVERWALTUNG · STAND {escape(meta["reviewed"])}</p><p><strong>Menüweg:</strong> {escape(meta["navigation"])}</p>'+toc
    for section in sections:
        body+=f'<section class="help-section" id="{escape(section["id"])}"><h2>{escape(section["title"])}</h2>'+section['html']
        for i,key in enumerate(section.get('shots',[])):
            shot=shots[key]
            title=escape(shot.get('title',section['title']))
            desktop_size=shot.get('desktop_size',{'width':1280,'height':720})
            mobile_size=shot.get('mobile_size',{'width':390,'height':844})
            body+='<div class="shot-pair">'
            body+=f'<figure><a href="{shot["desktop"]}"><img class="desktop-shot" src="{shot["desktop"]}" alt="{title} – Desktop mit neutralen Beispieldaten" loading="lazy" width="{desktop_size["width"]}" height="{desktop_size["height"]}"></a><figcaption>{title} · Desktop. Zum Vergrößern anklicken.</figcaption></figure>'
            frame='pixel' if sum(map(ord,key))%2 else ''
            body+=f'<figure><a class="phone {frame}" href="{shot["mobile"]}"><img src="{shot["mobile"]}" alt="{title} – Smartphoneansicht" loading="lazy" width="{mobile_size["width"]}" height="{mobile_size["height"]}"></a><figcaption>Smartphone · {mobile_size["width"]} Pixel breite Ansicht im illustrativen Geräterahmen.</figcaption></figure></div>'
        body+='</section>'
    return body+'<p class="fine">Die Abbildungen zeigen fiktive Produkte, Personen und Bestellungen eines separaten Demoshops. Sichtbare Bereiche richten sich nach Benutzerrechten und Shopkonfiguration.</p><p><a href="#inhalt">↑ Zum Anfang</a> · <a href="/hilfe/">Alle Hilfethemen</a> · <a href="/kontakt/">Unterstützung anfragen</a></p>'
