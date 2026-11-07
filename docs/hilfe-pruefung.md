# Hilfe: Quellen und Prüfung

Stand 04.11.2026. Neue Anleitungen beruhen auf den sichtbaren Feldern und Menüs von AdminNew in der separaten neutralen Demo auf Port 1892. Die alten öffentlichen WordPress-Texte bleiben in `content/wordpress-public.json` als Quelle erhalten. Export-/Backup-Hinweise wurden zusätzlich mit `../shop/docs/offene-features.md` und den aktuellen Templates abgeglichen.

Die Screenshots zeigen echte Browserausgabe, keine nachgezeichnete Oberfläche. Desktopbilder enthalten ausschließlich Browserinhalt. Die ursprünglichen mobilen Bilder zeigen den tatsächlichen Admin-Inhaltsbereich in einem 390 × 844 CSS-Pixel großen iframe. Neue direkte Browseraufnahmen sind unten dokumentiert. Grund: Der verfügbare In-App-Browser hielt beim Fenster-Resize eine Mindestbreite von 685 Pixeln. Die schmale Inhaltsansicht wurde deshalb in einer lokalen Vorschauseite gerendert. Dies ist ein Responsive-Test, kein Test auf echter Smartphone-Hardware. Die zwei wechselnden CSS-Geräterahmen sind illustrativ und behaupten kein bestimmtes Gerätemodell. Die Screenshots sind über Links in Originalgröße abrufbar.

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
- Ursprünglicher Stand vor der Detailüberarbeitung: 24 Kurzartikel und 50 Screenshots. Dieser Umfang war inhaltlich nicht vollständig und wurde durch die unten dokumentierte Detailüberarbeitung ersetzt.
- Mobile Hilfeseite: Inhaltsbreite und Scrollbreite identisch (375 Pixel plus Scrollbar im 390-Pixel-Rahmen), kein Seitenüberlauf. Hilfesuche mit Treffern, leeren Treffern und zurückgesetzter Suche geprüft.
- Kontaktformular lokal mit Dateitransport: GET 405, fremder Origin 403, ungültige Werte/Array/Header-Injektion 422, Honeypot ohne Zustellung, fünf gültige Testmails, sechste Anfrage 429. Kein echter Versand.
- Apache 2.4: alte Hilfe-URL und WordPress-ID liefern 301 auf passende Ziele; Hilfe 200, unbekannte URL 404. Zielhost nach Deployment erneut prüfen.
- UI-Chat meldet abschließend 24 vollständige HTTP-Prüfungen ohne neue Fehlerlogeinträge. Auch arrParents bei eigenen Seiten korrigiert. Shop-Commits: 95fb8c60, 4713ba02, b0a1b0a1, 4a6f4bdf, 2ecc53eb, 16892e77.
- Demo-Grenzen: keine Storefront, keine externen Anbieteraktionen, keine vollständige Prüfung aller Speicheraktionen. PHP-Konfigurationsschreiben im Demo-Bootstrap nicht eingerichtet; Google-Download enthält ohne freigegebene Artikel nur eine Kopfzeile.
- Bildprompts und Dateipfade: content/image-provenance.json.

Nachkorrektur: Verkaufsmanager auf Desktop und Mobil ohne DEV-Banner neu aufgenommen (Demo-eigener help_screenshots-Modus, Mailblockade unverändert). Alle mobilen Rahmen als Blockelement mit Kameraaussparung und unterer Gestenleiste dargestellt.

## Screenshotmodus und Wiederaufnahme
1. Neutrale Demo im Shoprepo mit `bash dev/help-demo.sh start` starten. Bestehende Daten und Volumes behalten.
2. Im Aufnahmebrowser `http://127.0.0.1:1892/admin2/?help_screenshots=1` öffnen. Das demo-eigene Cookie gilt eine Stunde, auch für weitere Ansichten im iframe. Nur `.sc-dev-mail-banner` wird ausgeblendet. Mailblockade und Warnungen nach gesperrten Aktionen bleiben aktiv.
3. Ziel aus `content/screenshots.json` öffnen, auf geladene Felder/Tabellen warten und Desktop bzw. 390 × 844 Pixel breite Mobilansicht aufnehmen. Der während der Erstaufnahme genutzte Hilfsserver auf Port 1891 und Dateien unter `/private/tmp` sind temporär; bei Bedarf neu anlegen. Nur lokale Demo-Inhalte einbetten.
4. Original-JPEGs ersetzen, Herkunftsmanifest und gegebenenfalls Hilfetext anpassen. Die Geräterahmen entstehen auf der Website durch CSS, nicht in den JPEGs. `.phone` benötigt `display:block`; Kameraaussparung und Gestenleiste im gerenderten Ergebnis kontrollieren.
5. Fertige Hilfeseite auf Desktop und Mobil visuell prüfen. Mit `http://127.0.0.1:1892/admin2/?help_screenshots=0` den Modus beenden. Demo bei Bedarf mit `bash dev/help-demo.sh stop` stoppen, niemals Volumes löschen.

Die oben aufgeführten Tests sind Nachweise für den jeweiligen lokalen Stand vom 04.11.2026. Sie bedeuten keine laufende Überwachung und keine vollständige Abnahme aller Adminaktionen. Bei betroffenen Änderungen gezielt erneut prüfen. Der Websitevalidator kontrolliert Struktur und lokale Ziele; er ersetzt keine visuelle Prüfung, keine fachliche Schema.org-Validierung und keine Live-Mailprobe.

Markenüberarbeitung: 59 Seiten erneut strukturell geprüft; Startseite und Warenwirtschaft bei 390 Pixel Rahmenbreite ohne horizontalen Seitenüberlauf. Startseite, Warenwirtschaft und Sicherheit auf Desktop visuell geprüft. Originalfroschmotive per CSS-Ausschnitt eingebunden; Hilfescreenshots und Handyrahmen bleiben erhalten.

## Detailüberarbeitung der Hilfe
Die ausführlichen Anleitungen stehen in `content/help-details.json` und werden durch `scripts/help_render.py` in `scripts/build.py` eingebunden. Metadaten und der bewusst knappe Schnellstart bleiben in `content/help-updates.json`. Alle 23 bisherigen WordPress-Hilfethemen wurden gegen die Altinhalte geprüft und um Fachabschnitte ergänzt. Das Lexikon wird als eigenes zusätzliches Thema erhalten. Die Kapitelzuordnung und bewussten Ausschlüsse stehen in `hilfe-inhaltsabgleich.md`; der Admin-Chat hat den Codeabgleich in `admin-hilfe-abgleich.md` geliefert.

Zusatzaufnahmen umfassen Produktreiter, Bild-Upload, Variantenbestand, Attributwerte, gewählte Mail-/Dokument-/CMS-Vorlagen, Versand-/Zahlungsreiter, Shopdaten, Startseite, Sprachtexte und Bestellbearbeitung. Jede veröffentlichte Ansicht hat eine Desktop- und eine Mobilaufnahme. Bei der visuellen Prüfung gefundene mobile Ladeabdeckungen wurden durch erneute Aufnahme nach Ende von `#TB_load`/`#TB_overlay` beseitigt. Keine Oberfläche nachgezeichnet. Die vollständige Anzahl ergibt sich aus `content/screenshots.json`; Bilder stehen bei den zugehörigen Abschnitten.

Abschluss der Detailüberarbeitung: 60 statische Seiten strukturell geprüft, 0 Fehler und 0 Ankerhinweise. Artikelanleitung: 13 Abschnitte mit Sprungnavigation, Desktop-/Mobilbildern und zusätzlichen Dialogansichten für Upload, Warenwirtschaft, Zubehör und Cross-Selling. Mobile Hilfeseite bei 390-Pixel-Rahmen: 375 Pixel Inhalts- und Scrollbreite, kein horizontaler Seitenüberlauf. Desktop-Bildpaar und CSS-Handyrahmen visuell geprüft. UI-Chat korrigierte die Demo-Bestellanlage (c663343b), bedingte Paketdialoghinweise (d9c9d4d4) und interne Herkunftszeile nur im Screenshotmodus (a96fe509).

Stand nach der Detailüberarbeitung am 04.11.2026: 25 Hilfethemen (23 ausführlich überarbeitete Bestandsartikel, der kurze Produkt-Schnellstart und das neue Begriffs-/Editor-Lexikon), 112 ausführliche Abschnitte und 122 tatsächlich eingebundene Screenshots aus 61 Desktop-/Mobilpaaren. Das Manifest enthält zusätzlich frühere, erhaltene Übersichtsaufnahmen. Die Artikelanleitung enthält 15 Bildpaare; Zubehör- und Cross-Selling-Dialoge wurden nach der ersten Inhaltsabnahme ergänzt. Im öffentlichen HTML der Hilfe kein Amazon-Text.

## Korrektur der Artikelanlage-Aktionsleiste
Am 04.11.2026 meldete der Nutzer versetzte Buttons im mobilen Einstiegsdialog. Im UI-Chat wurde die von mobilen Tabellenregeln betroffene Footerzeile durch eine gemeinsame Aktionsleiste ersetzt. Desktop- und Mobilaufnahme `artikel-anlegen` anschließend aus der neutralen Demo neu erstellt (390 × 844 Pixel mobil); beide Buttons stehen jetzt nebeneinander. Keine Bildretusche, keine Änderung an Demodaten.

## Wiederaufnahme vom 06.11.2026
Die gemeldeten Admin-Korrekturen werden anhand der tatsächlichen Demo auf 1892 neu aufgenommen. Der Browser unterstützt jetzt direkte Viewports; neue Mobilaufnahmen entstehen mit 375 × 812 beziehungsweise 390 × 844 Pixeln ohne Hilfs-iframe. Desktopaufnahmen sind überwiegend 1265 × 712 Pixel, für längere Ansichten auch 1280 × 900; die tatsächlichen Bildmaße stehen im Manifest. Alle Bilder sind echte Browserausgabe ohne UI-Retusche. DEV-Kopf im Demo-Screenshotmodus verborgen; Mailblockade bleibt aktiv.

Erster geprüfter Austausch: 24 Desktop-/Mobilpaare (48 Bilder), darunter Hersteller ohne Ladeoverlay, Artikelreiter/Aktionsleisten, Mehrfach-Bildupload, bestehender Bildplatz, Kundensuche/Neukundenformular, Attributwerte, Sprachen und Google-Export. Artikelliste und Bestand verwenden den erweiterten persistenten Demokatalog mit sechs Produkten. Neue Hilfebildpaare zeigen Artikel-Aktionen, Bildbearbeitung und das geöffnete Neukundenformular. Die dort eingetragenen fiktiven Angaben wurden nicht gespeichert; keine Bestellung und keine E-Mail angelegt.

Bei langen Formularen zeigt ein Bild einen realen Scrollzustand; die mobile Abschlussansicht zeigt insbesondere die vollständige Aktionsleiste. Tabellen dürfen innerhalb ihres Containers scrollen. Ein vollständiger fachlicher Speichertest folgt daraus nicht.

Abschluss: Auch Dokument-, Mail- und CMS-Editor nach Freigabe des Admin-Chats neu aufgenommen. Insgesamt 27 Paare / 54 Bilder aktualisiert oder ergänzt; 128 Screenshots aus 64 Paaren sind eingebunden. Editoraufnahmen zeigen bewusst den Inhaltsbereich und die unteren Aktionen. Die neuen Editor-Footer sind ausgerichtet, der mobile Dokumenteditor nutzt die verfügbare Breite.

Verbleibender Befund, nur dokumentiert: Beim CMS-Editor ist unter dem Inhalt noch eine horizontale Scrollleiste sichtbar. Die sichtbaren Inhalte und Aktionen sind erreichbar; keine Retusche und keine weitere Korrekturrunde in diesem Auftrag. Alle Aussagen betreffen die geprüften Aufnahmen, keine pauschale Fehlerfreiheit sämtlicher Admin-Funktionen.
