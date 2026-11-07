# Arbeitsregeln für simplecommerce.de

Stand: 08.11.2026. Gilt für dieses Repository. Bei Änderungen diese Regeln zusammen mit den zugehörigen Dokumenten aktuell halten.

## Auftrag und Inhalt
- Statische Unternehmenswebsite als Ersatz für WordPress. PHP nur für das Kontaktformular; kein neues CMS oder unnötiger Build-Stack.
- Angebote: Shopsystem, Service, Webseitenerstellung, professionelle IT-Beratung, IT-Projekte und individuelle Software sowie KI-Anwendungen mit eigenem Modelltraining (`/ki-anwendungen/`, einfach formuliert). „IP-Projekte“ war ein Schreibfehler.
- Schritt 1 priorisiert Bedienbarkeit. Der Nutzer hat anschließend eine professionelle Markenüberarbeitung mit Originalorange und Froschmotiven beauftragt; spätere Designarbeit mit dem Kollegen abstimmen. Funktionierende Navigation, Semantik, Tastaturbedienung und responsive Darstellung erhalten.
- Hauptnavigation: Shop, Leistungen, Kontakt. Shop-Preise gehören unter Shop; die bestehende URL `/preise/` bleibt erhalten. Andere Leistungen bekommen individuelle Angebote und verweisen auf Kontakt.
- Grundlegende Bestandsinhalte, Preise, Kontakt und Rechtsseiten erhalten. Keine Preise erfinden. Widersprüchliche Telefonzeiten sowie Preis- und Rechtsinhalte vor Livegang klären; keine vollständige rechtliche Freigabe ohne geklärte Betriebsangaben behaupten. Rechtsquellen und offene Angaben stehen in `docs/rechtliches.md`.

## Marketingziel
- Nutzerentscheidung: Besucher schnell zur Kontaktanfrage führen. Neue Inhalte und Funktionen daran messen. Wege dorthin: Hauptschaltflächen und Fragebogen im Helfer (`guide-steps.js`), der den Vorlagetext im Kontaktformular füllt (`guide-form.js`). Keine versteckten Zufallsfrösche auf den Seiten.

## Dateien und Änderungen
- `scripts/build.py` erzeugt HTML, Sitemap, Weiterleitungen und Seitenindex; Kopf, Navigation und Fuß stehen in `scripts/site_layout.py`, die Bereinigung des Altbestands in `scripts/wordpress_html.py`, Seitentexte und Shop-Gliederung in `content/site-texts.json`. Generierte Dateien in `public/` nicht von Hand ändern; Quelle im Generator oder in `content/` bearbeiten und neu bauen.
- `public/assets/site.css`, `public/assets/site.js`, `public/assets/guide.css`, `public/assets/guide.js`, `public/assets/guide-glass.js`, `guide-core.js`, `guide-price.js`, `guide-steps.js`, `guide-form.js`, `guide-search.js` und `public/kontakt/senden.php` werden direkt gepflegt.
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
- Nutzerwunsch: Website logisch einfach halten. Untermenü Shop nur Überblick, Preise, Leistungsmerkmale, Shop wechseln; keine zweite Shop-Leiste. Themenseiten bekommen Einleitung und Nachbarthemen aus der Gliederung der Shopseite in `content/site-texts.json`.
- Nutzerentscheidung 06.11.2026: Die Anleitungen bleiben unverändert unter `/hilfe/`, weil bestehende Shops darauf verlinken, und werden nicht in den Admin verlegt. Die übrige Website wirbt damit, was möglich ist, nicht damit, wie es geht: kein Hilfe-Menüpunkt, keine Admin-Screenshots auf Werbeseiten, keine Hilfeseiten in der Frosch-Suche. Alte Hilfelinks und ihre Weiterleitungen nicht ändern.
- Anleitungen anhand des aktuellen sichtbaren Ablaufs prüfen. Historische Funktionen als solche kennzeichnen; keine alte Anleitung ungeprüft als aktuelle Hilfe veröffentlichen.
- Echte Browserausgabe aufnehmen, keine Bedienoberfläche per Bildgenerierung rekonstruieren. Desktop nur Browserinhalt, Mobil echte schmale Ansicht; 375 × 812 oder 390 × 844 CSS-Pixel; tatsächliche Maße im Screenshotmanifest dokumentieren.
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
- Nutzerentscheidung, Startseite bewusst schlank: Leistungen nur als Slider im Kopfbereich (`slider()` in `scripts/build.py`, `[data-slider]` in `site.js`), danach Ablauf, „Gut zu wissen“ (Fragen + FAQ) und Kontakt.
- Nutzerentscheidung: Der Frosch-Wegweiser ist verschiebbar und springt nicht von selbst; erst bei einem Ziel aus seinem Menü bricht er durch die Scheibe, und die Scheibe bricht erst, wenn die Zielseite geladen ist (`guide-glass.js`).
- Fragebogen als Seerosen-Ebenen: Fragen und Aussagen pflegen in `content/frog-guide.json` (Prüfung im Generator), `public/assets/guide-data.js` wird daraus erzeugt. Die Antworten bleiben im Sitzungsspeicher auf dem Gerät; das steht auf der Cookie-Seite und in `content/legal/datenschutz.html`. Bei Änderung beides anpassen.
- Nutzerentscheidung: Der Frosch-Helfer wandert nicht über die Seite, er springt nur. Sein Aussehen folgt dem Rotaugenlaubfrosch der Markenbilder (rote Augen mit senkrechter Pupille, limettengrün, blaue Flanken, orange Haftscheiben), bleibt aber als animierbares SVG in `guide-core.js` gezeichnet.
- Frosch-Ausbau (Nutzerwunsch): Suche im Teich über `assets/search-index.json` (vom Generator erzeugt, nur im Browser durchsucht, ohne Scheibenbruch), Fragebogen überspringt auf Leistungsseiten die Themenfrage und zeigt den Preis live, Mimik nur an Ort und Stelle (Freude, Fliege einmal je Seite, Nickerchen).
- Nutzerentscheidung: Die Texte des Fragebogens sind der Grundstein der angebotenen Produkte. Alle Varianten prüft `scripts/fragebogen_baum.js`, das auch den nummerierten Baum `docs/fragebogen-baum.md` schreibt. Bausteinnummern (`nr`) bleiben fest, neue Antworten ans Ende einer Frage. Nach jeder Änderung an Fragen, Sätzen oder Preisen erst `build.py`, dann dieses Skript ausführen: `docker run --rm -v "$PWD:/w" -w /w node:22-slim node scripts/fragebogen_baum.js`.
- Nutzerwunsch: Gewählte Antworten lassen sich im Fragebogen wieder abwählen (zweiter Klick auf das Blatt, „Abwählen“ in der Zusammenfassung).
- Nutzerwunsch: Fragebogen logisch und einfach halten. Antworten mit `hideIf` entfallen, wenn sie einer früheren Antwort widersprechen; bleibt bei einer Folgefrage keine echte Wahl, entfällt sie. Es gibt nur einen Zusatzwunsch. Aussagen mit `closing` sind Kontaktwünsche und bilden den Schlusssatz des Vorlagetexts. Das Telefonfeld erscheint nur bei `askPhone`. Das Thema läuft über `/kontakt/?thema=…`, nicht über weitere Browserspeicherung.
- Nutzerentscheidung: Wege zu Ergebnis und Infos kurz und flott halten. Der Fragebogen endet nach den Fragen zur Sache; weitere Fragen sind freiwillig. Der Preisrechner zeigt nur Fragen und Antworten, die den Preis ändern, ohne Aufschlag nach Unternehmensgröße. Das Kontaktformular steht vor den Kontaktdaten.
- Preisschätzung: Frosch, Kontaktformular und `/preisrechner/` rechnen gemeinsam in `guide-price.js`. Shopkosten kommen aus der Preistabelle; Werte in `content/price-estimate.json` mit `source: "entwurf"` sind Platzhalter, keine zugesagten Preise. Solange `released: false`, entfernt der Generator sämtliche Entwurfsbeträge aus den öffentlichen Daten und liefert nur „auf Anfrage“. Die Laufzeitberechnung sperrt diese Werte zusätzlich. Erst nach fachlicher Prüfung aller Entwurfswerte `released` auf `true` setzen. Teilpreise aus der Shop-Preisliste dürfen bei gemischten Anfragen nie als vollständiger Projektpreis erscheinen. Der Vorlagetext folgt immer der Reihenfolge der Fragen. Nutzerwunsch: Preise realistisch und einfach halten; „unschlagbar“ nicht ohne belegten Marktvergleich als Werbeaussage verwenden.
- Frosch-Wegweiser (`guide.js`, `guide.css`, Texte zusätzlich in `data-guide`-Attributen; gezeichneter Frosch als SVG) bleibt zusätzlich zur Navigation: alle Ziele müssen auch ohne ihn und ohne JavaScript erreichbar sein; sein Menü zeigt die Leistungen als Seerosenblätter (`.guide-pond`/`.guide-pad`), auf die der Frosch beim Klick springt; keine weitere Browserspeicherung ohne Anpassung der Datenschutztexte.
- Interaktives Logo: Frosch und „e“ liegen als Ebenen über `assets/logo.jpg`, Maul, Lider, Kehle und Zunge als SVG im Generator (`.brand`/`logo-*` in `site.css`, Markup in `scripts/site_layout.py`, `[data-logo]` in `site.js`). Nutzerentscheidung: Demoprodukte (Becher, Rucksack, Leuchte) nicht als Werbebilder verwenden; sie bleiben der Demo-Umgebung und den Hilfeaufnahmen vorbehalten.

## Hilfeumfang und Freigaben
- Vollständige aktuelle Anleitungen mit Inhaltsverzeichnis und abschnittsbezogenen Desktop-/Mobilbildern pflegen; nicht wieder auf wenige Übersichtsschritte kürzen. Inhaltsabgleich: `docs/hilfe-inhaltsabgleich.md`, technische Belege: `docs/admin-hilfe-abgleich.md`.
- Nutzerentscheidung: Amazon vorerst nicht in öffentlichen Anleitungstexten oder eigenen Bildabschnitten erklären. Offene bzw. nicht freigegebene Funktionen intern dokumentieren; öffentliche Hilfe beschreibt nutzbare Abläufe. Keine Funktionsreife durch Retusche von Warnungen vortäuschen.
- Vor Produktaufnahmen zusätzlich warten, bis `#TB_load` und `#TB_overlay` verschwunden sind. Bei dynamischen Tabellen/Formularen auf den eigentlichen Inhalt warten, nicht nur die Überschrift.

## Historische Hilfelinks
- Slug-Zuordnung in `content/legacy-links.json`, genaue URLs/Anker und vollständiges Admin-Inventar in `content/legacy-help.json`. `scripts/legacy_help.py` erzeugt daraus `.htaccess`; Basisregeln in `content/htaccess.conf`. Keine generierten Redirects von Hand bearbeiten.
- HTTP-Tests mit `python3 scripts/test_legacy_help.py --base http://127.0.0.1:1894`; PHP-Vorschau 1890 wertet `.htaccess` nicht aus. Keine unpassenden Sammelweiterleitungen.
- Nutzerfreigabe 05.11.2026: Nur öffentliche `/hilfe/` darf ohne Domainliste in beliebigen HTTP(S)-Shop-Admins eingebettet werden. Kontakt und andere Seiten behalten Einbettungsschutz.

## Veröffentlichungsvorbereitung vom 06.11.2026
- Keine festen Telefonzeiten ohne Bestätigung nennen; stattdessen einen Gesprächstermin anbieten.
- Ergebnis des Fragebogens: Aktion „Anfrage ansehen“ vor der Zusammenfassung, Absenden ausschließlich im Formular. Ausgeblendete Telefonnummer deaktivieren; selbst bearbeitete Nachrichtentexte erhalten.
- Betriebsfreigabe und konkrete Restschritte: `docs/livegang.md`. Ein erfolgreicher lokaler Test ist kein Zustellnachweis auf Hetzner.

## Bestätigungen vom 08.11.2026
- Bestehende Shoppreise vorerst bestätigt; Entwurfswerte für individuelle Leistungen weiterhin gesperrt.
- Aktuelle Hilfe bleibt auf ausdrücklichen Nutzerwunsch indexierbar.
- Hetzner-AVV und vorhandene Backups belegt; Weblog-Löschung älter als eine Woche vom Nutzer gespeichert. Details und Grenzen in `docs/rechtliches.md`.
- Livegang ausschließlich gemeinsam mit Benjamin und Georgie; Push bedeutet keine Deploymentfreigabe.
