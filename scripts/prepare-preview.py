#!/usr/bin/env python3
"""Build an isolated subdirectory preview; never modify public/ in place."""
import argparse, json, re, shutil
from pathlib import Path
p = argparse.ArgumentParser()
p.add_argument('--output', required=True)
p.add_argument('--existing-htaccess', required=True)
p.add_argument('--account-login', default='seccom')
a = p.parse_args()
if not re.fullmatch(r'[A-Za-z0-9_-]+', a.account_login):
    raise SystemExit('Invalid Hetzner account login')
root = Path(__file__).resolve().parents[1]
out = Path(a.output)
if out.exists():
    raise SystemExit('Output must not exist')
existing = Path(a.existing_htaccess).read_text()
start = '# BEGIN SIMPLECOMMERCE PREVIEW'
end = '# END SIMPLECOMMERCE PREVIEW'
if existing.count(start) != existing.count(end) or existing.count(start) > 1:
    raise SystemExit('Invalid preview markers in existing .htaccess')
existing = re.sub(re.escape(start) + r'.*?' + re.escape(end), '', existing, flags=re.S)
if not re.search(r'^\s*AuthType\s+Basic\s*$', existing, re.I | re.M):
    raise SystemExit('Vorhandene .htaccess enthält keinen Basic-Verzeichnisschutz.')
shutil.copytree(root / 'public', out)
base = '/redesign'
# Rewrite root-relative literals and HTML attributes, preserving external URLs.
pattern = re.compile(r"([\"'`])/((?!/)[A-Za-z0-9_?#][^\s\"'`<>)]*|)(?=[\"'`)\s<>]|$)")
for file in out.rglob('*'):
    if file.suffix in {'.html', '.css', '.js', '.json'}:
        text = file.read_text()
        text = pattern.sub(lambda m: m[1] + base + '/' + m[2], text)
        text = re.sub(r'url\(/(?!/)', 'url(/redesign/', text)
        if file.suffix == '.html':
            text = re.sub(r'<meta name="robots"[^>]*>', '<meta name="robots" content="noindex,nofollow">', text)
        file.write_text(text)
ht = (out / '.htaccess').read_text()
ht = re.sub(r'(RewriteRule\s+\S+\s+)/', r'\1/redesign/', ht)
ht = ht.replace('ErrorDocument 404 /404/', 'ErrorDocument 404 /redesign/404/')
ht = ht.replace('m#^/hilfe/#', 'm#^/redesign/hilfe/#')
# Preserve Hetzner's authentication directives and replace only our own block.
preview = ('FcgidWrapper "/home/httpd/cgi-bin/php84-fcgi-starter.fcgi" .php\n'
           '<IfModule mod_headers.c>\nHeader always set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n')
(out / '.htaccess').write_text(existing.rstrip() + '\n\n' + start + '\n' + preview + ht + '\n' + end + '\n')
# Real delivery explicitly authorized for the protected preview by Benjamin.
# Rewrite only URL attributes in PHP, never PHP regexes or filesystem paths.
endpoint = out / 'kontakt/senden.php'
php = endpoint.read_text()
php = re.sub(r'((?:href|src)=")/(?!/)', r'\1/redesign/', php)
php = php.replace("$to = getenv('CONTACT_TO') ?: '';", "$to = getenv('CONTACT_TO') ?: 'projekt@simplecommerce.de';")
php = php.replace("$from = getenv('CONTACT_FROM') ?: '';", "$from = getenv('CONTACT_FROM') ?: 'projekt@simplecommerce.de';")
# Hetzner documents /usr/home/<login>; do not infer home from resolved web symlinks.
php = php.replace("dirname(__DIR__, 2).'/SEC/contact'", f"'/usr/home/{a.account_login}/SEC/simplecommerce-preview'")
endpoint.write_text(php)
# Do not publish a preview sitemap with production destinations.
(out / 'sitemap.xml').unlink(missing_ok=True)
(out / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
print('Preview prepared:', out)
