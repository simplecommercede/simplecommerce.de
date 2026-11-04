# Migration simplecommerce.de

## Auftrag
Statische Website mit Shop, Service, Webseitenerstellung, IT-Beratung und IT-Projekten/individueller Software. Preise, Kontakt und bestehende grundlegende Inhalte erhalten. PHP nur für Kontaktversand. Lokale Umsetzung; noch keine Produktivumstellung.

## Quellen
- Lokaler WordPress-Dump `wp_seccom_db0.sql`, veröffentlichtes Hauptblog `wp_posts`.
- Alte Hilfe in `sec_helpcenter/`, ergänzende WordPress-Hilfe unter `/hilfe/`.
- Bestehende Website https://simplecommerce.de/.
- Aktueller Shop-Admin im Nachbarprojekt `../shop`, Branch `AdminNew`.
- Ablaufklärung und UI-Korrekturen über Chat „UI für Menüpunkte verbessern“.

## Veröffentlichungsgrenze
Nur `public/` ist DocumentRoot. SQL-Dump, alte CGI-/Flash-Hilfe, Original-Uploads und interne Dokumentation werden nicht ausgeliefert. Der Dump und Originalbestände bleiben lokal und werden nicht eingecheckt. `content/wordpress-public.json` enthält ausschließlich öffentliche redaktionelle Seiten, keine Benutzer, Einstellungen oder Formulareinsendungen.

## Inhalt und URLs
Bestehende Seiten und URLs sind inventarisiert und durch statische Seiten oder gezielte Weiterleitungen erhalten. `content/legacy-links.json` und der Generator liefern die Regeln in `public/.htaccess`. Preiswerte aus dem Altbestand unverändert übernehmen; neue Leistungen individuell anbieten, keine erfundenen Preise. Abweichende Kontaktzeiten zwischen Startseite und Kontaktseite vor Veröffentlichung klären. Rechtsseiten aus dem Bestand erhalten und Änderungen der technischen Verarbeitung gesondert prüfen.

## Hilfe und Bilder
Für jedes aktive Hilfethema den tatsächlichen Admin-Ablauf prüfen. Screenshots aus lokalem Admin mit geeigneten Beispieldaten; keine echten Kundendaten veröffentlichen. Desktop nur Browserinhalt. Mobil echte responsive Ansicht in wechselnden zeitgemäßen Geräterahmen. Historische Funktionen nicht als aktuell bewerben. Screenshot-Herkunft, Ansicht, Datum und geprüfter Ablauf werden dokumentiert.

## Suchmaschinen und generative Suche
Semantisches HTML, aussagekräftige Titel und Beschreibungen, kanonische URLs, Sitemap, interne Links und strukturierte Daten zu Organisation, Dienstleistungen und Hilfe. Konkrete Antworten und nachvollziehbare Leistungsbeschreibungen statt unbelegter Versprechen. Keine Garantie für Rankings oder KI-Zitate.

## Teil-Commits
1. Öffentliche Inhalte und Migrationsgrundlage sichern.
2. Website und statische Inhaltsstruktur erstellen.
3. Hilfe und aktuelle Desktop-/Mobilansichten ergänzen.
4. Kontaktversand, Weiterleitungen und Abschlussprüfung.

## Umgesetzter Stand (04.11.2026)
59 statische Seiten und 24 aktualisierte Hilfeartikel mit 50 Bildern. Andoo, Shopbackup und Yatego haben eigene historische Statusseiten. Die Hauptnavigation besteht aus Shop, Leistungen, Hilfe und Kontakt. Die Preisliste gilt ausschließlich für den Shop und ist unter Shop als „Shop-Preise“ verlinkt; `/preise/` bleibt aus Gründen der bestehenden Verlinkung unverändert. Neue Leistungen verweisen für Preise auf ein individuelles Kontaktangebot.

SEO-Grundlage im aktuellen Generator: Organization, WebPage (bzw. übergebener Seitentyp) und BreadcrumbList als JSON-LD, individuelle Titel/Beschreibungen, Canonicals und Sitemap. Dies ist keine Garantie für Indexierung, Rankings oder Aufnahme in KI-Antworten.

Die Teil-Commits sind umgesetzt; das Git-Protokoll ist die Quelle für konkrete Revisionen. Die Markenüberarbeitung ergänzt den Erstentwurf; offen bleiben die in `betrieb.md` aufgeführten Schritte vor Veröffentlichung. Öffentliche Alttexte sind als Quelle erhalten; eine rechtliche Abnahme ist damit nicht verbunden.

Markenüberarbeitung vom 04.11.2026: Originalorange `#ff6600`, Anthrazit/Weiß und fotografische Froschmotive aus dem bereitgestellten Bestand. Startseite und Leistungs-/Themenansichten individueller gestaltet; Herkunft in `content/brand-assets.json`. Diese vom Nutzer beauftragte Überarbeitung ergänzt den funktionalen Erstentwurf.

Ausführliche Hilfe: `content/help-details.json` enthält die redaktionell abgeglichenen Abschnitte; `scripts/help_render.py` erzeugt Inhaltsverzeichnisse und Bildpaare. Umfang, bewusste Ausschlüsse und alte Lexikonziele sind in `docs/hilfe-inhaltsabgleich.md` dokumentiert. Die frühere Kurzfassung war keine vollständige Inhaltsmigration.
