"""Bereinigt den WordPress-Altbestand zu harmlosem redaktionellem HTML."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import re

# Alte Skripte, Formulare und Shortcodes werden nie übernommen.
BLOCKED_TAGS = ('script', 'style', 'iframe', 'form', 'object')
CLOSED_TAGS = (
    'p', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'table', 'thead', 'tbody',
    'tr', 'th', 'td', 'blockquote', 'sup', 'sub',
)
KEPT_TAGS = CLOSED_TAGS + ('br',)
ALLOWED_SCHEMES = ('', 'http', 'https', 'mailto', 'tel')
OWN_HOSTS = ('simplecommerce.de', 'www.simplecommerce.de', 'new.simplecommerce.de')
LEGACY_HELP_PREFIXES = ('/seiten/', '/sec_helpcenter/', 'help_', '_help_')
SHORTCODE = r'\[(?:/?[\w-]+)[^\]]*\]'

# Reste der alten Vorlage und Werbetexte, die auf Themenseiten entfallen.
OLD_TEMPLATE_PATTERNS = (
    # Bildbeschriftung als Überschrift und doppelter Sprachtool-Block.
    (r'<h[1-6]>\s*Graphic design\s*</h[1-6]>', '', 0),
    (r'<h[1-6]>\s*Dokumenten Manager\s*</h[1-6]>\s*<p>\s*Sprachtool:.*?</p>', '', re.S),
)
OLD_PROMOTION_PATTERNS = (
    # Verweise auf Anleitungen entfallen; beworben wird, was möglich ist.
    (r'(?:<br>\s*)*--&gt;\s*<a href="/hilfe/[^"]*">[^<]*Hilfethema[^<]*</a>', '', 0),
    (r'<p>\s*<a href="/hilfe/[^"]*">[^<]*Hilfethema[^<]*</a>\s*</p>', '', 0),
    (r'(?:<a [^>]*>\s*)?:+\s*zum Hilfethema\s*(?:</a>)?', '', 0),
    (r'<a href="">\s*mehr\.\.\.\s*</a>', '', 0),
    (r'<p>Hilfe\?\?.*?</p>\s*<h3>Hilfe Themen</h3>\s*<p>Mit unserer Onlinehilfe.*?arbeiten werden\.\s*', '<p>', re.S),
    # Reste der alten WordPress-Unternavigation (Linkketten ohne Text).
    (r'(?:<a [^>]*>[^<]*</a>\s*\|?\s*){5,}', '', 0),
)


def legacy_help_target(href, legacy_links):
    slug = Path(urlparse(href).path).stem.removeprefix('_').removeprefix('help_')
    return legacy_links.get(slug, '/hilfe/')


class Cleaner(HTMLParser):
    def __init__(self, legacy_links):
        super().__init__(convert_charrefs=True)
        self.legacy_links = legacy_links
        self.out = []
        self.blocked_depth = 0
        self.ids = set()

    def unique_id(self, value):
        """Gibt das id-Attribut nur beim ersten Vorkommen zurück."""
        if not value:
            return ''
        attribute = ' id="' + escape(value, quote=True) + '"' if value not in self.ids else ''
        self.ids.add(value)
        return attribute

    def link_target(self, href):
        parts = urlparse(href)
        if parts.hostname in OWN_HOSTS:
            href = parts.path or '/'
            if parts.fragment:
                href += '#' + parts.fragment
        if href.startswith(LEGACY_HELP_PREFIXES):
            href = legacy_help_target(href, self.legacy_links)
        return href

    def open_link(self, attrs):
        href = attrs.get('href', '')
        if urlparse(href).scheme not in ALLOWED_SCHEMES:
            return
        target = escape(self.link_target(href), quote=True)
        anchor = self.unique_id(attrs.get('id') or attrs.get('name'))
        self.out.append(f'<a href="{target}"{anchor}>')

    def open_kept_tag(self, tag, attrs):
        extra = self.unique_id(attrs.get('id'))
        if tag in ('th', 'td'):
            for key in ('colspan', 'rowspan'):
                if attrs.get(key, '').isdigit():
                    extra += f' {key}="{attrs[key]}"'
        self.out.append(f'<{tag}{extra}>')

    def handle_starttag(self, tag, attrs):
        if tag in BLOCKED_TAGS:
            self.blocked_depth += 1
        elif self.blocked_depth:
            pass
        elif tag == 'a':
            self.open_link(dict(attrs))
        elif tag in KEPT_TAGS:
            self.open_kept_tag(tag, dict(attrs))

    def handle_endtag(self, tag):
        if tag in BLOCKED_TAGS:
            self.blocked_depth = max(0, self.blocked_depth - 1)
        elif not self.blocked_depth and (tag == 'a' or tag in CLOSED_TAGS):
            self.out.append(f'</{tag}>')

    def handle_data(self, data):
        if not self.blocked_depth:
            self.out.append(escape(data))


def clean_html(source, legacy_links):
    cleaner = Cleaner(legacy_links)
    cleaner.feed(source)
    return re.sub(SHORTCODE, '', ''.join(cleaner.out))


def apply_patterns(content, patterns):
    for pattern, replacement, flags in patterns:
        content = re.sub(pattern, replacement, content, flags=flags)
    return content


def tidy_topic_content(content, title, text_fixes):
    """Entfernt Übernahmefehler und Altlasten aus bereinigtem Themenseitentext."""
    for wrong, right in text_fixes:
        content = content.replace(wrong, right)
    content = apply_patterns(content, OLD_TEMPLATE_PATTERNS)
    # Der Seitentitel steht schon in der Einleitung.
    content = re.sub(r'^\s*<h[1-6]>\s*' + re.escape(title) + r'\s*</h[1-6]>', '', content, count=1)
    return apply_patterns(content, OLD_PROMOTION_PATTERNS)
