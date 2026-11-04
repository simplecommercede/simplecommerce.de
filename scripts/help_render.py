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
            body+='<div class="shot-pair">'
            body+=f'<figure><a href="{shot["desktop"]}"><img class="desktop-shot" src="{shot["desktop"]}" alt="{title} – Desktop mit neutralen Beispieldaten" loading="lazy" width="1280" height="720"></a><figcaption>{title} · Desktop. Zum Vergrößern anklicken.</figcaption></figure>'
            frame='pixel' if sum(map(ord,key))%2 else ''
            body+=f'<figure><a class="phone {frame}" href="{shot["mobile"]}"><img src="{shot["mobile"]}" alt="{title} – Smartphoneansicht" loading="lazy" width="390" height="844"></a><figcaption>Smartphone · 390 Pixel breite Ansicht im illustrativen Geräterahmen.</figcaption></figure></div>'
        body+='</section>'
    return body+'<p class="fine">Die Abbildungen zeigen fiktive Produkte, Personen und Bestellungen eines separaten Demoshops. Sichtbare Bereiche richten sich nach Benutzerrechten und Shopkonfiguration.</p><p><a href="#inhalt">↑ Zum Anfang</a> · <a href="/hilfe/">Alle Hilfethemen</a> · <a href="/kontakt/">Unterstützung anfragen</a></p>'
