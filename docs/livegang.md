# Veröffentlichung des integrierten Website-Stands

Stand: 08.11.2026. Vorbereitung abgeschlossen ist nicht gleichbedeutend mit einer bereits erfolgten Veröffentlichung.

## Inhalt und Preisfreigabe
- Bestehende Shop-Preisliste bleibt erhalten. Der Rechner bildet deren Stufen ab; Benjamin hat die bestehenden Shoppreise vorerst bestätigt; bestehendes Modell bleibt unverändert.
- Keine neuen Preiszusagen: Entwurfsbeträge bleiben in `content/price-estimate.json`, werden bei `released: false` aber vor der Auslieferung aus `public/assets/guide-data.js` entfernt. Zusätzlich blockiert die gemeinsame Berechnung nicht freigegebene Entwurfswerte.
- Individuelle Leistungen führen zu einer Angebotsanfrage. Bei gemischter Auswahl sind bekannte Shopkosten nur Teilkosten; das steht auch im Nachrichtentext.
- Keine unbestätigten Telefonzeiten. Rückrufwünsche werden im Assistenten erfasst; die Telefonnummer wird nur dann aktiviert und zur Pflichtangabe.
- Keine erfundene KI-Trainer-Demo oder Referenz. Die KI-Seite beschreibt die Abstimmung, Umsetzung und Prüfung konkreter Anwendungsfälle.

## Zustände im Anfrageweg
| Zustand | Anzeige und Verhalten |
| --- | --- |
| Keine Antwort | Normales Formular; Assistent freiwillig |
| Nur individuelle Leistungen | Individuelles Angebot, keine Preiszahl |
| Nur Shop-Preisbestandteile | Preisbestandteile aus der bestehenden Liste |
| Gemischte Auswahl | Bekannte Teilkosten plus Hinweis auf separat zu kalkulierende Leistungen |
| Nachricht selbst bearbeitet | Weitere Antworten überschreiben sie nicht; Ersetzen nur per ausdrücklicher Aktion |
| Rückruf abgewählt | Telefonfeld verborgen, deaktiviert, nicht erforderlich; vorherige Nummer gelöscht |
| Versandfehler oder lokale Vorschau | Nachricht bleibt erhalten; kein vorgetäuschter Produktivversand |

## Vor Umschaltung auf Hetzner
1. Nur den Inhalt von `public/` als DocumentRoot veröffentlichen. Kein Repositoryroot, kein Dump und keine internen Dokumente.
2. `CONTACT_TO`, `CONTACT_FROM` und beschreibbares `CONTACT_STATE_DIR` außerhalb des DocumentRoots setzen. Entwicklungstransport und Entwicklungsumgebung deaktivieren. Konfiguration siehe `betrieb.md`.
3. HTTPS, erlaubte Origin-Domain, Apache-Regeln und iframe-Ausnahme ausschließlich für `/hilfe/` prüfen.
4. Eine echte Anfrage zustellen und im Zielpostfach prüfen, einschließlich Antworten an den Absender. Lokale Dateitests ersetzen diesen Schritt nicht.
5. AV-Vertrag und vorhandene Backups sind bestätigt, Weblog-Löschung nach einer Woche ist gespeichert. Beim Livegang Backup-Umfang/Wiederherstellbarkeit und ausgeführte Log-Bereinigung kontrollieren; siehe `rechtliches.md`.
6. Vorherigen DocumentRoot-Stand für eine Rücknahme sichern. Nach Umschaltung Startseite, Shoppreise, Kontakt und einen alten Hilfelink testen.

## Lokale Prüfung
Die regulären Prüfungen stehen in `AGENTS.md`. Der Fragebogen-Test prüft alle Kombinationen, zusätzlich jetzt die Abwesenheit nicht freigegebener Zahlen im öffentlichen Datensatz und den individuellen Angebotswunsch im Nachrichtentext. Browserprüfungen decken Desktop/Mobil, Angebotsweg, Rückruf, eigene Textänderungen und lokale Formularrückmeldung ab. Die tatsächlichen Ergebnisse werden nach Abschluss unten ergänzt.

## Prüfnachweise vom 06.11.2026
- Build: 62 Seiten; Validator: keine Fehler oder Ankerwarnungen; PHP-Syntaxprüfung erfolgreich.
- Fragebogen: 1.057.925 Kombinationen / 230 Kernwege ohne harte Fehler; längster Nachrichtentext 833 Zeichen.
- Browser: Desktop und 375 × 812 Pixel; individuelle KI-Anfrage ohne Preiszahlen, Aktion vor Details, Rückruf aktiv/erforderlich und nach Abwahl deaktiviert/geleert. Eigener Nachrichtentext bleibt bei Änderungen und nach lokaler Vorschau-Bestätigung erhalten.
- Gemischte Auswahl: Shop bei 6.000 € Monatsumsatz = 230 € monatliche Preisbestandteile; zusätzliche KI wird ohne Betrag als separates Angebot ausgewiesen.
- Apache: 66 historische Linkvarianten geprüft, unverändert 58 Weiterleitungen und 8 bewusst nicht ersetzte Ziele. 21 historische Detailanker bleiben offen (Bestandsbefund; siehe `legacy-hilfelinks.md`). Das ist keine vollständige Abnahme aller alten Admin-Kontextlinks.
- Keine echte E-Mail versendet, keine Produktivumstellung vorgenommen.

## Integration vom 07.11.2026

Branch `codex/integration-redesign-live` führt `redesign-website` (aa8aa9b) und `codex/live-vorbereitung` (5d296d1) zusammen. Responsive Gestaltung, vereinfachte Navigation und aufgeteilter Generator stammen aus dem Redesign. Preissperre, Anfrageführung und aktuelle Hilfebilder stammen aus der Live-Vorbereitung. Konflikte im Generator wurden in die neue Struktur und `content/site-texts.json` übertragen; HTML und Fragebogendokumentation werden neu erzeugt. Hilfe bleibt unter ihren bisherigen URLs erreichbar, außerhalb der Werbenavigation und Frosch-Suche.

62 Seiten strukturell fehlerfrei; PHP-Syntax geprüft. Kontaktseite auf Desktop und Mobil geprüft, keine horizontale Überbreite; verborgenes Telefonfeld deaktiviert. Bildmanifest und alle Hilfeaufnahmen unverändert gegenüber dem freigegebenen Hilfe-Branch. Entwurfspreise sind nicht in öffentlichen Preisdaten enthalten. Keine Produktivumstellung.

## Betreiberentscheidungen vom 08.11.2026
- Bestehende Shoppreise vorerst bestätigt; keine Freigabe neuer Entwurfspreise.
- Aktuelle Hilfe bleibt ausdrücklich für Suchmaschinen indexierbar. Historische Entwurfsseiten behalten ihre bisherigen Einschränkungen.
- Livegang gemeinsam mit Benjamin und Georgie; Commit/Push ist keine Freigabe zur eigenständigen Produktivumstellung.
- AV-Vertrag, Backups und gespeicherte Weblog-Löschregel dokumentiert. Für diese Textaktualisierung keine weitere Rückfrage erforderlich. Mailzustellung, Zielhost-Prüfung und konkrete Backup-Kontrolle bleiben technische Schritte beim gemeinsamen Livegang.

Backup-Nachweis ergänzt: Die konsoleH-Auswahl zeigt 13 Stände vom 24.10. bis 07.11.2026; der 25./26.10. ist nicht aufgeführt. Das belegt die angebotenen Wiederherstellungspunkte, nicht deren Inhalt oder einen erfolgreichen Restore. Keine Wiederherstellung ausgeführt.

## Nachträge vom 08.11.2026
- Benjamin bestätigt Funktion und Mailversand der geschützten Vorschau. Spätere Produktivumschaltung und Merge nach main bleiben getrennt.
- SSL ist kostenlos; separater Preisposten und Zuschlag aus Tabelle und beiden Rechnern entfernt.
- Die vier bisherigen Demoshops sind laut Benjamin wegen Bildrechten offline. Ihre Links werden auf `/design-und-layout/` entfernt; die Angebotsseite bleibt bestehen.
- Todo an den Chat „UI für Menüpunkte verbessern“ (019fddac-1b81-7063-a089-d906b61428d9) übermittelt: zunächst einen responsiven Demoshop mit neutralen Produkten und nachweislich freigegebenen Bildern vorbereiten; keine echten Zahlungen oder externen Mailaktionen. Bildherkunft, Desktop/Mobil, HTTPS, Demo-Kennzeichnung und endgültige URL vor Verlinkung prüfen. Veröffentlichung mit Benjamin abstimmen. Bestehende Arbeit soll dafür nicht abgebrochen werden.

## Geplanter Feinschliff mit Georgie
Technische Aufgaben für Animationshäufigkeit, Sitzungsspeicher, mobile Bedienbarkeit und Demoshop: [Animationen und Demoshop-Todos](animationen-und-demoshop-todos.md). Die Liste beschreibt offene Vorschläge und Prüfungen; eine Umsetzung oder Zusage durch Georgie ist damit nicht bestätigt.
