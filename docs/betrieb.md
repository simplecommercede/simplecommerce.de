# Betrieb und Übergabe

## Webserver
Apache 2.4 mit mod_rewrite und AllowOverride FileInfo Indexes Options oder gleichwertigen Regeln. `Options -Indexes` benötigt die Options-Freigabe; alternativ diese Direktive in die Serverkonfiguration übernehmen. mod_dir für DirectoryIndex und optional mod_headers für die mitgelieferten Sicherheitsheader verwenden. DocumentRoot ausschließlich `public/`. PHP 8.2+ für `/kontakt/senden.php`, funktionsfähiger lokaler Mailtransfer-Agent. HTTPS auf der Produktivdomain konfigurieren. Nicht den Projektroot veröffentlichen: Dort liegen die lokalen Migrationsquellen.

## Kontaktversand
Im PHP-Prozess setzen, nicht in öffentlich zugänglichen Dateien:
- `CONTACT_TO`: tatsächlicher Empfänger, z. B. info@simplecommerce.de.
- `CONTACT_FROM`: autorisierte Absenderadresse derselben Domain; der Server muss diese zustellen dürfen.
- `CONTACT_STATE_DIR`: beschreibbarer Ordner außerhalb des DocumentRoots, standardmäßig `var/contact` im Projekt.
- Produktiv weder `CONTACT_ENV=development` noch `CONTACT_TRANSPORT=file` setzen.

Ohne Empfänger/Absender zeigt der Endpunkt ehrlich einen Versandfehler und die direkte E-Mail-Adresse. Kein stiller Datenverlust durch eine vorgetäuschte Bestätigung. Die Mailfunktion bestätigt nur Übergabe an den MTA, nicht Eingang im Zielpostfach. Vor Produktivumstellung eine echte Zustellprobe mit Zustimmung durchführen und SPF/DKIM/DMARC der Absenderdomain prüfen.

Für lokale Tests: `CONTACT_ENV=development CONTACT_TRANSPORT=file CONTACT_TEST_FILE=/absoluter/pfad/ausserhalb/public/testmail.jsonl`. Dieser Modus darf niemals in Produktion laufen. Tests nutzen fiktive Werte und versenden keine E-Mail.

Schutz: serverseitige Typ-/Längen-/E-Mail-Prüfung, erlaubte Themen, keine nutzerbestimmten Empfänger/Betreffheader, Origin-Prüfung, Honeypot, fünf Anfragen pro Stunde und Anschluss (IPv6 je /64), 100 insgesamt, entfernte Steuerzeichen, Base64-Mailinhalt. Hinter einem Proxy oder CDN muss der Server die echte Besucheradresse als `REMOTE_ADDR` liefern (`mod_remoteip`), sonst teilen sich alle Besucher dieselbe Sperre. Auf dem Zielhost `display_errors` aus, `expose_php` aus und `ServerTokens Prod` setzen. Rate-Limit-Dateien enthalten nur HMAC-Kennungen und Zeitstempel, keine Formulardaten; alte Kennungen werden nach zwei Stunden bei folgenden Anfragen entfernt. Keine Drittanbieter-CAPTCHAs oder Trackingdienste.

## Designübergabe
Schritt 1 priorisiert Bedienbarkeit. Styles: `public/assets/site.css`. Interaktionen: `public/assets/site.js`. Semantik, Formlabel, Tastaturfokus, mobile Tabellen, Hilfesuche und Canonicals bei Designänderungen erhalten. Produktbilder sind eigenständig generierte fiktive Demoassets, keine Kundenprodukte.

## Vor Live-Umschaltung
- Bestehende Shoppreise sind von Benjamin vorerst bestätigt; bestehendes Modell unverändert lassen. Ungeprüfte Entwurfsbeträge werden nicht veröffentlicht. Feste Telefonzeiten werden bis zur Bestätigung nicht genannt.
- Rechtsseiten werden in `content/legal/` gepflegt. Technische Inhalte wurden am 04.11.2026 aktualisiert; offene Betriebs- und Unternehmensangaben in `docs/rechtliches.md` vor Livegang ergänzen.
- Mailzustellung konfigurieren und Ende-zu-Ende prüfen.
- Domain, HTTPS, 301-Weiterleitungen und 404-Status am Zielhost testen.
- Keine ungeprüften Althilfe-Seiten als aktuelle Anleitung freigeben.

## Lokale Prüfumgebung
Die Website-Vorschau nutzt Port 1890. Der PHP-Webserver verarbeitet `.htaccess` nicht; Weiterleitungen und Fehlerstatus wurden separat unter Apache geprüft. Ein lokaler Kontakt-Testserver kann Port 1893 verwenden. Die Entwicklungs-Origin-Liste erlaubt `http://127.0.0.1:1890` und `http://127.0.0.1:1893`; andere lokale Hosts/Ports sind nicht automatisch erlaubt. Zustands- und Mailtestdateien außerhalb von `public/` ablegen. Testserver anschließend beenden.

Die Hilfe-Demo des Shopprojekts auf Port 1892 ist unabhängig von der Website. Sie wird nicht zusammen mit `public/` veröffentlicht. Start/Stop und Screenshotmodus sind in [Hilfe und Prüfung](hilfe-pruefung.md) beschrieben.

Stand 04.11.2026: lokale Prüfung abgeschlossen; kein Nachweis einer Produktivzustellung oder eines Deployments. Die ursprüngliche Designübergabe wurde durch den Auftrag zur Markenüberarbeitung ergänzt; weitere Abstimmung erfolgt mit dem Kollegen.

Markenüberarbeitung vom 04.11.2026: Originalorange `#ff6600`, Anthrazit/Weiß und fotografische Froschmotive aus dem bereitgestellten Bestand. Startseite und Leistungs-/Themenansichten individueller gestaltet; Herkunft in `content/brand-assets.json`. Diese vom Nutzer beauftragte Überarbeitung ergänzt den funktionalen Erstentwurf.

Redesign vom 05.11.2026, noch nicht mit dem Kollegen abgestimmt und nicht live: Nutzerentscheidung: Die Startseite bleibt schlank. Alle sechs Leistungen stehen gleichwertig als Slider im Kopfbereich, danach folgen Ablauf, Einblick in die Verwaltung, „Gut zu wissen“ und Kontakt; die ausführlichen Inhalte stehen auf den Leistungsseiten. Neue Leistung `/ki-anwendungen/` (KI-Anwendungen und eigenes Modelltraining, Thema auch im Kontaktformular); Leistungsaussagen und Datenschutzfolgen vor Livegang fachlich bestätigen. Das Logo spielt beim Laden und bei Berührung eine Szene mit Zunge ab, das „e“ dreht zusätzlich alle 7 Sekunden. Der Preisrechner steht auf `/preise/`. Er liest seine Stufen aus der Preistabelle (`scripts/build.py`) und nimmt an, dass die Provision auf den gesamten Monatsumsatz der jeweiligen Stufe fällt; bestehende Shoppreise inzwischen von Benjamin vorerst bestätigt. Werbetexte wurden gekürzt, Rechts- und Hilfeartikel bleiben inhaltlich unverändert. Für Werbeansichten nur Aufnahmen ohne Amazon-Reiter und im Ausschnitt ohne die Zeile `Herkunft` verwenden. Der Frosch wird nicht über die Originalhöhe von 204 Pixeln skaliert, alte Banner-Schrift per Ausschnitt oder Maske ausblenden. Nutzerentscheidung: Markenorange `#ff6600` nur als Akzent (Schaltflächen, kleine Details) einsetzen, große Flächen im hellen Ton `#fff5ec` halten. Hauptmenü mit Untermenüs zu den Detailseiten (`NAV_SUB` in `scripts/build.py`). Der Frosch-Wegweiser liegt in `public/assets/guide.js` und `guide.css`, seine Texte stehen dort und in `data-guide`-Attributen. Marketingziel ist die schnelle Kontaktanfrage: Im Helfer und über einen Einstieg im Kontaktformular führt ein Fragebogen (`content/frog-guide.json`) in bis zu zehn überspringbaren Seerosen-Ebenen zur Anfrage. Aus den Antworten entsteht eine Preisschätzung, dieselbe Auswahl nutzt `/preisrechner/` (`content/price-estimate.json`, `released: false`: Entwurfswerte werden nicht ausgeliefert). Die Antworten füllen den Vorlagetext im Kontaktformular und liegen nur im Sitzungsspeicher des Tabs; nach erfolgreicher Rückmeldung wird die Auswahl geleert, die Nachricht bleibt lesbar. Darüber hinaus speichert er nichts im Browser und springt nicht von selbst. Man verschiebt ihn mit Maus, Finger oder Pfeiltasten, dabei weichen Buchstaben, Wörter und Formen aus. Der Teich ist sein Menü. Bei der Wahl eines Ziels bricht er durch die Scheibe (`guide-glass.js`): Die Zielseite lädt im iframe (X-Frame-Options SAMEORIGIN genügt), die Scheibe bricht erst nach dem Laden, danach wechselt die echte Adresse. Bei reduzierter Bewegung oder nach 5 Sekunden Ladezeit erfolgt ein normaler Seitenwechsel. Animationen beachten `prefers-reduced-motion`; ohne JavaScript bleibt aller Inhalt sichtbar.

Hilfe (06.11.2026): Die Anleitungen unter `/hilfe/` bleiben für die Verweise aus den Shops erhalten, Werbeseiten und Navigation führen nicht mehr dorthin. Für Besucher sind sie nur über Direktlinks und Suchmaschinen erreichbar. Benjamin bestätigt: Die aktuellen Anleitungen sollen weiterhin in Suchmaschinen auffindbar sein und bleiben indexierbar.

Fragebogen (06.11.2026): `scripts/fragebogen_baum.js` prüft alle Antwortkombinationen im echten Code und schreibt den nummerierten Baum `docs/fragebogen-baum.md`; nach Änderungen an Fragen, Sätzen oder Preisen erst `scripts/build.py`, dann dieses Skript ausführen. Die Suche im Frosch nutzt `public/assets/search-index.json` (vom Generator erzeugt, wird nur im Browser durchsucht). Das Telefonfeld im Kontaktformular erscheint nur bei Rückrufwunsch und wird von `senden.php` geprüft.

Kurze Wege (06.11.2026): Der Fragebogen endet nach den Fragen zur Sache, weitere Fragen sind freiwillig. Der Preisrechner zeigt nur Fragen und Antworten, die den Preis ändern; es gibt keinen Aufschlag nach Unternehmensgröße. Leistungsseiten verlinken mit `/preisrechner/?thema=…` direkt auf ihr Thema.

## Kontaktvorschau und Rückmeldungen (04.11.2026)
Der PHP-Entwicklungsserver (`cli-server`) akzeptiert seinen exakten lokalen Origin, wenn Host und Client Loopback sind. Ohne explizites `CONTACT_TRANSPORT` prüft er das Formular und meldet einen klar bezeichneten Formulartest ohne Mailversand und ohne Speicherung der Nachricht. Produktive PHP-SAPIs erhalten diese Ausnahme nicht; ihre Origin-Liste und Versandkonfiguration bleiben verbindlich. Explizite lokale Dateitransporttests funktionieren weiterhin wie oben beschrieben.

JavaScript fordert JSON an und zeigt Erfolg/Fehler direkt im Formular. Auch nach Erfolg bleibt die Nachricht lesbar; die Assistentenauswahl wird geleert. Der Entwurf bleibt bei allen Rückmeldungen erhalten, doppelte laufende Übermittlungen werden verhindert. Ohne JavaScript liefert PHP eine gestaltete Rückmeldeseite mit Logo, Navigation und Kontaktlinks. Ein Netzwerkfehler bestätigt keine Zustellung; die Meldung behauptet deshalb keinen sicheren Versandstatus.

## Alte Admin-Hilfelinks (05.11.2026)
Zentrale Zuordnung, iframe-Ausnahme und offene Inhalte: [Historische Hilfelinks](legacy-hilfelinks.md). Nur die öffentliche Hilfe darf nach Nutzerfreigabe domainübergreifend eingebettet werden. Apache-Testport 1894; PHP-Port 1890 verarbeitet keine `.htaccess`. Keine Live-Bereitstellung erfolgt.

## Aktueller Veröffentlichungsstand (06.11.2026)
Die früheren Abschnitte beschreiben die Entwicklung. Maßgeblich für die Auslieferung ist jetzt: `/preisrechner/` zeigt bestehende Shop-Preisbestandteile und bereitet für andere Leistungen eine individuelle Anfrage vor. Bei `released: false` werden keine Entwurfsbeträge ausgeliefert, auch nicht in `guide-data.js`. Gemischte Auswahlen kennzeichnen die bekannten Beträge ausdrücklich als Teilkosten. Der Frosch verwendet dieselbe Regel; seine wichtigste Aktion steht vor den Details.

Die Kontaktseite bietet statt widersprüchlicher Telefonzeiten eine Terminvereinbarung an. Die KI-Seite verspricht kein automatisches Unternehmenswissen durch Training; der konkrete Einsatz wird vorab geprüft. Es gibt noch keine veröffentlichte KI-Trainer-Demo.

CSS und JavaScript bekommen gemeinsam einen Versionsparameter im Generator. Bei folgenden Asset-Änderungen diesen aktualisieren. Verbindliche Schritte auf dem Zielhost und Prüfnachweise stehen in [Livegang](livegang.md).

## Hetzner-Nachweise vom 08.11.2026
AV-Vertrag vorhanden, Backups vom Betreiber bestätigt. Domainweite Weblog-Löschung für Dateien älter als eine Woche gespeichert. Backup-Auswahl belegt 13 Stände vom 24.10. bis 07.11.2026 (25./26.10. fehlen). Sicherungsumfang, Wiederherstellbarkeit und erfolgreiche Log-Bereinigung beim gemeinsamen Livegang mit Benjamin und Georgie kontrollieren. Anbieterangaben und Betreiberbelege sind in `rechtliches.md` getrennt dokumentiert. Vertrauliche Vertrags-/Audit-PDFs nicht in Git oder `public/` ablegen.
