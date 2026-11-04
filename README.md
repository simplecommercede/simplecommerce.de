# simplecommerce.de

Statische Unternehmenswebsite mit Online-Hilfe. PHP wird nur für das Kontaktformular benötigt. Das Layout ist eine funktionale erste Fassung; das endgültige Design übernimmt der Kollege.

## Lokal starten

```sh
python3 scripts/build.py
CONTACT_ENV=development php -S 127.0.0.1:1890 -t public
```

Öffnen: http://127.0.0.1:1890/ . Ausschließlich `public/` als DocumentRoot ausliefern. Ein Aufruf des Generators ersetzt generierte HTML-Dateien; Änderungen an Inhalten im Generator bzw. in `content/` vornehmen. CSS und JavaScript liegen separat unter `public/assets/`.

## Aufbau

- `content/wordpress-public.json`: gesicherter öffentlicher Altbestand, keine DB-Konten oder Einsendungen.
- `content/help-updates.json`: geprüfte neue Hilfeseiten, sobald verfügbar.
- `scripts/build.py`: reproduzierbarer HTML-Build ohne Fremdpakete.
- `public/`: alleiniger Webroot mit statischen Seiten, Assets und Kontakt-Endpunkt.
- `docs/`: Migration, Betrieb, Prüfung und Screenshot-Herkunft.

Originaldump, alte Hilfe und Originaluploads bleiben lokal und sind ignoriert. Keine Dateien daraus pauschal hochladen. Git-Commits erfolgen in fachlichen Teilschritten mit deutschen Beschreibungen.
