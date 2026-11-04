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
Bestehende Seiten und URLs werden inventarisiert und durch statische Seiten oder gezielte Weiterleitungen erhalten. Preiswerte aus dem Altbestand unverändert übernehmen; neue Leistungen individuell anbieten, keine erfundenen Preise. Abweichende Kontaktzeiten zwischen Startseite und Kontaktseite vor Veröffentlichung klären. Rechtsseiten aus dem Bestand erhalten und Änderungen der technischen Verarbeitung gesondert prüfen.

## Hilfe und Bilder
Für jedes aktive Hilfethema den tatsächlichen Admin-Ablauf prüfen. Screenshots aus lokalem Admin mit geeigneten Beispieldaten; keine echten Kundendaten veröffentlichen. Desktop nur Browserinhalt. Mobil echte responsive Ansicht in wechselnden zeitgemäßen Geräterahmen. Historische Funktionen nicht als aktuell bewerben. Screenshot-Herkunft, Ansicht, Datum und geprüfter Ablauf werden dokumentiert.

## Suchmaschinen und generative Suche
Semantisches HTML, aussagekräftige Titel und Beschreibungen, kanonische URLs, Sitemap, interne Links und strukturierte Daten zu Organisation, Dienstleistungen und Hilfe. Konkrete Antworten und nachvollziehbare Leistungsbeschreibungen statt unbelegter Versprechen. Keine Garantie für Rankings oder KI-Zitate.

## Teil-Commits
1. Öffentliche Inhalte und Migrationsgrundlage sichern.
2. Website und statische Inhaltsstruktur erstellen.
3. Hilfe und aktuelle Desktop-/Mobilansichten ergänzen.
4. Kontaktversand, Weiterleitungen und Abschlussprüfung.
