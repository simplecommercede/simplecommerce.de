# Arbeitsregeln für simplecommerce.de

Stand: 04.11.2026. Gilt für dieses Repository. Bei Änderungen diese Regeln zusammen mit den zugehörigen Dokumenten aktuell halten.

## Auftrag und Inhalt
- Statische Unternehmenswebsite als Ersatz für WordPress. PHP nur für das Kontaktformular; kein neues CMS oder unnötiger Build-Stack.
- Angebote: Shopsystem, Service, Webseitenerstellung, professionelle IT-Beratung, IT-Projekte und individuelle Software sowie KI-Anwendungen mit eigenem Modelltraining (`/ki-anwendungen/`, einfach formuliert). „IP-Projekte“ war ein Schreibfehler.
- Schritt 1 priorisiert Bedienbarkeit. Der Nutzer hat anschließend eine professionelle Markenüberarbeitung mit Originalorange und Froschmotiven beauftragt; spätere Designarbeit mit dem Kollegen abstimmen. Funktionierende Navigation, Semantik, Tastaturbedienung und responsive Darstellung erhalten.
- Hauptnavigation: Shop, Leistungen, Hilfe, Kontakt. Shop-Preise gehören unter Shop; die bestehende URL `/preise/` bleibt erhalten. Andere Leistungen bekommen individuelle Angebote und verweisen auf Kontakt.
- Grundlegende Bestandsinhalte, Preise, Kontakt und Rechtsseiten erhalten. Keine Preise erfinden. Widersprüchliche Telefonzeiten sowie Preis- und Rechtsinhalte vor Livegang klären; keine vollständige rechtliche Freigabe ohne geklärte Betriebsangaben behaupten. Rechtsquellen und offene Angaben stehen in `docs/rechtliches.md`.

## Dateien und Änderungen
- `scripts/build.py` erzeugt HTML, Sitemap, Weiterleitungen und Seitenindex. Generierte Dateien in `public/` nicht von Hand ändern; Quelle im Generator oder in `content/` bearbeiten und neu bauen.
- `public/assets/site.css`, `public/assets/site.js`, `public/assets/guide.css`, `public/assets/guide.js`, `public/assets/guide-glass.js` und `public/kontakt/senden.php` werden direkt gepflegt.
- Ausführliche Leistungsseiten (Webseiten, IT-Beratung, IT-Projekte, KI-Anwendungen, Service): Zielgruppe, Ablauf, Fragen und verwandte Leistungen in `content/service-details.json`; Darstellung über `service_detail()`/`related_services()` in `scripts/build.py`.
- Aktuelle Hilfe: Metadaten in `content/help-updates.json`, ausführliche Abschnitte in `content/help-details.json`, Darstellung in `scripts/help_render.py`. Aktuelle Rechtstexte: `content/legal/`. Öffentlicher Altbestand: `content/wordpress-public.json`. Screenshotnachweise: `content/screenshots.json`. Bildherkunft: `content/image-provenance.json`.
- Originaldump, `uploads/` und `sec_helpcenter/` bleiben lokale, ignorierte Quellen. Keine Benutzer, Zugangsdaten, Einstellungen oder Einsendungen aus dem Dump übernehmen. `scripts/inventory-wordpress.py` ersetzt den öffentlichen Extrakt; nur bei bewusster Neuübernahme ausführen und Diff prüfen.
- Ausschließlich `public/` ausliefern. Keine SQL-Dumps, internen Dokumente oder veralteten CGI-/Flash-Dateien veröffentlichen.
- Vor Änderungen Arbeitsbaum prüfen und fremde Änderungen erhalten. Fachliche Teil-Commits mit deutschen Texten. Push und Produktivumstellung sind getrennte Aktionen; bisher wurde lokal gearbeitet.

## Admin-Abstimmung und Demodaten
- Der aktuelle Admin liegt im Nachbarprojekt `../shop`; zum bisherigen Arbeitsstand gehört Branch `AdminNew`. Nicht eigenständig dessen Branch wechseln oder parallel dieselben Dateien verändern.
- Abläufe und UI-Fehler mit dem vom Nutzer benannten Chat „UI für Menüpunkte verbessern“ abstimmen. Der Nutzer hat Fragen und direkte Fehlerbehebung gemeinsam mit diesem Chat autorisiert. Andere Shops dürfen als Ablauf-/Gestaltungsreferenz dienen.
- Für Hilfe ausschließlich die separate neutrale Demo auf `http://127.0.0.1:1892/admin2/` verwenden, niemals Aufnahmen aus dem echten 1887-Shop.
- Start im Shoprepo: `bash dev/help-demo.sh start`; Stop: `bash dev/help-demo.sh stop`. Eigene persistente Volumes erhalten; kein `down -v`, keine Neuinitialisierung über vorhandene Daten.
- Fiktive Produkte, Bilder, Kunden und Bestellungen bleiben ausdrücklich bestehen. Keine Kundennamen, Originalprodukte, Bilder, Adressen oder Branding anderer Shops in Texte oder Aufnahmen übernehmen.
- Demo ist eine Admin-Umgebung, keine fertige Storefront. Externe Anbieteraktionen und Mailversand bleiben blockiert. Nicht alle Speicheraktionen sind abgenommen; Details siehe `docs/hilfe-pruefung.md`.

## Hilfe und Screenshots
- Anleitungen anhand des aktuellen sichtbaren Ablaufs prüfen. Historische Funktionen als solche kennzeichnen; keine alte Anleitung ungeprüft als aktuelle Hilfe veröffentlichen.
- Echte Browserausgabe aufnehmen, keine Bedienoberfläche per Bildgenerierung rekonstruieren. Desktop nur Browserinhalt, Mobil echte schmale Ansicht; bisher 390 × 844 CSS-Pixel.
- Vor Aufnahme auf geladene Daten warten; besonders Tabellen und ausgewählte Bestellungen laden asynchron. Auf leere Ansichten, abgeschnittene Inhalte, Bildfehler und Überlappungen prüfen.
- Kein DEV-Banner in den veröffentlichten Aufnahmen. Nur in der neutralen Demo vorübergehend `/admin2/?help_screenshots=1` öffnen, danach mit `help_screenshots=0` beenden. Dies blendet nur den Banner aus; Sicherheits- und Mailblockaden bleiben aktiv.
- Mobile Aufnahmen werden auf Hilfeseiten in wechselnden illustrativen CSS-Handyrahmen gezeigt. `.phone` muss `display:block` behalten; sonst funktioniert der Rahmen am Bildlink nicht. Original-JPEGs enthalten den Rahmen nicht. Rahmen nicht als bestimmtes echtes Gerät oder Hardwaretest bezeichnen.
- Falls Browser-Resize keine echte Mobilbreite erreicht, einen lokalen iframe mit festem Viewport verwenden und tatsächliche Breite prüfen. Hilfsserver/Dateien unter `/private/tmp` sind temporär und keine Projektabhängigkeit.
- Nach Austausch Bilddatei, Herkunftsmanifest und betroffene Anleitung zusammen aktualisieren. Fertige Hilfeseite auf Desktop und Mobil visuell prüfen, nicht nur das Einzelbild. Testdaten und Bildassets erhalten.

## Prüfen und übergeben
```sh
python3 scripts/build.py
python3 scripts/validate.py
php -l public/kontakt/senden.php
git diff --check
```
- Für reine Dokumentationsänderungen keinen unnötigen Neubau durchführen. Dokumentierte Pfade, Befehle und Aussagen mit dem tatsächlichen Stand abgleichen.
- Bei UI-Änderungen zusätzlich Browserprüfung der betroffenen Ansichten. Bei Routingänderungen Apache-Weiterleitungen/404 prüfen; PHPs lokaler Webserver wertet `.htaccess` nicht aus.
- Kontaktformular nur mit fiktiven Daten und lokalem Dateitransport testen. Live-Zustellung nicht aus lokal erfolgreichen Tests ableiten; Konfiguration und Grenzen in `docs/betrieb.md` beachten.
- SEO/GEO: eindeutige Titel/Beschreibungen, Canonicals, Sitemap, semantische Inhalte, interne Links und wahrheitsgemäße strukturierte Daten erhalten. Keine Rankings oder KI-Zitate versprechen.
- `README.md` ist der Einstieg; `docs/migration.md` beschreibt Quellen/URL-Entscheidungen, `docs/betrieb.md` Betrieb/Live-Voraussetzungen und `docs/hilfe-pruefung.md` Screenshotverfahren/Prüftiefe. Bei Änderungen jeweils passende Dokumente mitführen.

## Markenbild
- Markenorange `#ff6600` aus der bisherigen Startseite verwenden, mit Anthrazit und Weiß. Dunklere Orangevariante für kleine Texte auf Weiß.
- Originalfroschmotive aus `uploads/2020/10/` gezielt verwenden; veröffentlichte Kopien und Herkunft stehen in `content/brand-assets.json`. Alte in Bilder eingebrannte Werbeaussagen nicht wieder als aktuelle Zusagen zeigen. Bildausschnitte per CSS erhalten den Originalfrosch.
- Nutzerentscheidung, Startseite bewusst schlank: Leistungen nur als Slider im Kopfbereich (`slider()` in `scripts/build.py`, `[data-slider]` in `site.js`), danach Ablauf, Einblick, „Gut zu wissen“ (Fragen + FAQ) und Kontakt.
- Nutzerentscheidung: Der Frosch-Wegweiser ist verschiebbar und springt nicht von selbst; erst bei einem Ziel aus seinem Menü bricht er durch die Scheibe, und die Scheibe bricht erst, wenn die Zielseite geladen ist (`guide-glass.js`).
- Frosch-Wegweiser (`guide.js`, `guide.css`, Texte zusätzlich in `data-guide`-Attributen; gezeichneter Frosch als SVG) bleibt zusätzlich zur Navigation: alle Ziele müssen auch ohne ihn und ohne JavaScript erreichbar sein; sein Menü zeigt die Leistungen als Seerosenblätter (`.guide-pond`/`.guide-pad`), auf die der Frosch beim Klick springt; keine Browserspeicherung ohne Anpassung der Datenschutztexte.
- Interaktives Logo: Frosch und „e“ liegen als Ebenen über `assets/logo.jpg`, Maul, Lider, Kehle und Zunge als SVG im Generator (`.brand`/`logo-*` in `site.css`, Markup in `scripts/build.py`, `[data-logo]` in `site.js`). Nutzerentscheidung: Demoprodukte (Becher, Rucksack, Leuchte) nicht als Werbebilder verwenden; sie bleiben der Demo-Umgebung und den Hilfeaufnahmen vorbehalten.

## Hilfeumfang und Freigaben
- Vollständige aktuelle Anleitungen mit Inhaltsverzeichnis und abschnittsbezogenen Desktop-/Mobilbildern pflegen; nicht wieder auf wenige Übersichtsschritte kürzen. Inhaltsabgleich: `docs/hilfe-inhaltsabgleich.md`, technische Belege: `docs/admin-hilfe-abgleich.md`.
- Nutzerentscheidung: Amazon vorerst nicht in öffentlichen Anleitungstexten oder eigenen Bildabschnitten erklären. Offene bzw. nicht freigegebene Funktionen intern dokumentieren; öffentliche Hilfe beschreibt nutzbare Abläufe. Keine Funktionsreife durch Retusche von Warnungen vortäuschen.
- Vor Produktaufnahmen zusätzlich warten, bis `#TB_load` und `#TB_overlay` verschwunden sind. Bei dynamischen Tabellen/Formularen auf den eigentlichen Inhalt warten, nicht nur die Überschrift.
