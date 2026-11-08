#!/usr/bin/env bash
# Geschützte Vorschau über FTP mit explizitem TLS (FTPS), ohne SSH-Shell.
set -euo pipefail
umask 077
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-seccom@dedi1693.your-server.de}"
[[ "$TARGET" =~ ^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$ ]] || { echo 'Ungültiges FTP-Ziel'; exit 1; }
FTP_USER="${TARGET%@*}"
FTP_HOST="${TARGET#*@}"
cd "$ROOT"
[[ "$(git branch --show-current)" == 'codex/integration-redesign-live' ]] || { echo 'Bitte Integrationsbranch auschecken'; exit 1; }
for tool in lftp curl python3; do command -v "$tool" >/dev/null || { echo "Fehlt: $tool"; exit 1; }; done
DEST='public_html/new/redesign'
python3 scripts/build.py
python3 scripts/validate.py
TMP="$(mktemp -d)"
trap 'unset LFTP_PASSWORD; rm -rf "$TMP"' EXIT
read -r -s -p "FTP-Passwort für $TARGET: " LFTP_PASSWORD
printf '\n'
[[ -n "$LFTP_PASSWORD" ]] || { echo 'FTP-Passwort fehlt'; exit 1; }
export LFTP_PASSWORD
# Keine Passwörter in Argumenten oder Dateien, keine unverschlüsselte Ausweichverbindung.
cat > "$TMP/connect.lftp" <<EOF
set cmd:fail-exit yes
set net:max-retries 1
set net:timeout 20
set ftp:ssl-force yes
set ftp:ssl-protect-data yes
set ssl:verify-certificate yes
open --env-password --user "$FTP_USER" "ftp://$FTP_HOST"
EOF
check_protection() {
  for url in 'https://simplecommerce.de/redesign/' 'https://simplecommerce.de/redesign/assets/site.css'; do
    STATUS="$(curl --silent --show-error --max-time 30 --output /dev/null --write-out '%{http_code}' "$url")"
    [[ "$STATUS" == 401 ]] || { echo "Abbruch: HTTP $STATUS statt 401. Bitte zuerst den Hetzner-Verzeichnisschutz für /redesign/ aktivieren."; exit 1; }
  done
}
check_protection
cat "$TMP/connect.lftp" > "$TMP/download.lftp"
cat >> "$TMP/download.lftp" <<EOF
mkdir -p "SEC/simplecommerce-preview" || echo "SEC-Ordner vorhanden oder Anlage abgewiesen; prüfe Zugriff."
cd "SEC/simplecommerce-preview"
cd ../..
chmod 700 "SEC/simplecommerce-preview"
get "$DEST/.htaccess" -o "$TMP/existing.htaccess"
bye
EOF
lftp --norc -f "$TMP/download.lftp"
python3 scripts/prepare-preview.py --output "$TMP/site" --existing-htaccess "$TMP/existing.htaccess" --account-login "$FTP_USER"
cat "$TMP/connect.lftp" > "$TMP/protect.lftp"
cat >> "$TMP/protect.lftp" <<EOF
put "$TMP/site/.htaccess" -o "$DEST/.htaccess"
chmod 644 "$DEST/.htaccess"
bye
EOF
lftp --norc -f "$TMP/protect.lftp"
check_protection
cat "$TMP/connect.lftp" > "$TMP/upload.lftp"
cat >> "$TMP/upload.lftp" <<EOF
mirror --reverse --verbose --no-perms --exclude-glob .htaccess "$TMP/site/" "$DEST/"
bye
EOF
lftp --norc -f "$TMP/upload.lftp"
unset LFTP_PASSWORD
check_protection
printf 'Upload abgeschlossen: https://simplecommerce.de/redesign/\n'
printf 'Mit simple und dem Vorschau-Passwort anmelden. Echter Mailversand an projekt@simplecommerce.de ist vorbereitet; Zustellung bitte testen.\n'
