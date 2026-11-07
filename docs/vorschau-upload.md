# Geschützte Vorschau auf Hetzner

Ziel: `seccom@dedi1693.your-server.de`, FTP-Verzeichnis `public_html/new/redesign`, URL `https://simplecommerce.de/redesign/`. DocumentRoot ist `public_html/new`. FTP muss im Account-Home starten, in dem `public_html` liegt.

## Einmalige Vorbereitung

In Hetzner den Verzeichnisschutz für `redesign` innerhalb des DocumentRoots einrichten: Benutzer `simple`, das vereinbarte Vorschau-Passwort. Der Schutz muss in der dortigen `.htaccess` stehen. Ohne Anmeldung müssen sowohl die Vorschau als auch `/redesign/assets/site.css` HTTP 401 liefern. Ein absoluter Serverpfad muss im Upload-Skript nicht mehr eingegeben werden; die Passwortdatei verwaltet Hetzner.

## Upload

Vom Integrationsbranch ausführen:

```sh
bash scripts/upload-preview.sh
```

Voraussetzungen: `lftp`, `curl`, `python3`. Das Skript fragt nur das FTP-Passwort verdeckt ab. Es verwendet FTP mit explizitem TLS (FTPS, Port 21), keine SSH-Shell. Zertifikate werden geprüft. Bei einem Zertifikatsfehler den von Hetzner bestätigten FTP-Host verwenden, nicht die Prüfung abschalten. Ein anderes Ziel kann als erstes Argument `benutzer@host` übergeben werden.

Das FTP-Passwort wird nur über die Prozessumgebung an lftp übergeben, nicht in Argumenten oder einer Datei gespeichert. Die bestehende `.htaccess` wird heruntergeladen und einschließlich ihrer Authentifizierungsregeln übernommen. Nur der markierte Block `SIMPLECOMMERCE PREVIEW` wird bei Folgeuploads ersetzt; darin stehen die Website-Weiterleitungen und Sicherheitsheader. Die Passwortdatei wird nicht verändert.

Das Skript baut und validiert die Website und erstellt eine temporäre Kopie mit `/redesign/`-Pfaden. HTTP 401 wird vor dem Upload, nach Ergänzung der `.htaccess` und nach dem Inhaltsupload geprüft. Ohne wirksamen Schutz Abbruch. Gleichnamige Vorschau-Dateien werden überschrieben; entfernte Dateien werden nicht gelöscht. Produktive Quellen behalten ihre Root-Pfade. Vertrauliche PDFs/Dumps werden nicht hochgeladen.

Vorschau bekommt `noindex` per Header. Kontaktversand ist auf ausdrücklichen Wunsch von Benjamin im Upload-Paket aktiv: Empfänger und Absender standardmäßig `projekt@simplecommerce.de`, Besucheradresse als Reply-To. Vorhandene `CONTACT_TO`/`CONTACT_FROM`-Umgebungswerte haben Vorrang und müssen bei Bedarf angepasst werden. Der Versand nutzt PHP `mail()`; erfolgreiche Zustellung an beide Verteilerempfänger muss nach dem Upload geprüft werden. Rate-Limit-Dateien liegen standardmäßig im Account-Home unter `SEC/simplecommerce-preview`, außerhalb von `public_html`. Die spätere produktive Hilfe bleibt indexierbar; gemeinsamer Livegang bleibt getrennt.

Nach Upload mit Login Startseite, Hilfe, Preisrechner, Bilder und Kontaktmeldung prüfen. Bei HTTP 500 Apache-Konfiguration prüfen; Passwortschutz nicht zur Fehlerbehebung entfernen. Ein lokaler Skripttest ist kein Upload- oder Anmeldenachweis.

Der Alias `hetzner1.simplecommerce.de` passt nicht zum FTP-Zertifikat. `dedi1693.your-server.de` wurde am 08.11.2026 mit gültigem Zertifikat geprüft und ist der Standardhost.

## PHP und Diagnose
Die Vorschau setzt gemäß bereitgestellter Hetzner-Konfiguration per `FcgidWrapper` PHP 8.4 nur unter `/redesign/`. Der bestehende Verzeichnisschutz bleibt erhalten. `SEC/simplecommerce-preview` liegt im Account-Home außerhalb von `public_html`. Tagesdateien `contact_YYYY-MM-DD.jsonl` und `php_error_YYYY-MM-DD.jsonl` enthalten Ereignisse und zufällige Anfrage-IDs, keine Nachrichten, E-Mail-Adressen oder IP-Adressen. Fehler enthalten Typ, Dateiname und Zeile, keine beliebigen Fehlermeldungen. Maximal 1 MiB je Tagesdatei; die letzten sieben UTC-Kalendertage bleiben erhalten, Bereinigung erfolgt bei Anfragen. Bei fehlenden Schreibrechten wird nicht versendet. PHP-eigene Start-/Parserfehler vor Ausführung des Skripts bleiben im Hetzner-Serverfehlerprotokoll; die Anwendungsprotokollierung kann sie nicht immer erfassen.

SEC-Pfadkorrektur: Hetzners bereitgestellte Account-Anleitung nennt `/usr/home/<login>`. Für `seccom` wird deshalb `/usr/home/seccom/SEC/simplecommerce-preview` verwendet; der Upload legt `SEC/simplecommerce-preview` über FTP vorab mit Modus 0700 an. Der Pfad wird nicht mehr aus `__DIR__` abgeleitet, da Webverzeichnisse über Symlinks aufgelöst werden können.
