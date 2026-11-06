'use strict';
/*
 * Prüft alle Texte, die der Fragebogen erzeugen kann, und schreibt den nummerierten Baum nach docs/fragebogen-baum.md.
 * Führt den echten Code der Website aus (guide-data.js, guide-core.js, guide-price.js), nur Browserteile sind ersetzt.
 * Reines Entwicklungswerkzeug, wird nicht ausgeliefert. Start, nachdem scripts/build.py gelaufen ist:
 *   docker run --rm -v "$PWD:/w" -w /w node:22-slim node scripts/fragebogen_baum.js
 * Endet mit Fehlercode 1, wenn eine harte Prüfung fehlschlägt.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const asset = name => fs.readFileSync(path.join(ROOT, 'public/assets', name), 'utf8');

/* ---------- Echten Code laden ---------- */
const stub = () => ({ setAttribute() {}, append() {}, style: {} });
const sandbox = {
  console,
  document: { createElementNS: stub, createElement: stub, querySelector: () => null, body: stub() },
  sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
['guide-data.js', 'guide-core.js', 'guide-price.js'].forEach(name => vm.runInContext(asset(name), sandbox, { filename: name }));
const F = sandbox.Frosch;
const { store } = F;
const { statements, questionnaire: Q, prices } = F.data;
const byId = new Map(statements.map(item => [item.id, item]));

/* ---------- Nummern: Position im Baum, 0 heißt übersprungen ---------- */
const themes = Q.first.options;
const rawLevels = [...Object.values(Q.details), ...Object.values(Q.followUp), ...Q.common];
const position = new Map();
rawLevels.forEach(level => level.options.forEach((option, index) => position.set(option.statement, index + 1)));
const OPTIONAL = ['team', 'wichtig', 'timing', 'extra', 'kontakt'];
const CORE_COMMON = ['umsatz', 'design'];
const zLabel = id => `Z${OPTIONAL.indexOf(id) + 1}`;

/* ---------- Unabhängige Preisrechnung als Gegenprobe ---------- */
const money = value => value.toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
const span = ([low, high]) => (low === high ? `${money(low)} €` : `${money(low)} bis ${money(high)} €`);
const { tiers, effects } = prices;
const tierSpan = index => {
  const tier = tiers[index];
  if (tier.rent === null || tier.rate === null) return null;
  const from = index ? tiers[index - 1].limit : 0;
  const at = revenue => tier.rent + revenue * tier.rate / 100 + tier.ssl;
  return [at(from), at(tier.limit)];
};
function expectedPrice(ids) {
  const once = [0, 0];
  const monthly = [0, 0];
  let onRequest = false;
  ids.forEach(id => {
    const effect = effects[id];
    if (!effect) return;
    if (effect.once) { once[0] += effect.once[0]; once[1] += effect.once[1]; }
    if (effect.monthly) { monthly[0] += effect.monthly[0]; monthly[1] += effect.monthly[1]; }
    if (effect.tier !== undefined) {
      const range = tierSpan(effect.tier);
      if (range) { monthly[0] += range[0]; monthly[1] += range[1]; } else onRequest = true;
    }
  });
  return { once, monthly, onRequest };
}

/* ---------- Prüfungen ---------- */
const HEAD = 'Hallo simplecommerce-Team,\n\n';
const PRICE_HEAD = 'Mein grober Preisrahmen laut Preisrechner (unverbindlich, zuzüglich Mehrwertsteuer):\n';
const DEFAULT_CLOSING = 'Können wir darüber sprechen?';
const conflicts = [];
[...Object.values(Q.followUp), ...Q.common].forEach(level => level.options.forEach(option => (option.hideIf || []).forEach(id => conflicts.push([id, option.statement]))));
const treeOrder = new Map();
rawLevels.forEach(level => level.options.forEach(option => { if (!treeOrder.has(option.statement)) treeOrder.set(option.statement, treeOrder.size); }));

const failures = new Map();
const fail = (rule, number, text) => {
  const entry = failures.get(rule) || { count: 0, examples: [] };
  entry.count += 1;
  if (entry.examples.length < 3) entry.examples.push({ number, text });
  failures.set(rule, entry);
};

/* Inhaltlich fragwürdig, aber kein Fehler: hier eintragen, was beim Durchgehen auffällt.
 * Format: ['P1', [Aussagen], [Aussagen], 'Warum'] */
const SOFT = [].map(([nr, first, second, why]) => ({ nr, first, second, why, count: 0, example: null }));

const counts = new Map();
let total = 0;
let longest = 0;
const parts = [];

function visit(theme) {
  total += 1;
  counts.set(theme.topic, (counts.get(theme.topic) || 0) + 1);
  const items = store.items();
  const ids = items.map(item => item.id);
  const text = store.letter();
  const number = () => `${themes.indexOf(theme) + 1}.${parts.join('.')}`;

  SOFT.forEach(soft => {
    if (soft.first.some(id => ids.includes(id)) && soft.second.some(id => ids.includes(id))) {
      soft.count += 1;
      if (!soft.example) soft.example = number();
    }
  });

  if (!ids.length) {
    if (text !== '') fail('Ohne Angaben muss das Feld leer bleiben', number(), text);
    return;
  }
  longest = Math.max(longest, text.length);
  if (!text.startsWith(HEAD)) fail('Beginnt mit der Anrede', number(), text);
  if (!text.endsWith('\n') || text.endsWith('\n\n')) fail('Endet mit genau einem Zeilenumbruch', number(), text);
  if (/undefined|NaN|\[object/.test(text) || /\bnull\b/.test(text.replace('bei null an', ''))) fail('Keine Programmreste im Text', number(), text);
  if (/\n\n\n| {2}| \n/.test(text)) fail('Keine doppelten Abstände', number(), text);
  if (text.length < 10 || text.length > 10000) fail('Länge passt zum Formular (10 bis 10.000 Zeichen)', number(), text);

  const lines = text.split('\n');
  const closing = items.filter(item => item.closing);
  if (closing.length > 1) fail('Höchstens ein Kontaktwunsch', number(), text);
  const lastLine = lines[lines.length - 2];
  if (lastLine !== (closing.length ? closing.map(item => item.text).join(' ') : DEFAULT_CLOSING)) fail('Der Kontaktwunsch steht am Schluss', number(), text);

  const facts = items.filter(item => !item.closing);
  let at = -1;
  facts.forEach(item => {
    const line = `- ${item.text}`;
    const found = lines.indexOf(line);
    if (found < 0 || lines.lastIndexOf(line) !== found) fail('Jede Angabe steht genau einmal im Text', number(), text);
    if (found < at) fail('Reihenfolge folgt den Fragen', number(), text);
    at = found;
  });
  if (facts.length && !text.includes('darum geht es:\n')) fail('Angaben stehen unter der Einleitung', number(), text);
  if (!facts.length && text.includes('darum geht es:')) fail('Keine Einleitung ohne Angaben', number(), text);
  conflicts.forEach(([a, b]) => { if (ids.includes(a) && ids.includes(b)) fail('Keine ausgeschlossene Kombination', number(), text); });

  const price = expectedPrice(ids);
  const hasOnce = price.once[1] > 0;
  const hasMonthly = price.monthly[1] > 0;
  const hasPrice = hasOnce || hasMonthly || price.onRequest;
  if (hasPrice !== text.includes(PRICE_HEAD)) fail('Preisabschnitt erscheint genau dann, wenn es einen Preis gibt', number(), text);
  if (hasOnce && !text.includes(`- einmalig etwa ${span(price.once)}\n`)) fail('Einmaliger Preis stimmt mit der Gegenprobe', number(), text);
  if (hasMonthly && !text.includes(`- laufend etwa ${span(price.monthly)} im Monat\n`)) fail('Monatspreis stimmt mit der Gegenprobe', number(), text);
  if (price.onRequest !== text.includes('- Shopmiete und Provision auf Anfrage\n')) fail('Auf Anfrage erscheint richtig', number(), text);

  const known = store.mainTopic() || F.topicFromStore();
  if (facts.some(item => item.topic) && known !== theme.topic) fail('Formularthema passt zum gewählten Thema', number(), text);
  if (items.some(item => item.askPhone) !== store.wantsCall()) fail('Telefonfeld passt zum Rückrufwunsch', number(), text);
}

/* Geht jede Kombination durch: jede Antwort und jedes Überspringen, bei Zusatzwünschen jede Auswahl. */
function walk(theme, index) {
  const levels = F.levelsFor(theme.topic);
  if (index >= levels.length) { visit(theme); return; }
  const level = levels[index];
  if (level.multi) {
    const size = 1 << level.options.length;
    for (let mask = 0; mask < size; mask += 1) {
      const chosen = level.options.filter((option, bit) => mask & (1 << bit));
      chosen.forEach(option => store.add(option.statement));
      parts.push(chosen.map(option => position.get(option.statement)).join('+') || '0');
      walk(theme, index + 1);
      parts.pop();
      chosen.forEach(option => store.remove(option.statement));
    }
    return;
  }
  parts.push('0');
  walk(theme, index + 1);
  parts.pop();
  level.options.forEach(option => {
    store.add(option.statement);
    parts.push(String(position.get(option.statement)));
    walk(theme, index + 1);
    parts.pop();
    store.remove(option.statement);
  });
}

/* Die Kernwege ohne Überspringen und ohne die freiwilligen Fragen werden als volle Texte ausgegeben. */
const coreTexts = [];
function walkCore(theme, index, trail) {
  const levels = F.levelsFor(theme.topic);
  const level = levels[index];
  if (!level || OPTIONAL.includes(level.id)) {
    coreTexts.push({ number: `${themes.indexOf(theme) + 1}.${trail.join('.')}`, theme, text: store.letter() });
    return;
  }
  level.options.forEach(option => {
    store.add(option.statement);
    walkCore(theme, index + 1, [...trail, position.get(option.statement)]);
    store.remove(option.statement);
  });
}

const started = Date.now();
themes.forEach(theme => {
  store.clear();
  walk(theme, 1);
  store.clear();
  walkCore(theme, 1, []);
});
const seconds = Math.round((Date.now() - started) / 1000);

/* Doppelte Sätze sind auch ohne Durchlauf erkennbar. */
const seen = new Map();
statements.forEach(item => {
  if (seen.has(item.text)) fail('Jeder Baustein hat einen eigenen Satz', `T${item.nr}`, item.text);
  seen.set(item.text, item.id);
});
if (statements.some(item => !item.nr)) fail('Jeder Baustein hat eine Nummer', '-', '');

/* ---------- Auswertung schreiben ---------- */
const t = id => `T${String(byId.get(id).nr).padStart(2, '0')}`;
const priceNote = id => {
  const effect = effects[id];
  if (!effect) return '';
  const source = effect.source === 'entwurf' ? 'Beispielwert' : 'Preisliste';
  const bits = [];
  if (effect.once) bits.push(`${span(effect.once)} einmalig`);
  if (effect.monthly) bits.push(`${span(effect.monthly)} im Monat`);
  if (effect.tier !== undefined) {
    const range = tierSpan(effect.tier);
    bits.push(range ? `${span(range)} im Monat` : 'auf Anfrage');
  }
  return `${bits.join(' + ')} (${source})`;
};
const row = option => `| ${t(option.statement)} | ${option.label} | ${byId.get(option.statement).text} | ${priceNote(option.statement)} |`;
const tableHead = '| Baustein | Knopf | Satz im Text | Preis |\n|---|---|---|---|';
const out = [];
out.push('# Fragebogen: Baum aller Texte', '');
out.push('Erzeugt von `scripts/fragebogen_baum.js`, nicht von Hand ändern. Sätze und Fragen werden in `content/frog-guide.json` gepflegt, der Rahmen in `public/assets/guide-core.js` und `guide-price.js`, Preise in `content/price-estimate.json`.', '');
out.push('## So liest man die Nummern', '');
out.push('- **T07** ist ein Baustein, also ein Satz. Wird er geändert, ändert er sich in jedem Text, in dem er vorkommt. Bausteinnummern bleiben fest, neue Bausteine bekommen die nächste freie Nummer.');
out.push('- **2.1.3.1.2** ist ein Weg durch den Baum: Thema 2, dann die 1. Antwort, die 3. Folgeantwort und so weiter. Eine **0** an einer Stelle heißt: Frage übersprungen. Neue Antworten kommen ans Ende einer Frage, damit bestehende Nummern gleich bleiben.');
out.push('- **Z1 bis Z5** sind die freiwilligen Fragen nach „Genauer angeben“. **R1 bis R7** ist der Textrahmen. **P** sind Kombinationen, die inhaltlich zu prüfen sind.', '');
out.push('## Prüfergebnis', '');
out.push(`Getestet wurden **${total.toLocaleString('de-DE')} Antwortkombinationen**, also jede mögliche Auswahl einschließlich aller übersprungenen Fragen und jeder Auswahl bei den Zusatzwünschen. Der längste Text hat ${longest} Zeichen, Laufzeit ${seconds} Sekunden.`, '');
out.push('| Thema | Kombinationen |', '|---|---|');
themes.forEach((theme, index) => out.push(`| ${index + 1} ${theme.label} | ${(counts.get(theme.topic) || 0).toLocaleString('de-DE')} |`));
out.push('');
if (failures.size) {
  out.push('**Harte Fehler:**', '');
  failures.forEach((entry, rule) => {
    out.push(`- ${rule}: ${entry.count.toLocaleString('de-DE')} Mal, z. B. Weg ${entry.examples[0].number}`);
  });
} else {
  out.push('**Keine harten Fehler.** Geprüft: Anrede und Schluss, keine Programmreste oder doppelten Abstände, Länge passt zum Formular, jede Angabe genau einmal und in Fragenreihenfolge, keine ausgeschlossene Kombination, höchstens ein Kontaktwunsch, Preis stimmt mit einer unabhängigen Gegenprobe, Formularthema und Telefonfeld passen.');
}
out.push('', 'Die Prüfung erkennt Form und Rechnung, nicht ob ein Satz inhaltlich gut klingt. Dafür sind die vollen Texte unten und die Liste P da.', '');
out.push('## P: Inhaltlich zu prüfende Kombinationen', '');
if (SOFT.length) out.push('| Nr. | Bausteine | Warum | Kombinationen | Beispielweg |', '|---|---|---|---|---|');
else out.push('Derzeit ist keine Kombination offen.');
SOFT.forEach(soft => out.push(`| ${soft.nr} | ${soft.first.map(t).join(', ')} mit ${soft.second.map(t).join(', ')} | ${soft.why} | ${soft.count.toLocaleString('de-DE')} | ${soft.example || '-'} |`));
out.push('', '## R: Textrahmen', '', '| Nr. | Text | Wann |', '|---|---|---|');
[
  ['R1', 'Hallo simplecommerce-Team,', 'immer'],
  ['R2', 'darum geht es:', 'wenn es Angaben gibt'],
  ['R3', PRICE_HEAD.trim(), 'wenn es einen Preis gibt'],
  ['R4', '- einmalig etwa … €', 'bei einmaligen Kosten'],
  ['R5', '- laufend etwa … € im Monat', 'bei laufenden Kosten'],
  ['R6', '- Shopmiete und Provision auf Anfrage', 'bei einem Monatsumsatz über 80.000 €'],
  ['R7', DEFAULT_CLOSING, 'als Schluss, wenn kein Kontaktwunsch gewählt wurde']
].forEach(cells => out.push(`| ${cells.join(' | ')} |`));
out.push('', '## Baum: Themen und Antworten', '');
themes.forEach((theme, index) => {
  const number = index + 1;
  out.push(`### ${number} ${theme.label}`, '');
  const details = Q.details[theme.topic];
  out.push(`**${number}.x ${details.question}**`, '', tableHead);
  details.options.forEach(option => out.push(row(option)));
  out.push('');
  const follow = Q.followUp[theme.topic];
  if (follow) {
    out.push(`**${number}.x.y ${follow.question}**`, '', tableHead);
    follow.options.forEach(option => out.push(row(option)));
    const hidden = follow.options.filter(option => option.hideIf);
    if (hidden.length) {
      out.push('');
      hidden.forEach(option => out.push(`- ${t(option.statement)} „${option.label}“ entfällt nach ${option.hideIf.map(t).join(', ')}.`));
      out.push('', 'Bleibt nach einer Antwort nur eine Möglichkeit, entfällt die ganze Frage.');
    }
    out.push('');
  }
  Q.common.filter(level => CORE_COMMON.includes(level.id) && (level.onlyFor || []).includes(theme.topic)).forEach((level, position2) => {
    out.push(`**${number}.x.y${'.z'.repeat(position2 + 1)} ${level.question}**`, '', tableHead);
    level.options.forEach(option => out.push(row(option)));
    out.push('');
  });
});
out.push('## Z: Freiwillige Fragen nach „Genauer angeben“', '', 'Sie stehen bei jedem Thema zur Wahl, soweit nicht anders vermerkt, und ergänzen den Text um eine Zeile an fester Stelle.', '');
Q.common.filter(level => OPTIONAL.includes(level.id)).forEach(level => {
  const note = level.skipFor ? ` (nicht bei ${level.skipFor.join(', ')})` : '';
  out.push(`### ${zLabel(level.id)} ${level.question}${level.multi ? ' (mehrere möglich)' : ''}${note}`, '', tableHead);
  level.options.forEach(option => out.push(row(option)));
  const hidden = level.options.filter(option => option.hideIf);
  if (hidden.length) {
    out.push('');
    hidden.forEach(option => out.push(`- ${t(option.statement)} „${option.label}“ entfällt nach ${option.hideIf.map(t).join(', ')}.`));
  }
  out.push('');
});
out.push(`## Volle Texte der Kernwege (${coreTexts.length})`, '', 'Ohne übersprungene Fragen und ohne Z-Fragen. Preise mit Beispielwerten sind noch nicht freigegeben.', '');
themes.forEach((theme, index) => {
  out.push(`### Thema ${index + 1}: ${theme.label}`, '');
  coreTexts.filter(entry => entry.theme === theme).forEach(entry => {
    out.push(`#### ${entry.number}`, '', '```text', entry.text.trimEnd(), '```', '');
  });
});
fs.writeFileSync(path.join(ROOT, 'docs/fragebogen-baum.md'), `${out.join('\n')}\n`);

console.log(`${total} Kombinationen in ${seconds} s, ${coreTexts.length} Kernwege, längster Text ${longest} Zeichen`);
themes.forEach(theme => console.log(`  ${theme.label}: ${counts.get(theme.topic)}`));
SOFT.forEach(soft => console.log(`  ${soft.nr}: ${soft.count}`));
if (failures.size) {
  console.log('HARTE FEHLER:');
  failures.forEach((entry, rule) => {
    console.log(`- ${rule}: ${entry.count}`);
    entry.examples.forEach(example => console.log(`    ${example.number}: ${JSON.stringify(example.text)}`));
  });
  process.exitCode = 1;
} else {
  console.log('Keine harten Fehler.');
}
