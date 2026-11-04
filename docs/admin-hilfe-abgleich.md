# Fachlicher Abgleich der AdminNew-Hilfe

Stand: 2026-11-04. Codeabgleich, KEINE neue vollstaendige Browserabnahme.
Repository: /Users/benjamin.bartels/develop/shop, Branch AdminNew.
Keine Website-Dateien oder Demodaten geaendert. Keine neuen UI-Fixes in diesem Audit; deshalb keine bestehenden Screenshots wegen dieses Audits zu ersetzen.

## Leseschluessel und Quellen

Alle relativen Codepfade unten beziehen sich auf /Users/benjamin.bartels/develop/shop.
`T/` = secure/smarty/admin_new/, `J/` = www/admin_new/js/,
`E/` = secure/classes/event/object/simplecommerce/.
Alte Hilfe: /Users/benjamin.bartels/develop/simplecommerce.de/sec_helpcenter/.
Ergaenzende Altquelle: /Users/benjamin.bartels/develop/simplecommerce.de/content/wordpress-public.json
(strukturierte Datensaetze mit ID, post_name, post_title, post_content).
Relevante WordPress-IDs: 192 Artikel Attribute, 199 Artikelliste, 202 Artikel anlegen,
211 Boxen, 214 Dokumentvorlagen, 220 Emailvorlagen, 241 Shopdaten, 244 Sprachen, 250 Verkaufsmanager.
Diese Alttexte sind Umfangsreferenz, NICHT ungeprueft aktuelle Funktionszusagen.

Demo-Basis B = http://127.0.0.1:1892/admin2/index.php
Fuer Aufnahmen zuerst /admin2/?help_screenshots=1 oeffnen.
Dieser Modus versteckt nur den Entwicklungs-Mailbanner, schaltet KEINEN Mailversand frei.
Demo hat keinen vollstaendigen oeffentlichen Shop. Produkt-Vorschau oder externe Anbieter nicht als erfolgreich getestet darstellen.
Konfigurationsdateien sind in dieser Demo read-only: Konfigurations-Speichern nicht als abgenommen darstellen.
Vorhandene Beispiele erhalten, nicht neu initialisieren. Desktop ist Hauptansicht.

## Artikel anlegen: vollstaendiger Aufnahmeplan

Einstieg B?add=showshopproduktliste, Plus/Neuen Artikel verwenden.
Nicht direkt `showshopeditprodukt` ohne ProduktID aufrufen: Event verlangt ID (E/event_object_simplecommerce_showshopeditprodukt.php:44).
Alte Hilfe _help_artikel_anlegen.html beschreibt Artikelnummer/Titel, Vorlage, Weiter und anschliessend die Detailtabs.
Neue Produktanlage deshalb als eigenen Schritt vor den Tabs aufnehmen, nicht nur fertige Artikelliste zeigen.

Bestehender neutraler Artikel: B?add=showshopeditprodukt&ProduktID=1&tab=TAB.
Artikel 1 Keramikbecher Salbei, 2 Canvas-Rucksack Sand, 3 Tischleuchte Terrakotta.
Die folgenden elf Tabs stehen in T/shopeditprodukt.tpl:250-262. DOM-Link jeweils `TAB_a`.

| Sichtbarer Tab / Parameter TAB | Pflichtinhalt der Anleitung und Aufnahmen | Codebeleg |
| --- | --- | --- |
| Artikeldaten / artikeldaten | Aktiv/Zeitraum; Artikelnummer; EAN/ISBN; Hersteller und Lieferant auswaehlen, anlegen/bearbeiten; technisches PDF | T/shopeditprodukt.tpl:270-380 |
| Preise & Werte / preise | Netto/Brutto und Steuer; Bestand/Warenwirtschaft; Menge-0-Deaktivierung; Warenwirtschaft deaktivieren; Dropshipping; Gewicht, Packmasse, Mengeneinheit/Grundpreis; UVP; immateriell/Download; Zustand; Kundenuploads und Pflichtupload | T/shopeditprodukt.tpl:388-590 |
| Artikeltexte / artikeltexte | Sprache; Schlagwort/Titel, Metadaten; Beschreibung 1-4 und Beschreibungsnummer/Tabtext; visueller Editor und HTML; speichern | T/shopeditprodukt.tpl:596-680 |
| Artikelbilder / artikelbilder | Bestehendes Bild und Uploaddialog getrennt aufnehmen; Galeriebild, Alternativtext, Merkmalbilder; Audio-/Video-Slots getrennt erklaeren | T/shopeditprodukt.tpl:689-790; J/messagefader.js:160 ff. |
| Kategorien / kategorien | Zuordnen/entfernen; neue Kategorie; mehrere Zuordnungen nicht mit Kategorie selbst loeschen verwechseln | T/shopeditprodukt.tpl:795-805 |
| Zubehoer / darstellung | Attributset; Zubehoer anzeigen + bearbeiten; Crossselling + bearbeiten; Farbe/Geschlecht/Altersgruppe | T/shopeditprodukt.tpl:1220-1300 |
| Merkmale / merkmale | Merkmaltyp und Werte erstellen/auswaehlen; zu Produkt hinzufuegen; Variantenwerte, Preise/Bestand/Bilder bearbeiten; speichern | T/produktmerkmale.tpl:40 ff.; T/shopeditprodukt.tpl:1195-1215 |
| Amazon / amazon | Amazonpreis Netto/Brutto, ASIN, Marke, Designer, Bulletpoints 1-5, BrowseNode, Bearbeitungszeit, Kategorie/Bekleidungsart; als Bestandsfelder dokumentieren, NICHT als funktionierenden Export verkaufen | T/shopeditprodukt.tpl:905-1063 |
| Export Einstellungen / export | Produktfreigaben fuer Kanaele; Freigabe ist noch keine Uebertragung. Anbieter und globale Einrichtung getrennt erklaeren | T/shopeditprodukt.tpl:1066-1190 |
| Sonstiges / sonstiges | Einkaufspreis, Energieklasse, freie Felder 1-5, Zusatzmail bei Bestellung; bedingte MehrData-Angaben | T/shopeditprodukt.tpl:809-902 |
| Tags / tags | Vorhandene Tags zuordnen und speichern; separate Tags-Verwaltung nicht mit Produktzuordnung verwechseln | T/shopeditprodukt.tpl:1305; T/tags.tpl |

Wichtige Bedingungen:
- Merkmale-Tab nur sichtbar, wenn ProduktAttributSetID als Integer 0 ist (T/shopeditprodukt.tpl:256). Merkmale und Attributset nicht als beliebig gleichzeitig nutzbar beschreiben.
- Varianten koennen Preisfelder des Hauptprodukts deaktivieren. Produkt-Event ermittelt MIN(Preis) der Varianten (E/event_object_simplecommerce_showshopeditprodukt.php:63 ff.). Nicht behaupten, Hauptpreis sei immer unabhaengig editierbar.
- Bilderzahl haengt von MAXIMAGES_PRO_PRODUKT ab; alte pauschale Aussage zehn Bilder nicht als universelle Grenze uebernehmen (T/shopeditprodukt.tpl:696).
- Audio/Video-Slots 10/11 existieren im Template; das ist keine Zusage beliebiger Medienformate oder einer modernen Streamingfunktion.
- Zusatzmail: Leerwert bedeutet keine weitere EMail; Systemvorlagen und ID 0 werden nicht angeboten (T/shopeditprodukt.tpl:879-886).
- Produkt-Neuanlage, Upload, Bestandsaenderung und Speichern sind echte Schreibaktionen auch in einer Demo. Nur neutrale Beispiele verwenden.

Konkrete Unteransichten:
- Merkmale: B?add=showmerkmaleedit&ProduktID=1&PROZENT=19 (der Produktdialog berechnet PROZENT selbst; keine abweichende Steuer erzwingen).
- Tags: B?add=showadmintags&table=Produkt&subKeyName=ProduktID&subKeyValue=1.
- Zubehoer: B?add=showiframe&nextadd=showzubehoeredit&ProduktID=1.
- Crossselling: B?add=showiframe&nextadd=showcrosssellingedit&ProduktID=1.
- Im echten Produktdialog die zugehoerigen Buttons benutzen, damit Modalrahmen und Elternkontext vorhanden sind. Direktrouten dienen der Orientierung.
Belege: T/shopeditprodukt.tpl:1306,1356; J/messagefader.js:119-133.
- Abschluss separat aufnehmen: als Vorlage, speichern, speichern und zur Liste, Vorschau, zur Artikelliste (T/shopeditprodukt.tpl:1320-1331).

## Attribute: nicht auf eine Set-Auswahl verkuerzen

Altquelle WordPress ID192 beschreibt Set, Obergruppe, Gruppe, Attribut, Zuordnung, Berechnung und Werte vollstaendig.
Einstieg B?add=showattribute&ProduktAttributSets:ProduktAttributSetID=1.
Demo: Geschenkverpackung; IDs Set/Obergruppe/Gruppe/Attribut jeweils 1; Werte Ohne Geschenkverpackung und Geschenkpapier Salbei.
Aufnahmen: Set anlegen/auswaehlen; Preis-Darstellung netto/brutto; Auswahlfelder; hinzugefuegte Zuordnung; Werte-Overlay; Vorschau; Produktzuordnung unter Zubehoer.
Set duplizieren/loeschen ist eine eigene Aktion; Wiederverwendung eines Sets bedeutet Auswirkungen auf mehrere Produkte.

Zuordnungstabelle (T/attribute.tpl:320-382):
- Pflichtfeld; Zwischensumme ausgeben; Runden; Multiplikator; Rechnung; Addieren; Anzeige; Werte; Zuordnung entfernen.
- Rechnung ist ohne Multiplikator deaktiviert. Optionen: Zwischensumme(EUR), Multiplikator Menge.
- Werte-Overlay: Bezeichnung, Multiplikatormenge, Preis(netto), Keyword, wenn Regel, Standard, Bild (T/attribute_werte.tpl:52-87).
- Standard ist ein Radiofeld fuer EINEN vorausgewaehlten Wert dieser Werteliste, kein globaler Shopstandard.
- Wenn Regel wird nur mit vorherigen Werten angeboten, sonst fehlt die Selectbox. Keine frei programmierbare Bedingungssprache versprechen.
- Werte-Preis bleibt netto, auch wenn das Set brutto dargestellt wird.
- Runden ist konkret auf zwei Nachkommastellen implementiert; alte Formulierung auf letzte Ziffer korrigieren.
- Grundberechnung Preis * (int)Menge; Mengenmultiplikator nutzt zuvor gespeicherte Menge, Geldmultiplikator vorherige Zwischensumme. Nicht pauschal freie Dezimalmultiplikatoren versprechen.
- Addieren steuert Aufnahme in die Rechnungssummen. Anzeige und Berechnung sind getrennte Einstellungen.
Rechenbeleg: E/event_object_simplecommerce_attributrechnung.php:190-244.
Die genaue Geldberechnung fuehrt intern getrennte Zwischenwerte; komplexe Prozentbeispiele vor Veroeffentlichung mit Vorschau bestaetigen, nicht aus Spaltennamen erfinden.

Werte-Route: B?add=showiframe&nextadd=showattributwerte&ProduktAttributSetID=1&ProduktAttributOberGruppenID=1&ProduktAttributGruppenID=1&ProduktAttributID=1.
Vorschau: B?add=showiframe&nextadd=showattributvorschau&ProduktAttributSetID=1.
Sortieren: nextadd=showatttributsetsortieren (drei t im Eventnamen!) und ProduktAttributSets:ProduktAttributSetID=1.
Belege: J/attribute.js:103-150; J/messagefader.js:74-80,403-421.

## Verkaufsmanager: Arbeitsablaeufe statt nur Uebersicht

Altquelle _help_verkaufsmanager.html:46-192, WordPress ID250. Einstieg B?add=showverkaufsadmin.
Neutrale Bestellungen: KundenID1..6, BestellID jeweils1, RN10001..10006. Bestellung wird durch KundenID UND BestellID identifiziert!
Filter fuer einen Kunden: B?add=showverkaufsadmin&KundenID=1, danach Position in der Liste anklicken.
Nicht versprechen, BestellID=1 allein oeffne die richtige Bestellung. Wiederladen einer Position nutzt LoadKundenID, LoadBestellID, LoadProduktID, LoadAutoID, LoadMerkmalValueID, LoadPreis (T/verkaeufe_tabelle.tpl:60-73).

Screenshot-/Anleitungsschritte:
1. Liste suchen/filtern, Statusfilter, Sortierung und Feldauswahl zeigen.
2. Bestellung/Position auswaehlen: Bestelldaten, Brutto/Netto/Steuer/Rabatt, Versand/Zahlung, Tracking, Kundendaten und beide Adressen.
3. Positionsdetails und Bearbeitung, Produkt hinzufuegen, Menge/Preis; speichern und Ergebnis zeigen. Keine bezahlte Bestellung fuer willkuerliche Beispielaenderungen nehmen.
4. Historie und Statusprotokoll getrennt von aktuellem Status erklaeren.
5. Status aendern: Auswahl und Rueckmeldung; externe Versandmeldung ist NICHT durch lokalen Screenshot getestet. Fehler darf nicht als erfolgreicher Versand dokumentiert werden.
6. Mail auswaehlen, Vorschau/Editor, Empfaenger/Betreff/Anhang, Sendeaktion. Demo blockiert Transport; keine zugestellte Mail behaupten.
7. Dokument auswaehlen, auftragsbezogene Vorschau/PDF. Gutschein-Dokument braucht Gutschein-Kontext; Demo Lieferschein ist kein Gutschein.
8. Paket/Adress-Export, Anbieterwahl, Download; Trackingimport mit passender Text-/CSV-Datei, nicht PDF-Label hochladen.
9. Excel-/CSV-Listenexport getrennt von Paketdienstexport.
10. Split/Merge/Loeschen als gesonderte, bestaetigungspflichtige Aktionen mit passenden Beispielen. Keine universelle Freigabe fuer externe/bezahlte Bestellungen behaupten.

Code: T/verkaeufe.tpl:94-609; J/bestellungen.js:35 ff.,599-603; T/verkaufe_adressexport.tpl.
Paketdialog: B?add=showiframe&nextadd=showadressexport (J/messagefader.js:63).
Excel: B?add=showverkaufsadmin&excel=1; CSV zusaetzlich &csv=1 (T/verkaeufe.tpl:506-507).

### Manuelle Bestellung

Einstieg B?add=showbestellunganlegen (Plus im VKM; J/messagefader.js:194).
Schritte/Tabs: Kunde (`Kunde_a`), Artikel (`Arikel_a` - Tippfehler ist aktuelle DOM-ID), Adressen (`Adressen_a`), Zahlung (`Zahlung_a`), Versand (`Versand_a`).
Tabs laden Inhalte ueber JS; nicht nur ein &tab anhaengen und Erfolg annehmen.
Kunde auswaehlen/anlegen, Artikel/Variante/Menge und Attribute, Rechnungs-/Lieferadresse, Zahlung, Versand, Warenkorb/Summen und Abschluss separat fotografieren.
Code: T/bestellunganlegen.tpl:22,55-59; J/bestellunganlegen.js; T/bestellunganlegen_*.
In Demo Vorkasse und Standardversand verwenden, keine realen Anbieterzugriffe/Erstattungen erzeugen.

## Mail- und Dokumentvorlagen

Alte Kapitel _help_emailvorlagen.html und _help_dokumentvorlagen.html, WordPress220/214 bleiben inhaltlich relevant, aber Editorbilder ersetzen.
Mailbeispiel: B?add=showmailtemplateadmin&Sprache=de&MailTemplateID=1.
Dokumentbeispiel: B?add=showdocumenttemplateadmin&Sprache=de&MailTemplateID=2.
Die Demo-Vorlagen sind einfache neutrale Beispiele, nicht vollstaendige produktive Rechts-/Rechnungsvorlagen.

Mail-Aufnahmen: neue Vorlage/Name, Auswahl/Sprache/Systemvorlage, Name/Cc/Bcc, Status setzen, Dokumentanhang und PDF, Vorschau-Haken, Replacer/Befehle, Betreff, HTML-Inhalt, Textemail, Textmail automatisch generieren, speichern.
Code: T/mailtemplateadmin.tpl:202-267,289-402.
Dokument-Aufnahmen: neue Vorlage/Auswahl, Name, Status setzen, PDF und PDF im Hintergrund, Replacer/Befehle, HTML-Inhalt, Vorschau/speichern.
Code: T/documenttemplateadmin.tpl:160-207,228-287.
Wichtig: Status setzen ist eine fachliche Folgeaktion, nicht nur eine Beschriftung. Nicht unbedacht in Demonstrationen aktivieren.
Vorlagensyntax, Platzhalter, Bedingungen und Links exakt erhalten. Keine erfundenen Replacer aus Beispielen der alten Hilfe ableiten; aktuelle Replacer-Liste nutzen.
HTML und Textemail sind getrennte Inhalte. Textmail nach HTML-Aenderungen kontrollieren.
SPAW ist im neuen Admin durch Editoradapter ersetzt; alte spaw1_obj-Methodennamen in Templates sind kein Beleg fuer alten sichtbaren Editor.
Systemvorlagen nicht als beliebig loeschbare Vorlagen darstellen; alte Warnung bleibt fuer Anleitung relevant.

## Shopdaten, Texte und RSS

Einstieg B?add=showshopdatenadmin&tab=firmendaten.
Aktuelle Tabs: firmendaten Firmendaten, email Emails, bankdaten Bankdaten, steuer Steuer, texte Texte, formularfelder Formulare, seo SEO, rest Rest, script Script.
DOM-IDs jeweils TAB_a. Quelle T/shopdaten.tpl:61-69,1202.
Je Tab eigene Aufnahme und Feldbeschreibung; besonders Formularanzeige und Pflichtfelder unterscheiden, SEO-URL-Aenderungen bei bestehenden Shops nicht beilaeufig empfehlen.
Texte kommen dynamisch aus ShopSprachen; genaue sichtbare Namen koennen shopabhaengig sein.
Beschreibung wird u.a. fuer shopinfo.xml verwendet (T/shopdaten.tpl:676).

Wichtige Korrektur der alten help_shopdaten.html / WordPress241:
RSSBeschreibung, RSSTitel, NewsRSSBeschreibung, NewsRSSTitel sind unter Texte AUSGEBLENDET (T/shopdaten.tpl:664).
RSS hat eigene Route B?add=showrss, Tabs `rss_a` RSS Einstellungen und `links_a` RSS Links.
Dort Anzahl Produkte/News sowie Produkt-/News-RSS-Titel/Beschreibung; Links separat aufnehmen.
Quelle T/rss.tpl:1-6,58-60,79 ff. Keine RSS-Tab-Anleitung innerhalb Shopdaten schreiben.
Script-Feld ist Fremdcode, kein universeller Consent-Ersatz. Keine alten Keyworddichte-/SEO-Garantien aus Alttext uebernehmen.

## CMS, Boxen und Footer

Eigene Seite: B?add=showeigeneseitenadmin&Sprache=de&PageID=1 (Demo Unser Atelier).
Aufnahmen: neue Seite/Auswahl; Name/Aktiv/Linkbezeichnung; Browser-Titel/Meta/Indizierung; Teasertext/Bild; Elternseite; Inhalt/Editor; speichern; Zuordnung in Navigation/Box/Footer.
Quelle T/eigeneseiten.tpl:152-220 ff.; Alt _help_eigeneseiten.html:46-151.
Seiteninhalt anlegen ist NICHT gleich Navigationslink veroeffentlichen. Hierarchie, Box-Zuordnung und Footer separat erklaeren.
Formularassistent ist vorhanden (T/eigeneseiten.tpl:388-427), aber Formular-Mailrouting nicht allein anhand einer Editoraufnahme als getestet bezeichnen.

Boxen: B?add=showboxadmin. Reihenfolge/Spalte und Anzeigeoptionen sind skinabhaengig.
Boxdialog: B?add=showiframe&nextadd=showeditbox&Box=footer.
Weitere vorhandene Box-Templates: eigeneseiten, eigenebox1..5, menu, warenkorb, login, newsletter, sprachen, waehrung, hersteller usw. Den tatsaechlichen Dialog ueber die Boxliste oeffnen, nicht alle als in jedem Skin sichtbar behaupten.
Footer: verfuegbare Seiten -> Auswahl, Reihenfolge, speichern; `EigeneSeitenFooter[]`, Select `used` (T/box_footer.tpl:52-81).
Alte Hilfe help_boxadmin.html/help_boxen.html ergaenzt _help_eigeneseiten.html; Footer nicht ersatzlos streichen.
Startseite B?add=showstartseitenadmin: Willkommenstext, News, Artikel- und Kategorieauswahl einzeln aufnehmen. Demo hat diese Funktionen aktiviert, fremde Skins koennen abweichen.

## Sprachen

Einstieg B?add=showsprachenadmin. Auswahl `InstalledSprachen`, neu `NeueSprachen`, Aktiv `Aktiv`, Standard `StandardSprache`.
Standard-Checkbox ist DISABLED, hier also kein frei klickbarer Standardwechsel (T/sprachen.tpl:128).
Aktivieren ist nicht gleich vollstaendig uebersetzen. Vor Aktivierung Inhalte pruefen.
Bearbeiten: B?add=showsprachenadmin&edit=1&Sprache=de.
Uebersetzungsansicht: B?add=showsprachenadmin&edit=1&translate=1&Sprache=de.
Bereich z.B. &Where=Produkt_1, &Where=Kat_1 oder &Where=tpl_startpage (Dateischluessel aus aktueller Selectbox uebernehmen).
Quelle J/sprachen.js:80-95; T/sprachen.tpl:188 ff.
Bereiche: templatespezifisch/Dateien, Kategorien, Artikel, Merkmale/MerkmalValues, Emailvorlagen, Eigene Seiten sowie weitere in Where angebotene Dokument-/Versand-/Zahlungs-/News-Bereiche.
Aufnahmen: Sprachen verwalten, Aktiv/Standard-Anzeige, Sprache bearbeiten, Bereichsauswahl, konkrete Textbearbeitung, speichern.
Alte Hilfe _help_sprachen.html:67-116 bewahrt diese Detailtiefe. Automatische Uebersetzung nicht als funktionierende externe Integration zusagen, nur weil ein alter JS-Pfad existiert.

## Versand als angrenzender Ablauf

B?add=showversandadmin. Demo Versandgruppe/-klasse jeweils1, lokales Versandmodul5.
Vier Tabs: einstellungen, texte, bedingungen, laender; IDs jeweils TAB_a (T/versand.tpl:237-240).
Zuerst reale Gruppe/Klasse in der UI auswaehlen, dann Tabs aufnehmen. Keine geratenen Selection-Queryparameter verwenden.
Alte _help_versand.html:39-99: Klasse, Texte, Aktiv/Preis/Regel/Prioritaet, Laender, Wert-/Mass-/Gewichtsbedingungen und Abholung.
Versandkostenberechnung, Paketdienst-CSV und Retourenlabel sind unterschiedliche Funktionen; nicht vermischen.

## Veraltete Behauptungen vermeiden

- Amazon-Tab und Produktflags vorhanden, aber Produkt-Export/API-Bestellimport laut Projektstatus eingestellt. CSV-Import und Versandweg muessen getrennt betrachtet werden; automatische AmazonVersand-Methode ist deaktiviert. docs/offene-features.md:1033,1575-1576.
- eBay-Import funktioniert laut Nutzer, Export nur teilweise; keine pauschale Vollfunktion zusagen (docs/offene-features.md:1571).
- Tradoria, MeinPaket, Andoo, Become, Preisroboter entfernt. Nicht aus alten Hilfedateien neue aktive Menuekapitel machen (docs/offene-features.md:1451).
- DHL-Intraship/EasyLog-CSV ist kein erzeugtes Retouren-PDF und kein Beleg eines automatischen One-Click-Labels (docs/offene-features.md:1284-1309).
- Web-Backup nicht aus alter Hilfe als funktionsfaehige Datensicherung empfehlen; Ersatz/Abnahme offen (docs/offene-features.md:1442).
- HTML-Editor/Tabellenbilder neu aufnehmen; alte SPAW-Bedienung nicht kopieren.
- Alte SEO-Texte mit Keyworddichte 3-5 Prozent, universellen Zeichenlimits und garantierten Suchmaschineneffekten nicht als aktuelle Produktspezifikation wiederholen.

## Offene Aufnahme- und Verifikationsgrenzen

Dieser Audit beweist Codepraesenz und benennt Grenzen; er beweist keine echte Mailzustellung, API-Funktion, PDF-Rechtsgueltigkeit oder erfolgreiche Konfigurationsdatei-Schreibaktion.
Komplexe Attribut-Rechenbeispiele und transaktionale Status-/Dokumentfolgen benoetigen konkrete Demo-Resultate, bevor die Anleitung Ergebnisse verspricht.
Die neutrale Demo und ihre bestehenden Beispiele wurden in diesem Audit nicht veraendert. Keine Screenshot-Neuaufnahme wegen eines neuen Codefixes erforderlich.
