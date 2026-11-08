# Technische Aufgaben aus der Abstimmung mit Georgie

Stand: 08.11.2026. Diese Liste dokumentiert die im Chat formulierten WhatsApp-Vorschläge. Sie ist kein Nachweis einer Zusage von Georgie und keine Behauptung, die Änderungen seien bereits implementiert. Die WhatsApp-Texte wurden als Entwürfe erstellt, nicht über WhatsApp versendet.

## Ziel und Priorität

Frosch und Markenidentität erhalten. Große Effekte gezielt einsetzen; Navigation, Lesen und Kontaktaufnahme müssen jederzeit gut funktionieren. Animationen sind ein Feinschliff-Thema; reproduzierbare Bedienblockaden wären vor Veröffentlichung zu beheben. Keine der hier beschriebenen möglichen Schwachstellen ist allein durch diesen Eintrag ein bestätigter Fehler.

## A1 – Große Animation einmal pro Tab-Sitzung

Status: umgesetzt am 08.11.2026 in `site.js` (`window.simplecommerceMotion`, `sessionStorage`-Schlüssel `simplecommerce:motion:v1:<Host>`, Zustände `started`/`done`). Das Budget umfasst Logo-Einstieg und Scheibenbruch; bewusst ausgelöste Reaktionen (Logo-Hover, Frosch-Mimik) bleiben. Bei gesperrtem Speicher, reduzierter Bewegung oder verbrauchtem Budget navigiert der Frosch direkt. Der iframe des Scheibenübergangs verbraucht nichts. Datenschutz und Cookie-Seite ergänzt. Browserprüfung: Logo-Einstieg läuft einmal, danach `claim()` = false. Offen: Beurteilung auf echten Geräten mit Georgie.

Betroffene Stellen: `public/assets/guide.js` (Zielnavigation), `guide-glass.js` (iframe/Scheibenbruch), `site.js` (Logo), zugehörige CSS-Dateien. `guide-core.js` nutzt bereits `sessionStorage` für Fragebogen und Umsatz; diese Daten weder überschreiben noch beim Animationswechsel löschen. Cache-Version im Generator bei Änderungen erhöhen.

## A2 – Navigation darf nicht auf Effekte warten müssen

Status: Empfehlung; vorhandene Fallbacks und Ladebedingungen zuerst prüfen, nicht doppelt implementieren.

- [ ] Große Übergänge kurz halten, keine künstliche zusätzliche Wartezeit nach geladener Zielseite. Dauer mit Georgie auf echten Geräten beurteilen.
- [ ] Bei Ladefehler, Zeitüberschreitung oder abgebrochener Animation normal auf die Zieladresse wechseln. Nach jedem Ausgang Overlays, Scrollsperren, iframe und Animationstimer aufräumen.
- [ ] Doppelklicks und schnelle Zielwechsel dürfen keine mehrfachen Ebenen oder unbedienbaren Seiten erzeugen.
- [ ] Tastaturfokus und sichtbarer Inhalt dürfen nach dem Wechsel nicht auf einem entfernten Overlay bleiben. Bestehende Zurück-/Vorwärts-Navigation erhalten.

Mögliches Problem: Ein aufwendiger Effekt fühlt sich auf einem schnellen Rechner gut, auf einem langsameren Mobilgerät aber wie eine verzögerte Navigation an. Bisher vorhandene reduzierte-Bewegung- und Zeitlimit-Fallbacks gelten als Grundlage, nicht als vollständig neue Anforderungen.

## A3 – Mobile Ansicht, Bewegung und Formular

Status: Empfehlungen und Abnahmeaufgaben, keine pauschal bestätigten Defekte.

- [ ] Auf echten Mobilgeräten prüfen: Frosch, Teich und Effekte verdecken weder Text noch Navigation, Formularfelder oder Absenden. Besonders geöffnete Bildschirmtastatur, Scrollen, Drehung und schmale Viewports berücksichtigen.
- [ ] Touch zum Öffnen, Ziehen und Auswählen klar unterscheiden; kein versehentlicher Seitenwechsel beim Verschieben des Froschs.
- [ ] Während Formulareingaben keine automatisch gestarteten großen Bewegungen. Nachricht, Fokus und Formularzustand bei Interaktionen erhalten.
- [ ] `prefers-reduced-motion: reduce` für Logo, Frosch, Scheibenbruch und CSS-Animationen durchgehend berücksichtigen. Vorhandene Unterstützung auf Lücken prüfen; direkte Navigation statt großem Effekt.
- [ ] Wiederkehrende Logo- und Leerlaufanimationen gemeinsam beurteilen. Wenn sie beim Lesen stören, Frequenz reduzieren oder automatische Wiederholung streichen; bewusst ausgelöste Reaktionen bleiben möglich.

## Abnahme der Animationen

Desktop und echte Mobilgeräte, zusätzlich 375/390 CSS-Pixel: erste Animation, zweiter Seitenwechsel, Reload, Zurück/Vorwärts, gespeicherter/gesperrter Sitzungszustand, reduzierter Bewegungswunsch, langsame/fehlgeschlagene Zielseite, Doppelklick und Formular mit geöffnetem Keyboard. Erfolg bedeutet: keine wiederholte große Animation nach Verbrauch des Budgets, keine verdeckten Hauptaktionen, keine verlorenen Eingaben und immer erreichbare Navigation. Ergebnisse und verbleibende Auffälligkeiten dokumentieren. Änderungen an zustandsabhängiger UI nach dem projektlokalen Adaptive-UI-Skill prüfen.

## D1 – Einen öffentlichen Demoshop wieder bereitstellen

Status: Todo am 08.11.2026 an den bestehenden Chat „UI für Menüpunkte verbessern“ übermittelt (Chat-ID `019fddac-1b81-7063-a089-d906b61428d9`). Keine bestätigte Fertigstellung oder Terminvereinbarung. Laufende Arbeit soll dafür nicht abgebrochen werden.

- [ ] Einen überzeugenden responsiven Demoshop mit fiktiven Produkten vorbereiten. Die vier alten Demos sind laut Benjamin wegen Bildrechten offline; problematische Altbilder nicht wiederverwenden.
- [ ] Ausschließlich eigene beziehungsweise nachweislich freigegebene Bilder nutzen und Herkunft/Nutzungsrechte dokumentieren. Keine realen Kundendaten übernehmen.
- [ ] Desktop und Mobil prüfen: Navigation, Artikeldetails, Varianten und Warenkorb. Demo klar kennzeichnen; echte Zahlungen, echte Bestellungen und externe Mailaktionen unterbinden.
- [ ] HTTPS, endgültige URL und gegebenenfalls neue Screenshots prüfen; Veröffentlichung mit Benjamin abstimmen.
- [ ] Erst nach Freigabe auf `/design-und-layout/` verlinken. Die Angebotsseite bleibt erhalten; die vier Offline-Links sind entfernt.

Dieses Shop-Todo und der Animationsvorschlag sind getrennte Aufgaben. Keine parallelen Änderungen im Website-Repository durch den Shop-Chat ohne Abstimmung.
