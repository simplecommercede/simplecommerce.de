# Hilfe: Quellen und Prüfung

Stand 04.11.2026. Neue Anleitungen beruhen auf den sichtbaren Feldern und Menüs von AdminNew in der separaten neutralen Demo auf Port 1892. Die alten öffentlichen WordPress-Texte bleiben in `content/wordpress-public.json` als Quelle erhalten. Export-/Backup-Hinweise wurden zusätzlich mit `../shop/docs/offene-features.md` und den aktuellen Templates abgeglichen.

Die Screenshots zeigen echte Browserausgabe, keine nachgezeichnete Oberfläche. Desktopbilder enthalten ausschließlich Browserinhalt. Mobile Bilder zeigen den tatsächlichen Admin-Inhaltsbereich in einem 390 × 844 CSS-Pixel großen iframe. Grund: Der verfügbare In-App-Browser hielt beim Fenster-Resize eine Mindestbreite von 685 Pixeln. Die schmale Inhaltsansicht wurde deshalb in einer lokalen Vorschauseite gerendert. Dies ist ein Responsive-Test, kein Test auf echter Smartphone-Hardware. Die zwei wechselnden CSS-Geräterahmen sind illustrativ und behaupten kein bestimmtes Gerätemodell. Die Screenshots sind über Links in Originalgröße abrufbar.

Keine ursprünglichen Shopnamen, Produktbilder, Personen oder Bestelldaten wurden übernommen. Die neutrale Demo enthält fiktive Produkte, Adressen und Bestellungen; Mail- und externe Anbieteraktionen sind gesperrt. Bilder und Demodaten bleiben erhalten.

Prüftiefe: Einstiege, sichtbare Formfelder, ausgewählte Vorlagen und responsive Darstellung geprüft. Keine pauschale End-to-End-Abnahme aller fachlichen Speicher-, Zahlungs-, Export- oder Versandaktionen. Die Anleitungen versprechen keine solche Abnahme. Inaktive Eingaben werden erst nach Auswahl des jeweiligen Objekts bedienbar.

Im UI-Chat gemeldete Probleme: leere Boxen-/Startseitenansicht, abgeschnittene Shopdaten, fehlerhafter Produktbildpfad, mobile Benutzerverwaltung. Diese Ansichten sowie die Sprachenauswahl wurden korrigiert und anschließend neu aufgenommen. Die mobile Benutzerverwaltung zeigt getrennte Berechtigungslisten ohne Überlappung.

## Reproduzierbarkeit
- Demo starten: im Shoprepo `bash dev/help-demo.sh start`.
- Daten bleiben in eigenen benannten Volumes; kein `down -v`.
- Screenshot-Ziele und Datum: `content/screenshots.json`.
- Texte: `content/help-updates.json`; Build: `python3 scripts/build.py`.
- `python3 scripts/validate.py` prüft Seitenüberschriften, Metadaten, JSON-LD, Bildbeschriftungen und lokale Ziele.

## Abschlussprüfung
- 59 statische Seiten: keine Fehler bei internen Zielen, Ankern, Überschriften und strukturierten Daten.
- 24 aktuelle Hilfeartikel, 50 Screenshots aus 25 Ansichten; drei historische Funktionen mit Statushinweis.
- Mobile Hilfeseite: Inhaltsbreite und Scrollbreite identisch (375 Pixel plus Scrollbar im 390-Pixel-Rahmen), kein Seitenüberlauf. Hilfesuche mit Treffern, leeren Treffern und zurückgesetzter Suche geprüft.
- Kontaktformular lokal mit Dateitransport: GET 405, fremder Origin 403, ungültige Werte/Array/Header-Injektion 422, Honeypot ohne Zustellung, fünf gültige Testmails, sechste Anfrage 429. Kein echter Versand.
- Apache 2.4: alte Hilfe-URL und WordPress-ID liefern 301 auf passende Ziele; Hilfe 200, unbekannte URL 404. Zielhost nach Deployment erneut prüfen.
- UI-Chat meldet abschließend 24 vollständige HTTP-Prüfungen ohne neue Fehlerlogeinträge. Auch arrParents bei eigenen Seiten korrigiert. Shop-Commits: 95fb8c60, 4713ba02, b0a1b0a1, 4a6f4bdf, 2ecc53eb, 16892e77.
- Demo-Grenzen: keine Storefront, keine externen Anbieteraktionen, keine vollständige Prüfung aller Speicheraktionen. PHP-Konfigurationsschreiben im Demo-Bootstrap nicht eingerichtet; Google-Download enthält ohne freigegebene Artikel nur eine Kopfzeile.
- Bildprompts und Dateipfade: content/image-provenance.json.

Nachkorrektur: Verkaufsmanager auf Desktop und Mobil ohne DEV-Banner neu aufgenommen (Demo-eigener help_screenshots-Modus, Mailblockade unverändert). Alle mobilen Rahmen als Blockelement mit Kameraaussparung und unterer Gestenleiste dargestellt.
