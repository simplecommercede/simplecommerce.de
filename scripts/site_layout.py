"""Seitenrahmen der Website: Kopf, Navigation, Fuß und kleine HTML-Bausteine."""
import re
from html import escape
import json

BASE_URL = 'https://simplecommerce.de'
COMPANY = 'simplecommerce GmbH'
STREET = 'Vor den Höfen 20a'
POSTAL_CODE = '29646'
CITY = 'Bispingen'
EMAIL = 'projekt@simplecommerce.de'
PHONE_DISPLAY = '+49 151 270 36 178'
PHONE_E164 = '+4915127036178'
PHONE_URL = f'tel:{PHONE_E164}'
EMAIL_URL = f'mailto:{EMAIL}'
ADDRESS_HTML = f'{STREET}<br>{POSTAL_CODE} {CITY}'

STYLESHEETS = ('site', 'guide')
SCRIPTS = (
    'site', 'guide-data', 'guide-core', 'guide-price', 'guide-glass',
    'guide-steps', 'guide-form', 'guide-search', 'guide',
)

NAV = (('Shop', '/shopsystem/'), ('Leistungen', '/leistungen/'), ('Kontakt', '/kontakt/'))
NAV_SUB = {
    '/shopsystem/': (
        ('Überblick', '/shopsystem/'),
        ('Shop-Preise', '/preise/'),
        ('Leistungsmerkmale', '/leistungsmerkmale/'),
        ('Shop wechseln', '/shopsystem/shop-wechseln/'),
    ),
    '/leistungen/': (
        ('Webseiten', '/webseiten/'),
        ('IT-Beratung', '/it-beratung/'),
        ('IT-Projekte', '/it-projekte/'),
        ('KI-Anwendungen', '/ki-anwendungen/'),
        ('Service', '/service/'),
        ('Preisrechner', '/preisrechner/'),
    ),
}
FOOTER_SERVICES = (
    ('Shopsystem', '/shopsystem/'),
    ('Webseiten', '/webseiten/'),
    ('IT-Beratung', '/it-beratung/'),
    ('IT-Projekte', '/it-projekte/'),
    ('KI-Anwendungen', '/ki-anwendungen/'),
    ('Service', '/service/'),
)
FOOTER_INFO = (
    ('Shop-Preise', '/preise/'),
    ('Preisrechner', '/preisrechner/'),
    ('Vertriebspartner', '/vertriebspartner/'),
    ('Kontakt', '/kontakt/'),
)

# Interaktives Logo: Ebenen über assets/logo.jpg, Gestaltung in site.css, Verhalten in site.js.
LID_STYLE = 'rx="6.2" ry="8.6" fill="#57c22f" stroke="#3f9a22" stroke-width=".6"'
LOGO_FACE = (
    '<svg class="logo-face" viewBox="0 0 309 78" aria-hidden="true" focusable="false">'
    '<defs><radialGradient id="logo-throat-g">'
    '<stop offset="0" stop-color="#fff"/>'
    '<stop offset=".65" stop-color="#f6f3f0"/>'
    '<stop offset="1" stop-color="#f6f3f0" stop-opacity="0"/>'
    '</radialGradient></defs>'
    '<ellipse class="logo-throat" cx="58" cy="41" rx="20" ry="14" fill="url(#logo-throat-g)"/>'
    '<g class="logo-mouth">'
    '<path d="M37 27 Q58 30 79 27 Q58 42 37 27Z" fill="#6e1b2a"/>'
    '<ellipse cx="58" cy="31.5" rx="9" ry="3" fill="#e8658a"/>'
    '</g>'
    f'<ellipse class="logo-lid" cx="37.5" cy="15.5" {LID_STYLE}/>'
    f'<ellipse class="logo-lid" cx="78" cy="15" {LID_STYLE}/>'
    '</svg>'
)
TONGUE_PATH = 'd="M58 31 C78 46 96 8 128 8 S172 4 177 29" pathLength="1"'
LOGO_REACH = (
    '<svg class="logo-reach" viewBox="0 0 309 78" aria-hidden="true" focusable="false">'
    '<g class="logo-tongue" fill="none" stroke-linecap="round">'
    f'<path {TONGUE_PATH} stroke="#b5305a" stroke-width="5.4"/>'
    f'<path {TONGUE_PATH} stroke="#ee6a90" stroke-width="3.8"/>'
    f'<path {TONGUE_PATH} stroke="#ffc4d6" stroke-width="1"/>'
    '</g>'
    '<g class="logo-tip"><g class="logo-blob">'
    '<ellipse rx="6.4" ry="5.4" fill="#f0517f" stroke="#b5305a" stroke-width=".9"/>'
    '<circle cx="-1.8" cy="-1.9" r="1.5" fill="#ffe0ea"/>'
    '<circle cx="2.2" cy="1.4" r=".7" fill="#ffc4d6"/>'
    '<circle cx="-1" cy="2.2" r=".6" fill="#ffc4d6"/>'
    '</g></g>'
    '</svg>'
)
LOGO_LINK = (
    '<a href="/" class="brand" aria-label="simplecommerce – Startseite" data-logo>'
    '<img class="logo-word" src="/assets/logo.jpg" width="309" height="78" alt="simplecommerce">'
    '<span class="logo-e"></span>'
    f'<span class="logo-hero"><span class="logo-frog"></span>{LOGO_FACE}</span>'
    f'{LOGO_REACH}'
    '</a>'
)


def links(items):
    return ''.join(f'<a href="{url}">{escape(label)}</a>' for label, url in items)


FOOTER = (
    '<footer><div class="footer-main">'
    f'<div><p class="footer-title">{COMPANY}</p><p>{ADDRESS_HTML}</p>'
    f'<a href="{PHONE_URL}">{PHONE_DISPLAY}</a><a href="{EMAIL_URL}">{EMAIL}</a></div>'
    f'<div><p class="footer-title">Leistungen</p>{links(FOOTER_SERVICES)}</div>'
    f'<div><p class="footer-title">Gut zu wissen</p>{links(FOOTER_INFO)}</div>'
    '</div><div class="footer-bottom">'
    f'<span>© 2026 {COMPANY}</span>'
    '<div><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a>'
    '<a href="/cookie-richtlinie-eu/">Cookies</a></div>'
    '</div></footer>'
)


def nav_item(label, url, path, shop_context):
    if path == url:
        current = ' aria-current="page"'
    elif url == '/shopsystem/' and shop_context:
        current = ' aria-current="true"'
    else:
        current = ''
    sub_links = ''.join(
        f'<a href="{sub_url}"' + (' aria-current="page"' if path == sub_url else '') + f'>{escape(sub_label)}</a>'
        for sub_label, sub_url in NAV_SUB.get(url, ())
    )
    submenu = f'<div class="nav-sub">{sub_links}</div>' if sub_links else ''
    return f'<div class="nav-item"><a href="{url}"{current}>{label}</a>{submenu}</div>'


def nav_html(path, shop_context):
    return ''.join(nav_item(label, url, path, shop_context) for label, url in NAV)


def page_schema(path, title, description, kind):
    canonical = BASE_URL + path
    organization_id = BASE_URL + '/#organization'
    graph = [
        {
            '@type': 'Organization',
            '@id': organization_id,
            'name': COMPANY,
            'url': BASE_URL,
            'logo': BASE_URL + '/assets/logo.jpg',
            'email': EMAIL,
            'telephone': PHONE_E164,
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': STREET,
                'postalCode': POSTAL_CODE,
                'addressLocality': CITY,
                'addressCountry': 'DE',
            },
        },
        {
            '@type': kind,
            '@id': canonical + '#page',
            'name': title,
            'description': description,
            'url': canonical,
            'inLanguage': 'de-DE',
            'publisher': {'@id': organization_id},
        },
    ]
    if path != '/':
        graph.append({
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Startseite', 'item': BASE_URL + '/'},
                {'@type': 'ListItem', 'position': 2, 'name': title, 'item': canonical},
            ],
        })
    return {'@context': 'https://schema.org', '@graph': graph}


def head_html(path, title, description, kind, noindex):
    canonical = BASE_URL + path
    safe_title = escape(title)
    safe_description = escape(description)
    robots = 'noindex,follow' if noindex else 'index,follow'
    stylesheets = ''.join(f'<link rel="stylesheet" href="/assets/{name}.css">' for name in STYLESHEETS)
    scripts = ''.join(f'<script src="/assets/{name}.js" defer></script>' for name in SCRIPTS)
    schema = json.dumps(page_schema(path, title, description, kind), ensure_ascii=False).replace('<', '\\u003c')
    return (
        '<head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{safe_title} | simplecommerce</title>'
        f'<meta name="description" content="{safe_description}">'
        f'<link rel="canonical" href="{canonical}">'
        f'<meta name="robots" content="{robots}">'
        '<meta name="theme-color" content="#ff6600">'
        '<meta property="og:type" content="website">'
        f'<meta property="og:title" content="{safe_title}">'
        f'<meta property="og:description" content="{safe_description}">'
        f'<meta property="og:url" content="{canonical}">'
        f'<meta property="og:image" content="{BASE_URL}/assets/logo.jpg">'
        f'{stylesheets}{scripts}'
        f'<script type="application/ld+json">{schema}</script>'
        '</head>'
    )


def header_html(path, shop_context):
    return (
        '<header class="header">'
        f'{LOGO_LINK}'
        f'<nav aria-label="Hauptnavigation">{nav_html(path, shop_context)}</nav>'
        '<a class="header-cta" href="/kontakt/">Projekt besprechen</a>'
        '</header>'
    )


def render_page(path, title, description, body, kind='WebPage', noindex=False, shop_context=False):
    html = (
        '<!doctype html>\n'
        '<html lang="de">'
        f'{head_html(path, title, description, kind, noindex)}'
        '<body><a class="skip" href="#inhalt">Zum Inhalt</a>'
        f'{header_html(path, shop_context)}'
        f'<main id="inhalt"><span id="top"></span>{body}</main>'
        f'{FOOTER}'
        '</body></html>'
    )
    # Altbestandstexte bringen Leerraum am Zeilenende mit; die Ausgabe enthält keinen.
    html = re.sub(r'((?:src|href)="/assets/[^"?]+\.(?:css|js))"', r'\1?v=20261108-3"', html)
    return '\n'.join(line.rstrip() for line in html.splitlines()) + '\n'


def intro(title, lead=''):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    return f'<section class="page-intro wrap reveal"><h1>{title}</h1>{lead_html}</section>'


def cta(
    title='Was haben Sie vor?',
    text='Ein neuer Shop, eine Website oder ein Prozess, der einfacher werden soll.',
    label='Projekt besprechen',
    url='/kontakt/',
):
    return (
        '<section class="cta wrap reveal">'
        f'<div><h2>{title}</h2><p>{text}</p></div>'
        f'<a class="button" href="{url}">{label}</a>'
        '</section>'
    )


def card(title, description, url, media=''):
    return (
        f'<a class="service reveal" href="{url}">{media}'
        f'<div class="service-body"><h3>{title}</h3><p>{description}</p>'
        '<span class="more">Mehr erfahren</span></div>'
        '</a>'
    )


def frog(image, alt):
    return (
        f'<span class="frog {image} ">'
        f'<img src="/assets/brand/{image}.jpg" alt="{alt}" width="780" height="204" loading="lazy">'
        '</span>'
    )


def faq_list(items):
    entries = ''.join(
        f'<details><summary>{question}</summary><p>{answer}</p></details>' for question, answer in items
    )
    return f'<div class="faq reveal">{entries}</div>'
