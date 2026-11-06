# Fragebogen: Baum aller Texte

Erzeugt von `scripts/fragebogen_baum.js`, nicht von Hand ändern. Sätze und Fragen werden in `content/frog-guide.json` gepflegt, der Rahmen in `public/assets/guide-core.js` und `guide-price.js`, Preise in `content/price-estimate.json`.

## So liest man die Nummern

- **T07** ist ein Baustein, also ein Satz. Wird er geändert, ändert er sich in jedem Text, in dem er vorkommt. Bausteinnummern bleiben fest, neue Bausteine bekommen die nächste freie Nummer.
- **2.1.3.1.2** ist ein Weg durch den Baum: Thema 2, dann die 1. Antwort, die 3. Folgeantwort und so weiter. Eine **0** an einer Stelle heißt: Frage übersprungen. Neue Antworten kommen ans Ende einer Frage, damit bestehende Nummern gleich bleiben.
- **Z1 bis Z5** sind die freiwilligen Fragen nach „Genauer angeben“. **R1 bis R7** ist der Textrahmen.

## Prüfergebnis

Getestet wurden **1.057.925 Antwortkombinationen**, also jede mögliche Auswahl einschließlich aller übersprungenen Fragen. Der längste Text hat 686 Zeichen, Laufzeit 223 Sekunden.

| Thema | Kombinationen |
|---|---|
| 1 Website | 21.120 |
| 2 Onlineshop | 883.200 |
| 3 App oder Software | 49.920 |
| 4 KI | 42.240 |
| 5 Beratung | 41.600 |
| 6 Hilfe im Betrieb | 19.840 |
| 7 Nur ein paar Infos | 5 |

**Keine harten Fehler.** Geprüft: Anrede und Schluss, keine Programmreste oder doppelten Abstände, Länge passt zum Formular, jede Angabe genau einmal und in Fragenreihenfolge, keine ausgeschlossene Kombination, höchstens ein Kontaktwunsch, Preis stimmt mit einer unabhängigen Gegenprobe, Formularthema und Telefonfeld passen.

Die Prüfung erkennt Form und Rechnung, nicht ob ein Satz inhaltlich gut klingt. Dafür sind die vollen Texte unten da.

## R: Textrahmen

| Nr. | Text | Wann |
|---|---|---|
| R1 | Hallo simplecommerce-Team, | immer |
| R2 | darum geht es: | wenn es Angaben gibt |
| R3 | Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer): | wenn es einen Preis gibt |
| R4 | - einmalig etwa … € | bei einmaligen Kosten |
| R5 | - laufend etwa … € im Monat | bei laufenden Kosten |
| R6 | - Shopmiete und Provision auf Anfrage | bei einem Monatsumsatz über 80.000 € |
| R7 | Können wir darüber sprechen? | als Schluss, wenn kein Kontaktwunsch gewählt wurde |

## Baum: Themen und Antworten

### 1 Website

**1.x Was trifft am ehesten zu?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T01 | Einfache Website | Ich brauche eine einfache Website für mein Unternehmen. | 490 bis 990 € einmalig (Beispielwert) |
| T02 | Website erneuern | Meine Website ist in die Jahre gekommen und braucht einen neuen Auftritt. | 990 bis 1.990 € einmalig (Beispielwert) |
| T03 | Mehr Anfragen | Meine Website soll mir mehr Anfragen bringen. | 790 bis 1.490 € einmalig (Beispielwert) |
| T04 | Besser gefunden werden | Ich möchte im Internet besser gefunden werden. | 290 bis 690 € einmalig (Beispielwert) |

**1.x.y Was haben Sie schon?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T05 | Texte und Bilder | Texte und Bilder habe ich schon. |  |
| T06 | Nur ein Logo | Ich habe ein Logo, aber noch kaum Inhalte. | 190 bis 490 € einmalig (Beispielwert) |
| T07 | Noch nichts | Ich fange bei null an. | 290 bis 690 € einmalig (Beispielwert) |

- T06 „Nur ein Logo“ entfällt nach T02, T03, T04.
- T07 „Noch nichts“ entfällt nach T02, T03, T04.

Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.

### 2 Onlineshop

**2.x Wo stehen Sie gerade?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T08 | Neu starten | Ich möchte einen eigenen Onlineshop starten. |  |
| T09 | Shop umziehen | Ich möchte mit meinem bestehenden Shop umziehen. | 150 € einmalig (Preisliste) |
| T10 | Mehrere Kanäle | Ich verkaufe über mehrere Kanäle und will alles zusammenführen. |  |
| T11 | Erst der Preis | Ich möchte erst wissen, was ein Shop kostet. |  |

**2.x.y Wie groß ist Ihr Sortiment?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T12 | Bis 100 Artikel | Mein Sortiment umfasst bis zu 100 Artikel. |  |
| T13 | Bis 1.000 Artikel | Mein Sortiment umfasst bis zu 1.000 Artikel. |  |
| T14 | Mehr als 1.000 | Mein Sortiment umfasst mehr als 1.000 Artikel. |  |
| T15 | Noch offen | Mein Sortiment steht noch nicht fest. |  |

- T15 „Noch offen“ entfällt nach T09, T10.

Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.

**2.x.y.z Welchen Monatsumsatz haben oder erwarten Sie?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T52 | Bis 10.000 € | Ich rechne mit einem Monatsumsatz von bis zu 10.000 €. | 20 bis 370 € im Monat (Preisliste) |
| T53 | 10.000 bis 30.000 € | Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €. | 310 bis 810 € im Monat (Preisliste) |
| T54 | 30.000 bis 80.000 € | Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €. | 560 bis 1.310 € im Monat (Preisliste) |
| T55 | Über 80.000 € | Ich rechne mit einem Monatsumsatz von über 80.000 €. | auf Anfrage (Preisliste) |

**2.x.y.z.z Wie soll Ihr Shop aussehen?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T56 | Template anpassen | Ich möchte ein vorhandenes Template anpassen lassen. | 499 € einmalig (Preisliste) |
| T57 | Template nach Vorlage | Ich möchte ein Template nach Vorlage. | 990 € einmalig (Preisliste) |
| T58 | Noch offen | Das Design ist noch offen. |  |

### 3 App oder Software

**3.x Was soll die Lösung leisten?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T16 | Eine App | Ich brauche eine App für mein Unternehmen. | 7.900 bis 24.900 € einmalig (Beispielwert) |
| T17 | Software für Abläufe | Ich suche eine Software, die genau zu den eigenen Abläufen passt. | 9.900 bis 29.900 € einmalig (Beispielwert) |
| T18 | Programme verbinden | Die vorhandenen Programme sollen endlich miteinander reden. | 690 bis 2.490 € einmalig (Beispielwert) |
| T19 | Automatisieren | Wiederkehrende Aufgaben sollen automatisch erledigt werden. | 690 bis 2.900 € einmalig (Beispielwert) |
| T20 | Alte Software erneuern | Die bestehende Software muss modernisiert werden. | 1.900 bis 7.900 € einmalig (Beispielwert) |

**3.x.y Womit arbeiten Sie heute?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T21 | Listen und Papier | Heute läuft das mit Listen und Papier. |  |
| T22 | Fertige Programme | Heute läuft das mit fertigen Programmen. |  |
| T23 | Eigene Software | Heute läuft das mit eigener Software. |  |
| T24 | Es gibt noch nichts | Dafür gibt es noch nichts. |  |

- T21 „Listen und Papier“ entfällt nach T20, T18.
- T24 „Es gibt noch nichts“ entfällt nach T20, T18.

Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.

### 4 KI

**4.x Was soll die KI für Sie tun?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T25 | Möglichkeiten zeigen | Ich möchte wissen, was KI meinem Unternehmen bringt. | 190 bis 490 € einmalig (Beispielwert) |
| T26 | Eigenes Modell | Ich möchte eine KI, die das eigene Unternehmen kennt. | 9.900 bis 29.900 € einmalig (Beispielwert) |
| T27 | Anfragen entlasten | KI soll bei Kundenanfragen entlasten. | 990 bis 2.900 € einmalig + 79 bis 300 € im Monat (Beispielwert) |
| T28 | Texte erstellen | KI soll Texte und Produktbeschreibungen erstellen. | 490 bis 1.490 € einmalig (Beispielwert) |
| T29 | Daten auswerten | KI soll Daten auswerten und Arbeit abnehmen. | 990 bis 3.900 € einmalig (Beispielwert) |

**4.x.y Haben Sie schon Daten dafür?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T30 | Ja, gut geordnet | Passende Daten liegen geordnet vor. |  |
| T31 | Ja, aber verstreut | Passende Daten sind vorhanden, aber verstreut. | 290 bis 990 € einmalig (Beispielwert) |
| T32 | Eher nicht | Passende Daten gibt es eher nicht. | 490 bis 1.490 € einmalig (Beispielwert) |
| T33 | Weiß ich nicht | Ob passende Daten vorliegen, weiß ich noch nicht. |  |

- T30 „Ja, gut geordnet“ entfällt nach T25, T28.
- T31 „Ja, aber verstreut“ entfällt nach T25, T28.
- T32 „Eher nicht“ entfällt nach T25, T28.
- T33 „Weiß ich nicht“ entfällt nach T25, T28.

Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.

### 5 Beratung

**5.x Worum geht es vor allem?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T34 | Lösung finden | Ich weiß noch nicht, welche Lösung die richtige ist. | 290 bis 690 € einmalig (Beispielwert) |
| T35 | Zweite Meinung | Ich hätte gern eine zweite Meinung zur IT. | 190 bis 390 € einmalig (Beispielwert) |
| T36 | Klarer Plan | Für das IT-Vorhaben fehlt ein klarer Plan. | 490 bis 990 € einmalig (Beispielwert) |
| T37 | IT vereinfachen | Die IT ist zu teuer oder zu kompliziert geworden. | 390 bis 890 € einmalig (Beispielwert) |

**5.x.y Um welchen Bereich geht es?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T38 | Shop und Verkauf | Es geht vor allem um Shop und Verkauf. |  |
| T39 | Website | Es geht vor allem um die Website. |  |
| T40 | Abläufe und Software | Es geht vor allem um Abläufe und Software. |  |
| T41 | KI | Es geht vor allem um KI. |  |

### 6 Hilfe im Betrieb

**6.x Was brauchen Sie?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T42 | Hilfe beim Shop | Ich brauche Unterstützung bei meinem bestehenden Shop. | 29 bis 79 € im Monat (Beispielwert) |
| T43 | Laufende Pflege | Jemand soll sich laufend um die Website kümmern. | 39 bis 99 € im Monat (Beispielwert) |
| T44 | Einweisung | Ich wünsche mir eine persönliche Einweisung. | 500 € einmalig (Preisliste) |

**6.x.y Worum geht es genau?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T45 | Shop bei simplecommerce | Mein Shop läuft bei simplecommerce. |  |
| T46 | Shop anderswo | Mein Shop läuft bei einem anderen Anbieter. |  |
| T47 | Eine Website | Es geht um eine Website. |  |

- T45 „Shop bei simplecommerce“ entfällt nach T43.
- T46 „Shop anderswo“ entfällt nach T43.
- T47 „Eine Website“ entfällt nach T42, T43.

Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.

### 7 Nur ein paar Infos

**7.x Was hilft Ihnen am meisten?**

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T48 | Ein paar Infos | Ich brauche nur ein paar Infos. |  |
| T49 | Grobe Preise | Ich hätte gern eine grobe Preisvorstellung. |  |
| T50 | Ein Rückruf | Bitte rufen Sie mich einfach zurück. |  |
| T51 | Zusammenarbeit | Ich interessiere mich für eine Zusammenarbeit. |  |

## Z: Freiwillige Fragen nach „Genauer angeben“

Sie stehen bei jedem Thema zur Wahl, soweit nicht anders vermerkt, und ergänzen den Text um eine Zeile an fester Stelle.

### Z1 Wie groß ist Ihr Unternehmen? (nicht bei Sonstiges)

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T59 | Nur ich | Ich arbeite allein. |  |
| T60 | Bis 10 Personen | Das Team hat bis zu 10 Personen. |  |
| T61 | 11 bis 50 Personen | Das Unternehmen hat 11 bis 50 Personen. |  |
| T62 | Mehr als 50 Personen | Das Unternehmen hat mehr als 50 Personen. |  |

### Z2 Was ist Ihnen am wichtigsten? (nicht bei Sonstiges)

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T64 | Einfache Bedienung | Am wichtigsten ist mir eine einfache Bedienung. |  |
| T65 | Ein klarer Kostenrahmen | Am wichtigsten ist mir ein klarer Kostenrahmen. |  |
| T66 | Persönliche Betreuung | Am wichtigsten ist mir persönliche Betreuung. |  |

### Z3 Wann soll es losgehen? (nicht bei Sonstiges)

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T67 | Möglichst bald | Es soll möglichst bald losgehen. |  |
| T68 | In den nächsten Monaten | Es soll in den nächsten Monaten losgehen. |  |
| T69 | Das ist noch offen | Einen festen Zeitplan habe ich noch nicht. |  |

### Z4 Brauchen Sie noch etwas dazu? (nicht bei Sonstiges)

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T70 | Website | Dazu interessiert mich eine Website. | 490 bis 1.990 € einmalig (Beispielwert) |
| T71 | Onlineshop | Dazu interessiert mich ein Onlineshop. | 499 bis 990 € einmalig + 20 bis 370 € im Monat (Preisliste) |
| T72 | App oder Software | Dazu interessiert mich eine App oder individuelle Software. | 7.900 bis 29.900 € einmalig (Beispielwert) |
| T73 | KI | Dazu interessieren mich KI-Anwendungen. | 490 bis 3.900 € einmalig (Beispielwert) |
| T74 | Beratung | Dazu interessiert mich eine IT-Beratung. | 290 bis 990 € einmalig (Beispielwert) |
| T75 | Laufender Service | Dazu interessiert mich laufender Service. | 29 bis 99 € im Monat (Beispielwert) |

- T70 „Website“ entfällt nach T47, T43, T39.
- T71 „Onlineshop“ entfällt nach T45, T46, T42, T38.
- T72 „App oder Software“ entfällt nach T40.
- T73 „KI“ entfällt nach T41.

### Z5 Wie sollen wir uns melden? (nicht bei Sonstiges)

| Baustein | Knopf | Satz im Text | Preis |
|---|---|---|---|
| T76 | Per E-Mail | Antworten Sie mir gern per E-Mail. |  |
| T77 | Mit einem Rückruf | Bitte rufen Sie mich zurück. |  |
| T78 | Im persönlichen Gespräch | Ich würde das am liebsten persönlich besprechen. |  |

## Volle Texte der Kernwege (230)

Ohne übersprungene Fragen und ohne Z-Fragen. Preise mit Beispielwerten sind noch nicht freigegeben.

### Thema 1: Website

#### 1.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine einfache Website für mein Unternehmen.
- Texte und Bilder habe ich schon.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 990 €

Können wir darüber sprechen?
```

#### 1.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine einfache Website für mein Unternehmen.
- Ich habe ein Logo, aber noch kaum Inhalte.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 680 bis 1.480 €

Können wir darüber sprechen?
```

#### 1.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine einfache Website für mein Unternehmen.
- Ich fange bei null an.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 780 bis 1.680 €

Können wir darüber sprechen?
```

#### 1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Meine Website ist in die Jahre gekommen und braucht einen neuen Auftritt.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 bis 1.990 €

Können wir darüber sprechen?
```

#### 1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Meine Website soll mir mehr Anfragen bringen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 790 bis 1.490 €

Können wir darüber sprechen?
```

#### 1.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte im Internet besser gefunden werden.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 290 bis 690 €

Können wir darüber sprechen?
```

### Thema 2: Onlineshop

#### 2.1.1.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.1.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.1.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.1.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.2.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.2.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.2.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.2.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.3.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.3.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.3.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.3.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.4.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.1.4.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.4.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.1.4.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte einen eigenen Onlineshop starten.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.1.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.1.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.1.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.1.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.2.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.2.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.2.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.2.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.3.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.2.3.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 649 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.3.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.140 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.2.3.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte mit meinem bestehenden Shop umziehen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 150 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.1.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.1.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.1.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.1.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.2.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.2.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.2.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.2.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.3.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.3.3.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.3.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.3.3.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich verkaufe über mehrere Kanäle und will alles zusammenführen.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.1.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.1.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.1.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.1.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 100 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.2.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.2.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.2.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.2.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst bis zu 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.3.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.3.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.3.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.3.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment umfasst mehr als 1.000 Artikel.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.4.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von bis zu 10.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 20 bis 370 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 10.000 bis 30.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 310 bis 810 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von 30.000 bis 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 560 bis 1.310 € im Monat

Können wir darüber sprechen?
```

#### 2.4.4.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein vorhandenes Template anpassen lassen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 499 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.4.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Ich möchte ein Template nach Vorlage.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 €
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

#### 2.4.4.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte erst wissen, was ein Shop kostet.
- Mein Sortiment steht noch nicht fest.
- Ich rechne mit einem Monatsumsatz von über 80.000 €.
- Das Design ist noch offen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- Shopmiete und Provision auf Anfrage

Können wir darüber sprechen?
```

### Thema 3: App oder Software

#### 3.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine App für mein Unternehmen.
- Heute läuft das mit Listen und Papier.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 7.900 bis 24.900 €

Können wir darüber sprechen?
```

#### 3.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine App für mein Unternehmen.
- Heute läuft das mit fertigen Programmen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 7.900 bis 24.900 €

Können wir darüber sprechen?
```

#### 3.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine App für mein Unternehmen.
- Heute läuft das mit eigener Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 7.900 bis 24.900 €

Können wir darüber sprechen?
```

#### 3.1.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche eine App für mein Unternehmen.
- Dafür gibt es noch nichts.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 7.900 bis 24.900 €

Können wir darüber sprechen?
```

#### 3.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich suche eine Software, die genau zu den eigenen Abläufen passt.
- Heute läuft das mit Listen und Papier.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 3.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich suche eine Software, die genau zu den eigenen Abläufen passt.
- Heute läuft das mit fertigen Programmen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 3.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich suche eine Software, die genau zu den eigenen Abläufen passt.
- Heute läuft das mit eigener Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 3.2.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich suche eine Software, die genau zu den eigenen Abläufen passt.
- Dafür gibt es noch nichts.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 3.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Die vorhandenen Programme sollen endlich miteinander reden.
- Heute läuft das mit fertigen Programmen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.490 €

Können wir darüber sprechen?
```

#### 3.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Die vorhandenen Programme sollen endlich miteinander reden.
- Heute läuft das mit eigener Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.490 €

Können wir darüber sprechen?
```

#### 3.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Wiederkehrende Aufgaben sollen automatisch erledigt werden.
- Heute läuft das mit Listen und Papier.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.900 €

Können wir darüber sprechen?
```

#### 3.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Wiederkehrende Aufgaben sollen automatisch erledigt werden.
- Heute läuft das mit fertigen Programmen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.900 €

Können wir darüber sprechen?
```

#### 3.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Wiederkehrende Aufgaben sollen automatisch erledigt werden.
- Heute läuft das mit eigener Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.900 €

Können wir darüber sprechen?
```

#### 3.4.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Wiederkehrende Aufgaben sollen automatisch erledigt werden.
- Dafür gibt es noch nichts.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 690 bis 2.900 €

Können wir darüber sprechen?
```

#### 3.5.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Die bestehende Software muss modernisiert werden.
- Heute läuft das mit fertigen Programmen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.900 bis 7.900 €

Können wir darüber sprechen?
```

#### 3.5.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Die bestehende Software muss modernisiert werden.
- Heute läuft das mit eigener Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.900 bis 7.900 €

Können wir darüber sprechen?
```

### Thema 4: KI

#### 4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte wissen, was KI meinem Unternehmen bringt.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 190 bis 490 €

Können wir darüber sprechen?
```

#### 4.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte eine KI, die das eigene Unternehmen kennt.
- Passende Daten liegen geordnet vor.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 4.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte eine KI, die das eigene Unternehmen kennt.
- Passende Daten sind vorhanden, aber verstreut.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 10.190 bis 30.890 €

Können wir darüber sprechen?
```

#### 4.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte eine KI, die das eigene Unternehmen kennt.
- Passende Daten gibt es eher nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 10.390 bis 31.390 €

Können wir darüber sprechen?
```

#### 4.2.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich möchte eine KI, die das eigene Unternehmen kennt.
- Ob passende Daten vorliegen, weiß ich noch nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 9.900 bis 29.900 €

Können wir darüber sprechen?
```

#### 4.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll bei Kundenanfragen entlasten.
- Passende Daten liegen geordnet vor.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 bis 2.900 €
- laufend etwa 79 bis 300 € im Monat

Können wir darüber sprechen?
```

#### 4.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll bei Kundenanfragen entlasten.
- Passende Daten sind vorhanden, aber verstreut.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.280 bis 3.890 €
- laufend etwa 79 bis 300 € im Monat

Können wir darüber sprechen?
```

#### 4.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll bei Kundenanfragen entlasten.
- Passende Daten gibt es eher nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.480 bis 4.390 €
- laufend etwa 79 bis 300 € im Monat

Können wir darüber sprechen?
```

#### 4.3.4

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll bei Kundenanfragen entlasten.
- Ob passende Daten vorliegen, weiß ich noch nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 bis 2.900 €
- laufend etwa 79 bis 300 € im Monat

Können wir darüber sprechen?
```

#### 4.4

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll Texte und Produktbeschreibungen erstellen.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 1.490 €

Können wir darüber sprechen?
```

#### 4.5.1

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll Daten auswerten und Arbeit abnehmen.
- Passende Daten liegen geordnet vor.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 bis 3.900 €

Können wir darüber sprechen?
```

#### 4.5.2

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll Daten auswerten und Arbeit abnehmen.
- Passende Daten sind vorhanden, aber verstreut.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.280 bis 4.890 €

Können wir darüber sprechen?
```

#### 4.5.3

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll Daten auswerten und Arbeit abnehmen.
- Passende Daten gibt es eher nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 1.480 bis 5.390 €

Können wir darüber sprechen?
```

#### 4.5.4

```text
Hallo simplecommerce-Team,

darum geht es:
- KI soll Daten auswerten und Arbeit abnehmen.
- Ob passende Daten vorliegen, weiß ich noch nicht.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 990 bis 3.900 €

Können wir darüber sprechen?
```

### Thema 5: Beratung

#### 5.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich weiß noch nicht, welche Lösung die richtige ist.
- Es geht vor allem um Shop und Verkauf.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 290 bis 690 €

Können wir darüber sprechen?
```

#### 5.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich weiß noch nicht, welche Lösung die richtige ist.
- Es geht vor allem um die Website.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 290 bis 690 €

Können wir darüber sprechen?
```

#### 5.1.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich weiß noch nicht, welche Lösung die richtige ist.
- Es geht vor allem um Abläufe und Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 290 bis 690 €

Können wir darüber sprechen?
```

#### 5.1.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich weiß noch nicht, welche Lösung die richtige ist.
- Es geht vor allem um KI.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 290 bis 690 €

Können wir darüber sprechen?
```

#### 5.2.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich hätte gern eine zweite Meinung zur IT.
- Es geht vor allem um Shop und Verkauf.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 190 bis 390 €

Können wir darüber sprechen?
```

#### 5.2.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich hätte gern eine zweite Meinung zur IT.
- Es geht vor allem um die Website.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 190 bis 390 €

Können wir darüber sprechen?
```

#### 5.2.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich hätte gern eine zweite Meinung zur IT.
- Es geht vor allem um Abläufe und Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 190 bis 390 €

Können wir darüber sprechen?
```

#### 5.2.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich hätte gern eine zweite Meinung zur IT.
- Es geht vor allem um KI.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 190 bis 390 €

Können wir darüber sprechen?
```

#### 5.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Für das IT-Vorhaben fehlt ein klarer Plan.
- Es geht vor allem um Shop und Verkauf.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 990 €

Können wir darüber sprechen?
```

#### 5.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Für das IT-Vorhaben fehlt ein klarer Plan.
- Es geht vor allem um die Website.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 990 €

Können wir darüber sprechen?
```

#### 5.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Für das IT-Vorhaben fehlt ein klarer Plan.
- Es geht vor allem um Abläufe und Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 990 €

Können wir darüber sprechen?
```

#### 5.3.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Für das IT-Vorhaben fehlt ein klarer Plan.
- Es geht vor allem um KI.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 490 bis 990 €

Können wir darüber sprechen?
```

#### 5.4.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Die IT ist zu teuer oder zu kompliziert geworden.
- Es geht vor allem um Shop und Verkauf.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 390 bis 890 €

Können wir darüber sprechen?
```

#### 5.4.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Die IT ist zu teuer oder zu kompliziert geworden.
- Es geht vor allem um die Website.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 390 bis 890 €

Können wir darüber sprechen?
```

#### 5.4.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Die IT ist zu teuer oder zu kompliziert geworden.
- Es geht vor allem um Abläufe und Software.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 390 bis 890 €

Können wir darüber sprechen?
```

#### 5.4.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Die IT ist zu teuer oder zu kompliziert geworden.
- Es geht vor allem um KI.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 390 bis 890 €

Können wir darüber sprechen?
```

### Thema 6: Hilfe im Betrieb

#### 6.1.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche Unterstützung bei meinem bestehenden Shop.
- Mein Shop läuft bei simplecommerce.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 29 bis 79 € im Monat

Können wir darüber sprechen?
```

#### 6.1.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche Unterstützung bei meinem bestehenden Shop.
- Mein Shop läuft bei einem anderen Anbieter.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 29 bis 79 € im Monat

Können wir darüber sprechen?
```

#### 6.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Jemand soll sich laufend um die Website kümmern.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- laufend etwa 39 bis 99 € im Monat

Können wir darüber sprechen?
```

#### 6.3.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich wünsche mir eine persönliche Einweisung.
- Mein Shop läuft bei simplecommerce.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 500 €

Können wir darüber sprechen?
```

#### 6.3.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich wünsche mir eine persönliche Einweisung.
- Mein Shop läuft bei einem anderen Anbieter.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 500 €

Können wir darüber sprechen?
```

#### 6.3.3

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich wünsche mir eine persönliche Einweisung.
- Es geht um eine Website.

Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):
- einmalig etwa 500 €

Können wir darüber sprechen?
```

### Thema 7: Nur ein paar Infos

#### 7.1

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich brauche nur ein paar Infos.

Können wir darüber sprechen?
```

#### 7.2

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich hätte gern eine grobe Preisvorstellung.

Können wir darüber sprechen?
```

#### 7.3

```text
Hallo simplecommerce-Team,

Bitte rufen Sie mich einfach zurück.
```

#### 7.4

```text
Hallo simplecommerce-Team,

darum geht es:
- Ich interessiere mich für eine Zusammenarbeit.

Können wir darüber sprechen?
```

