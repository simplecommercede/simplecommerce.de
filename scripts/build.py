#!/usr/bin/env python3
"""Erzeugt die statische Website ohne Fremdpakete. Ausgeliefert wird nur public/."""
from html import escape
from pathlib import Path
import json
import re

from help_render import render_help
from legacy_help import add_legacy_anchors, build_redirects
from site_layout import (
    ADDRESS_HTML, BASE_URL, COMPANY, EMAIL, EMAIL_URL, PHONE_DISPLAY, PHONE_URL,
    card, cta, faq_list, frog, intro, links, render_page,
)
from wordpress_html import clean_html, tidy_topic_content

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'


def read_json(name):
    return json.loads((ROOT / 'content' / name).read_text(encoding='utf-8'))


def compact_json(data):
    return json.dumps(data, ensure_ascii=False, separators=(',', ':'))


TEXTS = read_json('site-texts.json')
LEGACY_LINKS = read_json('legacy-links.json')
SERVICE_DETAILS = read_json('service-details.json')

# Kennungen aus dem WordPress-Altbestand.
HOME_ID = '10'
HELP_ID = '288'
SHOP_ID = '727'
PRICE_ID = '766'
EVENTS_ID = '816'
# Die Shop-Themen liegen historisch teils außerhalb von /shopsystem/; die Adressen bleiben.
SHOP_IDS_OUTSIDE_SECTION = ['32', '34', '38', '52', '72', '76', '80', '84', '370', '797', '337']
ADDED_HELP_PAGES = (
    ('help-quickstart', 'produkt-schnellstart', 'Produkt-Schnellstart'),
    ('help-glossary', 'begriffe-und-editor', 'Begriffe und HTML-Editor'),
)
# Diese Altseiten entfallen oder haben unten eine eigene Funktion.
UNMIGRATED_IDS = (HOME_ID, HELP_ID, SHOP_ID)
UNMIGRATED_SLUGS = (
    'kontakt', 'preise', 'cookie-richtlinie-eu',
    'veranstaltungen', 'veranstaltungsorte', 'schlagwoerter', 'ihre-buchungen',
)


def load_wordpress_pages():
    pages = read_json('wordpress-public.json')
    for page_id, slug, title in ADDED_HELP_PAGES:
        pages.append({
            'ID': page_id, 'post_parent': HELP_ID, 'post_name': slug, 'post_title': title, 'post_content': '',
        })
    return pages


def wordpress_path(wp_page):
    if wp_page['ID'] == HOME_ID:
        return '/'
    section = {HELP_ID: 'hilfe/', SHOP_ID: 'shopsystem/'}.get(wp_page['post_parent'], '')
    return '/' + (section + wp_page['post_name']).strip('/') + '/'


WP_PAGES = load_wordpress_pages()
WP_BY_ID = {wp_page['ID']: wp_page for wp_page in WP_PAGES}
WP_PATHS = {wp_page['ID']: wordpress_path(wp_page) for wp_page in WP_PAGES}
HELP_PAGES = [wp_page for wp_page in WP_PAGES if wp_page['post_parent'] == HELP_ID]

SHOP_IDS = [
    wp_page['ID'] for wp_page in WP_PAGES if wp_page['post_parent'] == SHOP_ID and wp_page['ID'] != HOME_ID
] + SHOP_IDS_OUTSIDE_SECTION
SHOP_PATHS = {WP_PATHS[page_id] for page_id in SHOP_IDS} | {'/preise/', '/preisrechner/'}

registry = []


def page(path, title, description, body, kind='WebPage', noindex=False):
    """Schreibt eine Seite und nimmt sie in Sitemap und Seitenindex auf."""
    html = render_page(path, title, description, body, kind, noindex, path in SHOP_PATHS)
    destination = OUT / path.strip('/') / 'index.html'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(add_legacy_anchors(path, html), encoding='utf-8')
    registry.append({'path': path, 'title': title, 'description': description, 'noindex': noindex})


def page_intro(texts):
    return intro(texts['heading'], texts['lead'])


def section_title(title, extra='', id_attr=''):
    return f'<div class="section-title reveal"><h2{id_attr}>{title}</h2>{extra}</div>'


# Preise: Rechner und Preisübersicht lesen dieselbe Tabelle wie /preise/, damit nichts auseinanderläuft.
TIER_LIMITS = [10000, 30000, 80000, None]


def price_table_html():
    source = WP_BY_ID[PRICE_ID]['post_content']
    found = re.search(r'<table\b.*?</table>', source, re.S)
    table = clean_html(found[0] if found else source, LEGACY_LINKS)
    # Betreiberfreigabe: SSL ist kostenlos und kein eigener Preisbestandteil mehr.
    table = re.sub(r'<tr>\s*<td>SSL-Leitung</td>.*?</tr>', '', table, flags=re.S)
    # Nur die Schreibweise vereinheitlichen (10.00 € zu 10,00 €), die Beträge bleiben unverändert.
    return re.sub(r'(\d)\.(\d\d) €', r'\1,\2 €', table)


def parse_price_rows(table):
    """Liest die Zeilen mit vier Umsatzstufen als {Bezeichnung: [Stufenwerte]}."""
    rows = {}
    for row in re.findall(r'<tr>(.*?)</tr>', table, re.S):
        cells = [
            ' '.join(re.sub(r'<[^>]+>', ' ', cell).split())
            for cell in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.S)
        ]
        if len(cells) == 5:
            rows[cells[0]] = cells[1:]
    return rows


def price_number(value):
    if value == 'inklusive':
        return 0
    found = re.match(r'([\d.,]+)', value)
    return float(found[1].replace('.', '').replace(',', '.')) if found else None


PRICE_TABLE = price_table_html()
PRICE_ROWS = parse_price_rows(PRICE_TABLE)
# Hinweiszeilen bleiben auf dem Handy trotz breiter Tabelle ganz lesbar.
PRICE_TABLE_HTML = re.sub(
    r'(<td colspan="\d+">)(?:<br>\s*)?(.*?)(</td>)', r'\1<span class="table-note">\2</span>\3', PRICE_TABLE, flags=re.S
)
PRICE_TIERS = [
    {
        'limit': limit,
        'rent': price_number(PRICE_ROWS['Shopmiete'][tier]),
        'rate': price_number(PRICE_ROWS['Umsatzprovision'][tier]),
    }
    for tier, limit in enumerate(TIER_LIMITS)
]


def small_cents(html):
    """Cent-Beträge erscheinen kleiner."""
    return re.sub(r'(\d),(\d\d)( ?€)', r'\1<span class="cents">,\2</span>\3', html)


def rent_html(value):
    amount, separator, unit = value.partition(' / ')
    return f'{amount} <small>/ {unit}</small>' if separator else amount


def tier_card(tier):
    return (
        f'<div class="tier" data-tier="{tier}">'
        f'<h3>{PRICE_ROWS["Ihr Umsatz / Monat"][tier]}</h3>'
        f'<p class="tier-rent">{rent_html(PRICE_ROWS["Shopmiete"][tier])}</p>'
        f'<dl><dt>Umsatzprovision</dt><dd>{PRICE_ROWS["Umsatzprovision"][tier]}</dd>'
        '</dl>'
        '</div>'
    )


def price_calculator():
    tier_cards = ''.join(tier_card(tier) for tier in range(len(TIER_LIMITS)))
    included = ''.join(
        f'<li>{name}</li>' for name, values in PRICE_ROWS.items() if all(value == 'inklusive' for value in values)
    )
    title = section_title(
        'Was würde Ihr Shop kosten?',
        '<p>Schieben Sie den Regler auf Ihren Monatsumsatz.</p>',
        ' id="rechner-titel"',
    )
    tiers_json = json.dumps(PRICE_TIERS)
    return (
        '<section class="calculator-section" id="rechner" aria-labelledby="rechner-titel"><div class="wrap">'
        f'{title}'
        f'<div class="calculator reveal" data-calculator=\'{tiers_json}\' hidden>'
        '<div class="calc-input">'
        '<label for="umsatz">Ihr Umsatz im Monat</label>'
        '<output id="umsatz-wert" for="umsatz">5.000 €</output>'
        '<input id="umsatz" type="range" min="0" max="100000" step="1000" value="5000">'
        '<div class="calc-scale" aria-hidden="true"><span>0 €</span><span>100.000 €</span></div>'
        '</div>'
        '<div class="calc-result" aria-live="polite">'
        '<p class="calc-label">Kosten im Monat, Beispielrechnung</p>'
        '<p class="calc-total" id="calc-total"></p>'
        '<dl id="calc-parts"></dl>'
        '</div>'
        '</div>'
        f'<div class="tiers reveal">{tier_cards}</div>'
        f'<ul class="included reveal"><li>In jeder Stufe enthalten:</li>{included}</ul>'
        f'<p class="fine">{TEXTS["prices"]["calculator_fine_print"]}</p>'
        '</div></section>'
    )


# Leistungen als Karten: im Slider der Startseite, auf /leistungen/ und bei „Das passt auch dazu“.
def offer_media(offer):
    media = frog(*offer['frog'])
    if offer.get('flip'):
        media = f'<span class="frog-flip">{media}</span>'
    return f'<span class="service-media">{media}</span>'


def offer_card(offer):
    return card(offer['title'], offer['description'], offer['url'], offer_media(offer))


OFFER_CARDS = ''.join(offer_card(offer) for offer in TEXTS['offers'])


def slider(cards, label):
    return (
        '<div class="slider" data-slider>'
        f'<div class="slider-track" tabindex="0" role="region" aria-label="{label}">{cards}</div>'
        '<div class="wrap slider-bar" hidden>'
        '<div class="slider-progress"><span></span></div>'
        '<div class="slider-buttons">'
        '<button type="button" class="slider-button" data-step="-1" aria-label="Vorherige Leistung"></button>'
        '<button type="button" class="slider-button" data-step="1" aria-label="Nächste Leistung"></button>'
        '</div></div></div>'
    )


# Startseite
def home_hero(texts):
    return (
        '<div class="hero hero-home"><div class="wrap hero-intro hero-copy">'
        f'<h1>{texts["heading"]}</h1>'
        f'<div><p class="lead">{texts["lead"]}</p>'
        '<div class="actions"><a class="button" href="/kontakt/">Ihr Projekt besprechen</a>'
        '<a class="text-link" href="/preisrechner/">Vorhaben zusammenstellen</a></div></div>'
        '</div>'
        f'{slider(OFFER_CARDS, "Unsere Leistungen")}'
        '</div>'
    )


def home_steps(texts):
    steps = ''.join(f'<li class="reveal"><h3>{head}</h3><p>{text}</p></li>' for head, text in texts['items'])
    return (
        f'<section class="wrap section steps-section" data-steps data-guide="{texts["guide"]}">'
        f'{section_title(texts["title"])}'
        f'<div class="steps-frog" aria-hidden="true">{frog("v_updates", texts["frog_alt"])}</div>'
        f'<ol class="steps">{steps}</ol>'
        '</section>'
    )


def question_card(item):
    return (
        f'<a class="question reveal" href="{item["url"]}">'
        f'<h3>{item["question"]}</h3><p>{item["answer"]}</p><span class="more">{item["label"]}</span>'
        '</a>'
    )


def home_good_to_know(texts):
    """Kurze Fragen und ausführliche Antworten stehen gemeinsam in einem Abschnitt."""
    title = section_title(texts['title'], f'<p>{texts["lead"]}</p>')
    questions = ''.join(question_card(item) for item in texts['questions'])
    return (
        f'<section class="question-section" data-guide="{texts["guide"]}"><div class="wrap section">'
        f'{title}'
        f'<div class="questions">{questions}</div>'
        f'{faq_list(texts["faq"])}'
        '</div></section>'
    )


def home_contact_band(texts):
    return (
        f'<section class="wrap contact-band reveal" data-guide="{texts["guide"]}">'
        f'<div><h2>{texts["title"]}</h2><p>{texts["text"]}</p>'
        '<div class="actions"><a class="button" href="/kontakt/">Projekt besprechen</a>'
        f'<a class="text-link" href="{PHONE_URL}">{PHONE_DISPLAY}</a></div></div>'
        f'<span data-hop>{frog("v_shop_cms", texts["frog_alt"])}</span>'
        '</section>'
    )


def build_home():
    texts = TEXTS['home']
    body = (
        home_hero(texts)
        + home_steps(texts['steps'])
        + home_good_to_know(texts['good_to_know'])
        + home_contact_band(texts['contact_band'])
    )
    page('/', texts['title'], texts['description'], body)


# Leistungen
def build_services_overview():
    texts = TEXTS['services_overview']
    body = page_intro(texts) + f'<section class="services wrap">{OFFER_CARDS}</section>' + cta()
    page('/leistungen/', texts['title'], texts['description'], body)


def service_detail(slug):
    """Zielgruppe, Ablauf und Fragen aus content/service-details.json."""
    details = SERVICE_DETAILS[slug]
    fit_items = ''.join(f'<li>{escape(item)}</li>' for item in details['passt'])
    flow_items = ''.join(
        f'<li class="reveal"><h3>{escape(head)}</h3><p>{escape(text)}</p></li>' for head, text in details['ablauf']
    )
    return (
        '<section class="wrap fit-section reveal"><h2>Passt zu Ihnen, wenn …</h2>'
        f'<ul class="fit-list">{fit_items}</ul></section>'
        '<section class="wrap section steps-section">'
        f'{section_title("So läuft es ab")}<ol class="steps">{flow_items}</ol></section>'
        '<section class="wrap faq-section">'
        f'{section_title("Häufige Fragen")}{faq_list(details["fragen"])}</section>'
    )


def related_services(slug):
    related = SERVICE_DETAILS[slug]['verwandt']
    cards = ''.join(offer_card(offer) for offer in TEXTS['offers'] if offer['url'] in related)
    return (
        '<section class="wrap section related-section">'
        f'{section_title("Das passt auch dazu")}<div class="services">{cards}</div>'
        '</section>'
    )


def brand_motif(slug):
    motif = TEXTS['brand_motifs'].get(slug)
    if not motif:
        return ''
    image = motif['image']
    return (
        '<aside class="brand-motif wrap">'
        f'<div><p class="motif-caption">{motif["caption"]}</p></div>'
        f'<div class="motif-crop {image}">'
        f'<img src="/assets/brand/{image}.jpg" alt="{motif["alt"]}" width="780" height="204" loading="lazy">'
        '</div></aside>'
    )


def service_body(slug, texts):
    contact_url = f'/kontakt/?thema={texts["contact_topic"]}'
    estimate_url = f'/preisrechner/?thema={texts["contact_topic"]}'
    articles = ''.join(
        f'<article class="reveal"><h2>{head}</h2><p>{text}</p></article>' for head, text in texts['sections']
    )
    note = TEXTS['service_price_note']
    return (
        intro(texts['heading'], texts['description'])
        + '<div class="wrap intro-actions"><div class="actions">'
        f'<a class="button" href="{contact_url}">Angebot anfragen</a>'
        f'<a class="text-link" href="{estimate_url}">Vorhaben zusammenstellen</a>'
        '</div></div>'
        + brand_motif(slug)
        + f'<section class="wrap service-content">{articles}</section>'
        + service_detail(slug)
        + f'<section class="wrap note"><h2>{note["title"]}</h2><p>{note["text"]}</p>'
        f'<a href="{contact_url}">Individuelles Angebot anfragen →</a>'
        f'<a href="{estimate_url}">Vorhaben zusammenstellen →</a></section>'
        + related_services(slug)
        + cta(url=contact_url)
    )


def build_service_pages():
    for slug, texts in TEXTS['service_pages'].items():
        page(f'/{slug}/', texts['title'], texts['description'], service_body(slug, texts))


# Shopübersicht: ihre Gliederung liefert auch Einleitung und Nachbarthemen der Themenseiten.
SHOP_SECTIONS = TEXTS['shop']['sections']
TOPIC_LEADS = {
    **{page_id: text for section in SHOP_SECTIONS for page_id, text in section['topics']},
    **TEXTS['shop']['other_topic_leads'],
}
TOPIC_NEIGHBOURS = {
    page_id: [other for other, _ in section['topics'] if other != page_id]
    for section in SHOP_SECTIONS
    for page_id, _ in section['topics']
}


def feature_list(topics):
    items = ''.join(
        f'<li><a href="{WP_PATHS[page_id]}"><strong>{escape(WP_BY_ID[page_id]["post_title"])}</strong>'
        f'<span>{text}</span></a></li>'
        for page_id, text in topics
    )
    return f'<ul class="feature-list">{items}</ul>'


def build_shop_overview():
    # Jede Themenseite erscheint genau einmal; die Prüfung verhindert, dass beim Umbau Links verloren gehen.
    listed = {page_id for section in SHOP_SECTIONS for page_id, _ in section['topics']}
    assert listed == set(SHOP_IDS), 'Shopseite: Themenliste und Seitenbestand weichen ab'
    texts = TEXTS['shop']
    sections = ''.join(
        f'<section class="reveal"><h2>{section["title"]}</h2>{feature_list(section["topics"])}</section>'
        for section in SHOP_SECTIONS
    )
    note_title, note_text = texts['mobile_note']
    body = (
        '<div class="hero hero-small"><div class="wrap hero-grid"><div class="hero-copy">'
        f'<h1>{texts["heading"]}</h1><p class="lead">{texts["lead"]}</p>'
        '<div class="actions"><a class="button" href="/preise/">Preise ansehen</a>'
        '<a class="text-link" href="/kontakt/?thema=Shopsystem">Shop anfragen</a></div>'
        '</div>'
        f'<span class="hero-frog" data-hop>{frog("v_warenwirtschaft", texts["frog_alt"])}</span>'
        '</div></div>'
        f'<div class="wrap"><div class="feature-duo">{sections}</div></div>'
        f'<section class="wrap note reveal"><h2>{note_title}</h2><p>{note_text}</p></section>'
        + cta(*texts['cta'])
    )
    page('/shopsystem/', texts['title'], texts['description'], body)


# Aus WordPress übernommene Seiten
def load_help_articles():
    """Gepflegte Anleitungen; ohne Eintrag bleibt ein Hilfetext Entwurf aus dem Altbestand."""
    articles = read_json('help-updates.json')
    screenshots = read_json('screenshots.json')
    for slug, sections in read_json('help-details.json').items():
        articles[slug]['html'] = render_help(articles[slug], sections, screenshots)
    return articles


def build_help_article(wp_page, article, sidebar_links):
    title = wp_page['post_title']
    if article:
        content = article['html']
        description = article['description']
        title = article.get('title', title)
        note = ''
    else:
        content = clean_html(wp_page['post_content'], LEGACY_LINKS)
        description = f'{title}: Anleitung aus dem bisherigen simplecommerce Helpcenter.'
        note = f'<aside class="migration-note">{TEXTS["help"]["migration_note"]}</aside>'
    body = (
        intro(title, description)
        + '<div class="help-layout wrap"><aside class="help-sidebar">'
        '<a href="/hilfe/">← Alle Hilfethemen</a><h2>Shopverwaltung</h2>'
        f'{sidebar_links}</aside>'
        f'<article class="prose">{note}{content}</article></div>'
    )
    page(WP_PATHS[wp_page['ID']], title + ' – Hilfe', description, body, kind='TechArticle', noindex=not article)


def build_legal_page(wp_page):
    """Die gepflegten Rechtstexte ersetzen den historischen Altbestand."""
    slug = wp_page['post_name']
    title = wp_page['post_title']
    description = TEXTS['legal_descriptions'][slug]
    content = (ROOT / 'content/legal' / f'{slug}.html').read_text(encoding='utf-8')
    body = intro(title, description) + f'<article class="prose wrap narrow">{content}</article>'
    page(WP_PATHS[wp_page['ID']], title, description, body)


def topic_sidebar(page_id):
    neighbours = [(WP_BY_ID[other]['post_title'], WP_PATHS[other]) for other in TOPIC_NEIGHBOURS[page_id]]
    return (
        '<aside class="topic-side"><h2>Passt dazu</h2>'
        f'{links(neighbours + [("Alle Shop-Themen", "/shopsystem/")])}'
        '<a class="button" href="/preise/">Preise ansehen</a></aside>'
    )


def build_topic_page(wp_page):
    page_id = wp_page['ID']
    title = wp_page['post_title']
    lead = TOPIC_LEADS.get(page_id, '')
    description = f'{title} im simplecommerce Shopsystem: {lead}' if lead else f'{title} bei simplecommerce.'
    source = wp_page['post_content']
    if wp_page['post_name'] == 'design-und-layout':
        # Die alten vier Demos sind offline; erst den freigegebenen Neubau verlinken.
        source = re.sub(r'<ol>\s*<li><a href="http://demoshop\.simplecommerce\.de/".*?</ol>', '', source, flags=re.S)
        source = source.replace('Eines der folgenden Layouts wird', 'Eine simplecommerce-Vorlage wird')
    content = tidy_topic_content(clean_html(source, LEGACY_LINKS), title, TEXTS['text_fixes'])
    if page_id in SHOP_IDS:
        article = (
            f'<div class="wrap topic-layout"><article class="prose">{content}</article>'
            f'{topic_sidebar(page_id)}</div>'
        )
    else:
        article = f'<article class="prose wrap narrow">{content}</article>'
    body = intro(title, lead) + brand_motif(wp_page['post_name']) + article + cta()
    page(WP_PATHS[page_id], title, description, body)


def is_migrated(wp_page):
    return not (
        wp_page['ID'] in UNMIGRATED_IDS
        or wp_page['post_name'] in UNMIGRATED_SLUGS
        or wp_page['post_parent'] == EVENTS_ID
    )


def build_migrated_pages():
    articles = load_help_articles()
    sidebar_links = links([(wp_page['post_title'], WP_PATHS[wp_page['ID']]) for wp_page in HELP_PAGES])
    for wp_page in filter(is_migrated, WP_PAGES):
        slug = wp_page['post_name']
        if wp_page['post_parent'] == HELP_ID:
            build_help_article(wp_page, articles.get(slug), sidebar_links)
        elif slug in TEXTS['legal_descriptions']:
            build_legal_page(wp_page)
        else:
            build_topic_page(wp_page)


# Hilfe-Übersicht
def help_group(group, pages_by_title):
    topics = ''.join(
        f'<a href="{WP_PATHS[pages_by_title[topic]["ID"]]}" data-topic="{escape(topic.lower())}">{escape(topic)}</a>'
        for topic in group['topics']
    )
    return (
        f'<section class="help-group reveal" data-help-group><h2>{group["title"]}</h2>'
        f'<div class="topic-grid">{topics}</div></section>'
    )


def build_help_overview():
    texts = TEXTS['help']
    pages_by_title = {wp_page['post_title']: wp_page for wp_page in HELP_PAGES}
    grouped_titles = [topic for group in texts['groups'] for topic in group['topics']]
    assert sorted(grouped_titles) == sorted(pages_by_title), 'Hilfe: Gruppen und Seitenbestand weichen ab'
    groups = ''.join(help_group(group, pages_by_title) for group in texts['groups'])
    body = (
        page_intro(texts)
        + '<section class="wrap help-search"><label for="hilfe-suche">Hilfethema suchen</label>'
        f'<input id="hilfe-suche" type="search" placeholder="{texts["search_placeholder"]}" autocomplete="off">'
        '<p id="suchstatus" role="status" aria-live="polite"></p>'
        f'<div id="help-topics">{groups}</div></section>'
        + cta(*texts['cta'])
    )
    page('/hilfe/', texts['title'], texts['description'], body)


def build_help_stubs():
    """Alte Hilfeadressen ohne aktuelle Anleitung verweisen auf ein Gespräch."""
    for stub in TEXTS['help']['stubs']:
        body = (
            intro(stub['title'], stub['text'])
            + '<article class="prose wrap narrow">'
            '<p><a href="/kontakt/">Anbindung oder Datensicherung besprechen →</a></p>'
            '<p><a href="/hilfe/">Zur aktuellen Hilfe</a></p>'
            '</article>'
        )
        page(f'/hilfe/{stub["slug"]}/', stub['title'], stub['text'], body)


# Preise und Preisrechner
def build_price_page():
    texts = TEXTS['prices']
    extras = (
        '<div class="price-extras">'
        f'<div class="reveal"><h3>{texts["setup_title"]}</h3><p>{"<br>".join(texts["setup_lines"])}</p>'
        '<a class="text-link" href="/design-und-layout/">Details zu Design & Layout</a></div>'
        f'<div class="reveal"><h3>{texts["questions_title"]}</h3><p>{texts["questions_text"]}</p>'
        '<a class="text-link" href="/preisrechner/?thema=Shopsystem">Gesamtkosten schätzen</a> '
        '<a class="text-link" href="/kontakt/?thema=Shopsystem">Shop-Angebot anfragen</a></div>'
        '</div>'
    )
    body = (
        page_intro(texts)
        + price_calculator()
        + f'<section class="wrap section">{section_title("Alle Preise im Detail")}'
        '<div class="table-scroll reveal" tabindex="0" role="region" aria-label="Shoppreise nach Umsatzstufe">'
        f'{PRICE_TABLE_HTML}</div>{extras}</section>'
        + cta(*texts['cta'])
    )
    page('/preise/', texts['title'], texts['description'], small_cents(body))


def build_estimator_page():
    texts = TEXTS['estimator']
    body = (
        page_intro(texts)
        + '<section class="wrap estimator-section"><div class="estimator" data-estimator><noscript>'
        f'<div class="estimator-fallback"><p>{texts["noscript"]}</p></div>'
        '</noscript></div></section>'
        + f'<section class="wrap section faq-section">{section_title("So lesen Sie das Ergebnis")}'
        f'{faq_list(texts["faq"])}</section>'
        + cta(*texts['cta'])
    )
    page('/preisrechner/', texts['title'], texts['description'], small_cents(body))


# Kontakt: senden.php wertet die Felder aus; der Fragebogen füllt thema und nachricht.
CONTACT_FORM = (
    '<form action="/kontakt/senden.php" method="post" class="contact-form">'
    '<h2>Erzählen Sie uns von Ihrem Vorhaben.</h2>'
    '<label for="name">Ihr Name</label>'
    '<input id="name" name="name" autocomplete="name" maxlength="120" required>'
    '<label for="email">E-Mail-Adresse</label>'
    '<input id="email" name="email" type="email" autocomplete="email" maxlength="254" required>'
    '<div class="phone-field"><label for="telefon">Telefonnummer für den Rückruf</label>'
    '<input id="telefon" name="telefon" type="tel" autocomplete="tel" maxlength="40" '
    r'pattern="[0-9+\(\)\/ .\-]{5,40}" '
    'title="Bitte nur Ziffern und die Zeichen + ( ) / . - verwenden"></div>'
    '<label for="thema">Worum geht es?</label>'
    '<select id="thema" name="thema">'
    '<option>Shopsystem</option>'
    '<option>Webseitenerstellung</option>'
    '<option>IT-Beratung</option>'
    '<option>IT-Projekt</option>'
    '<option>KI-Anwendungen</option>'
    '<option>Service</option>'
    '<option selected>Sonstiges</option>'
    '</select>'
    '<label for="nachricht">Ihre Nachricht</label>'
    '<textarea id="nachricht" name="nachricht" rows="7" minlength="10" maxlength="10000" required></textarea>'
    '<div class="honeypot" aria-hidden="true"><label for="website">Bitte leer lassen</label>'
    '<input id="website" name="website" tabindex="-1" autocomplete="off"></div>'
    f'<p class="fine">{TEXTS["contact"]["form_notice"]}</p>'
    '<button class="button" type="submit">Anfrage senden</button>'
    '</form>'
)


def build_contact_page():
    texts = TEXTS['contact']
    body = (
        page_intro(texts)
        + f'<section class="wrap contact-grid">{CONTACT_FORM}'
        '<div class="reveal"><h2>Direkt zu uns.</h2>'
        f'<a class="contact-link" href="{EMAIL_URL}">{EMAIL}</a>'
        f'<a class="contact-link" href="{PHONE_URL}">{PHONE_DISPLAY}</a>'
        f'<p>{COMPANY}<br>{ADDRESS_HTML}</p>'
        f'<h3>Lieber persönlich sprechen?</h3><p>{"<br>".join(texts["appointment_text"])}</p>'
        '<p>Sie nutzen bereits einen Shop?<br>Wir helfen Ihnen persönlich weiter.</p>'
        f'<span class="contact-frog" data-hop>{frog("v_bedienung", texts["frog_alt"])}</span>'
        '</div></section>'
    )
    page('/kontakt/', texts['title'], texts['description'], body)


# Weitere Seiten
def build_cookie_page():
    texts = TEXTS['cookies']
    paragraphs = ''.join(f'<p>{paragraph}</p>' for paragraph in texts['paragraphs'])
    body = page_intro(texts) + f'<article class="prose wrap narrow">{paragraphs}</article>'
    page('/cookie-richtlinie-eu/', texts['title'], texts['description'], body)


def build_not_found_page():
    texts = TEXTS['not_found']
    body = (
        page_intro(texts)
        + '<div class="wrap actions"><a class="button" href="/">Zur Startseite</a>'
        '<a class="text-link" href="/kontakt/">Zum Kontakt →</a></div>'
    )
    page('/404/', texts['title'], texts['description'], body, noindex=True)


# Fragebogen (content/frog-guide.json) und Preisschätzung (content/price-estimate.json) für den Browser
def check_guide_data(guide, estimate):
    statement_ids = [statement['id'] for statement in guide['statements']]
    questionnaire = guide['questionnaire']
    details = [*questionnaire['details'].values()]
    follow_ups = [*questionnaire['followUp'].values(), *questionnaire['common']]
    first_topics = {option['topic'] for option in questionnaire['first']['options']}
    contact_topics = {option.strip() for option in re.findall(r'<option[^>]*>(.*?)</option>', CONTACT_FORM)}
    used_statements = {option['statement'] for question in details + follow_ups for option in question['options']}
    hidden_by = {
        statement
        for question in follow_ups
        for option in question['options']
        for statement in option.get('hideIf', [])
    }

    assert len(set(statement_ids)) == len(statement_ids), 'Fragebogen: doppelte Aussage'
    assert len({statement['nr'] for statement in guide['statements']}) == len(statement_ids), \
        'Fragebogen: Bausteinnummer fehlt oder doppelt'
    assert first_topics <= contact_topics, 'Fragebogen: Thema fehlt im Kontaktformular'
    assert first_topics == set(questionnaire['details']), 'Fragebogen: Themen und Detailfragen weichen ab'
    assert first_topics >= set(questionnaire['followUp']), 'Fragebogen: Vertiefung ohne Thema'
    assert used_statements == set(statement_ids), 'Fragebogen: Aussagen und Antworten weichen ab'
    assert hidden_by <= set(statement_ids), 'Fragebogen: hideIf nennt unbekannte Aussage'
    # Werte mit source "entwurf" sind nicht freigegeben, Shopwerte stammen aus der Preistabelle.
    assert set(estimate['effects']) <= set(statement_ids), 'Preisschätzung: unbekannte Aussage'
    assert all(effect['source'] in ('preisliste', 'entwurf') for effect in estimate['effects'].values()), \
        'Preisschätzung: Herkunft fehlt'


def write_guide_data():
    guide = read_json('frog-guide.json')
    estimate = read_json('price-estimate.json')
    check_guide_data(guide, estimate)
    if not estimate['released']:
        estimate['effects'] = {
            key: ({'label': value['label'], 'source': value['source'], 'onRequest': True}
                  if value['source'] == 'entwurf' else value)
            for key, value in estimate['effects'].items()
        }
    data = {**guide, 'prices': {**estimate, 'tiers': PRICE_TIERS}}
    (OUT / 'assets/guide-data.js').write_text(f'window.FROSCH_DATA={compact_json(data)};\n', encoding='utf-8')


# Verzeichnisse aller erzeugten Seiten
def write_sitemap():
    urls = ''.join(f'<url><loc>{BASE_URL}{entry["path"]}</loc></url>' for entry in registry if not entry['noindex'])
    (OUT / 'sitemap.xml').write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n',
        encoding='utf-8',
    )


def write_robots():
    (OUT / 'robots.txt').write_text(
        f'User-agent: *\nAllow: /\nDisallow: /kontakt/senden.php\nSitemap: {BASE_URL}/sitemap.xml\n',
        encoding='utf-8',
    )


def write_search_index():
    """Suche des Frosch-Wegweisers; die Hilfe hat eine eigene Suche."""
    entries = [
        {'p': entry['path'], 't': entry['title'], 'd': entry['description']}
        for entry in registry
        if not entry['noindex'] and not entry['path'].startswith('/hilfe/')
    ]
    (OUT / 'assets/search-index.json').write_text(compact_json(entries), encoding='utf-8')


def write_page_index():
    (ROOT / 'content/page-index.json').write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )


def main():
    # Die Reihenfolge bestimmt Sitemap, Suchindex und Seitenindex.
    build_home()
    build_services_overview()
    build_service_pages()
    build_shop_overview()
    build_migrated_pages()
    build_help_overview()
    build_price_page()
    build_contact_page()
    build_estimator_page()
    build_cookie_page()
    build_not_found_page()
    build_help_stubs()

    write_guide_data()
    write_sitemap()
    write_robots()
    write_search_index()
    write_page_index()
    print(f'{len(registry)} statische Seiten erstellt.')
    build_redirects(ROOT)


if __name__ == '__main__':
    main()
