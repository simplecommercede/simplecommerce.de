# Betrieb und Übergabe

## Webserver
Apache 2.4 mit mod_rewrite und AllowOverride FileInfo/Indexes oder gleichwertigen Regeln. DocumentRoot ausschließlich `public/`. PHP 8.2+ für `/kontakt/senden.php`, funktionsfähiger lokaler Mailtransfer-Agent. HTTPS auf der Produktivdomain konfigurieren. Nicht den Projektroot veröffentlichen: Dort liegen die lokalen Migrationsquellen.

## Kontaktversand
Im PHP-Prozess setzen, nicht in öffentlich zugänglichen Dateien:
- `CONTACT_TO`: tatsächlicher Empfänger, z. B. info@simplecommerce.de.
- `CONTACT_FROM`: autorisierte Absenderadresse derselben Domain; der Server muss diese zustellen dürfen.
- `CONTACT_STATE_DIR`: beschreibbarer Ordner außerhalb des DocumentRoots, standardmäßig `var/contact` im Projekt.
- Produktiv weder `CONTACT_ENV=development` noch `CONTACT_TRANSPORT=file` setzen.

Ohne Empfänger/Absender zeigt der Endpunkt ehrlich einen Versandfehler und die direkte E-Mail-Adresse. Kein stiller Datenverlust durch eine vorgetäuschte Bestätigung. Die Mailfunktion bestätigt nur Übergabe an den MTA, nicht Eingang im Zielpostfach. Vor Produktivumstellung eine echte Zustellprobe mit Zustimmung durchführen und SPF/DKIM/DMARC der Absenderdomain prüfen.

Für lokale Tests: `CONTACT_ENV=development CONTACT_TRANSPORT=file CONTACT_TEST_FILE=/absoluter/pfad/ausserhalb/public/testmail.jsonl`. Dieser Modus darf niemals in Produktion laufen. Tests nutzen fiktive Werte und versenden keine E-Mail.

Schutz: serverseitige Typ-/Längen-/E-Mail-Prüfung, erlaubte Themen, keine nutzerbestimmten Empfänger/Betreffheader, Origin-Prüfung, Honeypot, fünf Anfragen pro Stunde und IP. Rate-Limit-Dateien enthalten nur HMAC-Kennungen und Zeitstempel, keine Formulardaten; alte Kennungen werden nach zwei Stunden bei folgenden Anfragen entfernt. Keine Drittanbieter-CAPTCHAs oder Trackingdienste.

## Designübergabe
Schritt 1 priorisiert Bedienbarkeit. Styles: `public/assets/site.css`. Interaktionen: `public/assets/site.js`. Semantik, Formlabel, Tastaturfokus, mobile Tabellen, Hilfesuche und Canonicals bei Designänderungen erhalten. Produktbilder sind eigenständig generierte fiktive Demoassets, keine Kundenprodukte.

## Vor Live-Umschaltung
- Preiswerte und Kontaktzeiten bestätigen (Altseiten widersprechen sich bei Telefonzeiten).
- Rechtsseiten sind aus dem Altbestand erhalten; Datenschutz an den tatsächlichen neuen Betrieb anpassen/freigeben.
- Mailzustellung konfigurieren und Ende-zu-Ende prüfen.
- Domain, HTTPS, 301-Weiterleitungen und 404-Status am Zielhost testen.
- Keine ungeprüften Althilfe-Seiten als aktuelle Anleitung freigeben.
