# Historische Admin-Hilfelinks

Stand: 05.11.2026, Branch redesign-website. Kein Deployment.

## Quellen und Umsetzung
Inventar: 66 eindeutige Varianten aus altem Admin, AdminNew, showhelp-Fallbacks und alten Zugangs-Mails; geliefert durch den UI-Chat. `content/legacy-help.json` enthält das vollständige Prüfinventar, genaue URLs, native Anker-Aliase und offene Themen. `content/legacy-links.json` enthält die gemeinsam mit dem Inhaltsimport verwendete Slug-Zuordnung. `scripts/legacy_help.py` erzeugt die Apache-Regeln aus diesen Quellen und `content/htaccess.conf`.

Bekannte Altseiten liefern 301 direkt auf den passenden kanonischen Pfad. Bei Produktionshosts simplecommerce.de und www.simplecommerce.de wird zugleich auf HTTPS ohne www verwiesen. Lokale Hosts behalten ihren Ursprung. Keine Live-Anfrage im Test: Produktionshosts werden nur per Host-Header simuliert und Location geprüft, niemals verfolgt. Am Zielhost SSL/VHost-/Proxyregeln zusätzlich prüfen; vorgeschaltete Host-Weiterleitungen können sonst Ketten erzeugen.

Historische Hilfe-URLs sind statische Artikel: ihre Queryparameter werden verworfen (QSD), einschließlich `pop=1` und Kombinationen. Sie steuern keine neue Darstellung. Unbekannte URLs liefern echte 404 statt einer Sammelumleitung. WordPress-ID-Regeln bleiben erhalten.

Fragmente werden nicht an den Server gesendet. Bestehende IDs bleiben erhalten; zusätzliche native IDs stehen an den passenden Abschnitten (CrossSelling/Zubehoer, Merkmale, wawi, produktbilder, neuerKunde). Dadurch funktioniert der Sprung ohne JavaScript nach dem HTTP-Redirect. Keine erfundenen Aliasziele für fehlende Inhalte.

## Offene Fachinhalte
Acht Routen ohne passenden aktuellen Ersatz: Amazon (bewusst entfernt), Artikel-Staffelpreise, eBay, Kelkoo, Lieferantenverwaltung, Shopeinstellungen, Tag-Verwaltung und Preisübersicht. Der kurze Tag-Abschnitt in der Artikelbearbeitung ersetzt keine Tag-Verwaltung. Lieferantenzuordnung ersetzt keine Lieferantenverwaltung. Bis zur fachlichen Ergänzung bleiben diese URLs 404; damit ist die vollständige Inhaltsmigration ausdrücklich noch nicht abgeschlossen.

21 Details fehlen: Preisprotokoll (#preislog) und 20 historische Box-Anker. Der Boxenartikel selbst wird korrekt weitergeleitet, die Spezialabschnitte sind jedoch noch nicht vorhanden. Diese Fälle werden im Prüfbericht als OFFEN markiert, auch wenn der Artikel HTTP 200 liefert.

Falsche Aufrufer im Shop getrennt korrigieren: statimages → Kelkoo, Checkout-Timeline → newsletterbox, Footer → herstellerbox, Währung → schnellsuchebox. Die semantische Bedeutung der Alt-URL richtet sich nicht nach diesen Fehlverweisen. Das historische Logo-GIF ist ein Bildasset und wird nicht auf HTML umgeleitet; dessen separate Assetmigration ist nicht Bestandteil der Artikel-Weiterleitungen.

## Einbettung
Ausdrückliche Nutzerfreigabe vom 05.11.2026: öffentliche statische `/hilfe/` darf in beliebigen HTTP(S)-Shop-Admins eingebettet werden, ohne eine Domainliste pflegen zu müssen. Nur dort wird X-Frame-Options entfernt und CSP frame-ancestors entsprechend gesetzt. Kontakt und alle übrigen Seiten behalten SAMEORIGIN; der Formularendpunkt hat zusätzlich eigenen Schutz. Keine vertraulichen Formulare in den frei einbettbaren Hilfebereich aufnehmen. Vor Livegang prüfen, dass kein vorgeschalteter Server zusätzliche widersprechende X-Frame-Options/CSP-Header setzt.

## Reproduzierbare Prüfung
`python3 scripts/build.py` und `python3 scripts/validate.py` ausführen. Einen Apache 2.4 mit DocumentRoot public, AllowOverride All, mod_rewrite, mod_headers und mod_dir starten. Der lokale Test nutzt http://127.0.0.1:1894; die PHP-Vorschau 1890 wertet .htaccess NICHT aus.

`python3 scripts/test_legacy_help.py --base http://127.0.0.1:1894` prüft alle 66 Fälle, Zielstatus, lokale Herkunft, Produktions-Host-Location, Querybereinigung, HTML-Anker und Einbettungsheader. Unter `/private/tmp/sc-legacy-review/` entstehen HTML-Prüfliste und results.json. Der lokale Apache stellt sie über Alias `/__legacy-review/` bereit, mit noindex/nofollow. Die Liste ist nicht Teil von public und wird nicht deployed. PHP ist auf diesem reinen Redirect-Testserver gesperrt; Kontaktversand weiter auf 1890 testen.

Erwarteter Stand: 58 HTTP-Weiterleitungen, acht bewusste/offene 404, 21 offene Detailanker. „HTTP bestanden“ bedeutet ausdrücklich nicht, dass offene Inhalte bereits ergänzt wurden.

SEO-Grundlage: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes – permanente HTTP-Weiterleitungen für passende Nachfolger, 404/410 bei fehlendem Ersatz, keine pauschalen unpassenden Sammelziele.

Browsernachweis: Merkmale-Altlink wurde nach 301 mit Fragment zur passenden Überschrift geöffnet. Domainübergreifende Einbettung von 127.0.0.1 nach localhost über einen alten Attributlink inklusive #werte erfolgreich. Anker-Aliase erhalten 100 Pixel Scrollabstand zur festen Kopfzeile. Vollständige dauerhafte Linktabelle: [Prüfliste](legacy-hilfelinks-pruefliste.md).
