# simplecommerce.de

Statische Unternehmenswebsite mit Online-Hilfe. PHP wird nur für das Kontaktformular benötigt. Auf den funktionalen Erstentwurf folgt die beauftragte Markenüberarbeitung mit Originalorange und Froschmotiven. Weitere Designarbeit wird mit dem Kollegen abgestimmt.

## Lokal starten

```sh
python3 scripts/build.py
CONTACT_ENV=development php -S 127.0.0.1:1890 -t public
```

Öffnen: http://127.0.0.1:1890/ . Ausschließlich `public/` als DocumentRoot ausliefern. Ein Aufruf des Generators ersetzt generierte HTML-Dateien; Änderungen an Inhalten im Generator bzw. in `content/` vornehmen. CSS und JavaScript liegen separat unter `public/assets/`.

## Prüfen

```sh
python3 scripts/validate.py
php -l public/kontakt/senden.php
git diff --check
```

Der lokale PHP-Webserver prüft keine Apache-Weiterleitungen. Ohne Versandkonfiguration meldet das Kontaktformular einen Fehler; den lokalen Testtransport beschreibt die Betriebsdokumentation.

## Aufbau

- `content/wordpress-public.json`: gesicherter öffentlicher Altbestand, keine DB-Konten oder Einsendungen.
- `content/help-updates.json`: 24 aktualisierte Anleitungen mit Desktop- und Mobilansichten.
- `scripts/build.py`: reproduzierbarer HTML-Build ohne Fremdpakete, dazu `scripts/site_layout.py` (Seitenrahmen), `scripts/wordpress_html.py` (Altbestand) und `content/site-texts.json` (Seitentexte).
- `public/`: alleiniger Webroot mit statischen Seiten, Assets und Kontakt-Endpunkt.
- `docs/`: Migration, Betrieb, Prüfung und Screenshot-Herkunft.

Originaldump, alte Hilfe und Originaluploads bleiben lokal und sind ignoriert. Keine Dateien daraus pauschal hochladen. Git-Commits erfolgen in fachlichen Teilschritten mit deutschen Beschreibungen.

## Dokumentation
- [AGENTS.md](AGENTS.md): verbindliche Arbeitsregeln und bisherige Erkenntnisse.
- [Migration](docs/migration.md): Quellen, Inhalte, Navigation und URLs.
- [Animationen und Demoshop-Todos](docs/animationen-und-demoshop-todos.md): technische Vorschläge aus der Abstimmung mit Georgie, Status und Abnahmekriterien.
- [Betrieb](docs/betrieb.md): Webserver, Kontaktversand und Voraussetzungen für den Livegang.
- [Hilfe und Prüfung](docs/hilfe-pruefung.md): Aufnahmeverfahren, Nachweise und Grenzen.

Stand 08.11.2026: 62 statische Seiten, 25 Hilfethemen, 128 eingebundene Screenshots. Shop-Preise sind der Shop-Navigation zugeordnet; `/preise/` bleibt bestehen. Die neutrale Admin-Demo läuft getrennt auf Port 1892; deren Testdaten bleiben erhalten. Funktion und Mailzustellung der geschützten Vorschau wurden von Benjamin bestätigt; die Produktivumstellung steht noch aus.

Markenüberarbeitung vom 04.11.2026: Originalorange `#ff6600`, Anthrazit/Weiß und fotografische Froschmotive aus dem bereitgestellten Bestand. Startseite und Leistungs-/Themenansichten individueller gestaltet; Herkunft in `content/brand-assets.json`. Diese vom Nutzer beauftragte Überarbeitung ergänzt den funktionalen Erstentwurf.

Ausführliche Hilfe: `content/help-details.json` enthält die redaktionell abgeglichenen Abschnitte; `scripts/help_render.py` erzeugt Inhaltsverzeichnisse und Bildpaare. Umfang, bewusste Ausschlüsse und alte Lexikonziele sind in `docs/hilfe-inhaltsabgleich.md` dokumentiert. Die frühere Kurzfassung war keine vollständige Inhaltsmigration.

Veröffentlichungsvorbereitung vom 06.11.2026: Der Assistent erhält die kurzen Wege zur Anfrage; ungeprüfte Entwurfspreise werden nicht ausgeliefert. Für individuelle Leistungen wird ein Angebot angefragt. Prüfstand und Schritte auf dem Zielhost: [Livegang](docs/livegang.md).

Betreiberfreigaben: Bestehende Shoppreise vorerst bestätigt, aktuelle Hilfe bleibt indexierbar. Hetzner-AVV, vorhandene Backups und gespeicherte Weblog-Löschung nach einer Woche dokumentiert. Livegang gemeinsam mit Benjamin und Georgie; Vorschau-Funktion und Mailzustellung sind von Benjamin bestätigt; die abschließende Prüfung nach Produktivumschaltung und konkrete Backup-Kontrolle stehen noch aus.
