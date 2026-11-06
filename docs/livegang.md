# Veröffentlichung des Branches codex/live-vorbereitung

Stand: 06.11.2026. Vorbereitung abgeschlossen ist nicht gleichbedeutend mit einer bereits erfolgten Veröffentlichung.

## Inhalt und Preisfreigabe
- Bestehende Shop-Preisliste bleibt erhalten. Der Rechner bildet deren Stufen ab; Shoppreise und Provisionsmodell sind vom Betreiber vor Veröffentlichung zu bestätigen.
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
5. Tatsächliche Hetzner-Log-/Backup-Einstellungen und AV-Vertrag mit den Angaben in `rechtliches.md` abgleichen.
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
