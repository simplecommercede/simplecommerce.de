'use strict';
/*
 * Preisschätzung aus den gewählten Angaben. Frosch, Kontaktformular und die Seite /preisrechner/
 * nutzen dieselbe Berechnung und dieselbe Auswahl aus Frosch.store.
 * Shopkosten folgen der Preistabelle: Miete je Umsatzstufe plus Provision auf den Umsatz.
 * Werte stehen in content/price-estimate.json; "entwurf" wird bis zur fachlichen Freigabe ausschließlich als individuelles Angebot dargestellt.
 *
 * Aufbau: 1. Berechnung  2. Darstellung  3. Seite Preisrechner
 */
(() => {
  const { store, data, levelsFor, dropForTopic, topicFromStore } = window.Frosch;
  const { released, effects, tiers } = data.prices;

  /* ---------- 1. Berechnung ---------- */

  const tierOf = revenue => tiers.findIndex(tier => tier.limit === null || revenue < tier.limit || (revenue === tier.limit && tier.limit < 80000));
  const monthlyAt = (tier, revenue) => tier.rent + revenue * tier.rate / 100;

  /* Mit bekanntem Umsatz ein genauer Wert, sonst die Spanne innerhalb der Stufe. Ohne Preis in der Tabelle: null. */
  function tierRange(index, revenue) {
    const tier = tiers[index];
    if (tier.rent === null || tier.rate === null) return null;
    if (revenue !== null && tierOf(revenue) === index) return [monthlyAt(tier, revenue), monthlyAt(tier, revenue)];
    const from = index ? tiers[index - 1].limit : 0;
    return [monthlyAt(tier, from), monthlyAt(tier, tier.limit)];
  }

  function estimate() {
    const items = store.items();
    const result = { once: [0, 0], monthly: [0, 0], lines: [], onRequest: false, draft: false, individual: false, shop: false, ranged: false };
    const add = (target, range) => { target[0] += range[0]; target[1] += range[1]; };
    items.forEach(item => {
      const effect = effects[item.id];
      if (!effect) return;
      const isDraft = effect.source === 'entwurf';
      const line = { label: effect.label, draft: isDraft };
      if (effect.onRequest || (isDraft && !released)) {
        result.individual = true;
        line.individual = true;
        result.lines.push(line);
        return;
      }
      if (effect.once) {
        line.once = effect.once;
        add(result.once, line.once);
      }
      if (effect.monthly) {
        line.monthly = effect.monthly;
        add(result.monthly, line.monthly);
      }
      if (effect.tier !== undefined) {
        const revenue = item.id.startsWith('umsatz-') ? store.revenue() : null;
        const range = tierRange(effect.tier, revenue);
        result.shop = true;
        if (range) {
          line.monthly = range;
          line.note = tierNote(tiers[effect.tier], revenue !== null && tierOf(revenue) === effect.tier ? revenue : null);
          add(result.monthly, range);
        } else {
          line.onRequest = true;
          line.note = 'Ab 80.000 € Monatsumsatz erstellen wir ein eigenes Angebot.';
          result.onRequest = true;
        }
      }
      if ((line.once && line.once[0] !== line.once[1]) || (line.monthly && line.monthly[0] !== line.monthly[1])) result.ranged = true;
      result.lines.push(line);
    });
    return result;
  }

  /* ---------- 2. Darstellung ---------- */

  const money = value => value.toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
  const span = range => (range[0] === range[1] ? `${money(range[0])} €` : `${money(range[0])} bis ${money(range[1])} €`);
  const hasValue = range => range[1] > 0;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  /* So setzt sich der Shop-Monatsbetrag zusammen. */
  function tierNote(tier, revenue) {
    const rate = tier.rate.toLocaleString('de-DE');
    if (revenue === null) return `Miete ${money(tier.rent)} € + ${rate} % Provision auf den Umsatz. Die Spanne gilt für die ganze Umsatzstufe.`;
    return `Miete ${money(tier.rent)} € + ${rate} % von ${money(revenue)} € = ${money(revenue * tier.rate / 100)} € Provision`;
  }

  /* Cent-Beträge erscheinen kleiner. */
  function addMoney(node, value) {
    const [euro, cent] = money(value).split(',');
    node.append(euro);
    if (cent) node.append(element('span', 'cents', `,${cent}`));
  }

  function addSpan(node, range) {
    addMoney(node, range[0]);
    if (range[0] !== range[1]) {
      node.append(' bis ');
      addMoney(node, range[1]);
    }
    node.append(' €');
  }

  /* Der Preisrahmen am Ende des Vorlagetexts. */
  function letterText() {
    const result = estimate();
    if (!result.lines.length) return '';
    const rows = [];
    if (hasValue(result.once)) rows.push(`- einmalig etwa ${span(result.once)}`);
    if (hasValue(result.monthly)) rows.push(`- laufend etwa ${span(result.monthly)} im Monat`);
    if (result.onRequest) rows.push('- Shopmiete und Provision auf Anfrage');
    const known = rows.length ? `Bekannte Preisbestandteile laut Shop-Preisliste (unverbindlich, zuzüglich Mehrwertsteuer):\n${rows.join('\n')}\n\n` : '';
    return known + (result.individual ? `Bitte erstellen Sie mir ein individuelles Angebot für die gewählten Leistungen.${known ? ' Weitere Kosten sind in den genannten Preisbestandteilen nicht enthalten.' : ''}\n\n` : '');
  }

  /* Klärt, was die Zahlen bedeuten; nur was zur aktuellen Auswahl passt. */
  function factsFor(result) {
    const facts = [];
    if (hasValue(result.once) && hasValue(result.monthly)) facts.push('Der einmalige Betrag fällt einmal an, der Monatsbetrag jeden Monat.');
    if (result.shop) {
      facts.push('Im Shop enthalten: Hosting, alle Shopmodule und alle Schnittstellen.');
      facts.push('Die Provision rechnet sich hier auf den gesamten Monatsumsatz und gilt für Bestellungen aus Ihrem eigenen Shop. Für externe und manuelle Bestellungen gilt eine eigene Provision.');
      facts.push('In einer höheren Umsatzstufe sinkt der Provisionssatz. Knapp über einer Stufengrenze kann der Gesamtbetrag deshalb niedriger sein als knapp darunter.');
    }
    if (result.ranged) facts.push('Eine Spanne zeigt den üblichen Bereich. Wo Sie darin liegen, klären wir im Gespräch.');
    return facts;
  }

  /* Der Kasten für Frosch, Formular und Preisrechner. */
  function box({ details = false, link = false } = {}) {
    const result = estimate();
    if (!result.lines.length) return null;
    const root = element('div', 'price-box');
    root.append(element('p', 'price-box-title', result.individual ? 'Ihr individuelles Angebot' : 'Kostenübersicht'));
    const totals = element('dl', 'price-box-totals');
    const row = (list, term, fill) => {
      const value = element('dd');
      fill(value);
      list.append(element('dt', '', term), value);
    };
    if (hasValue(result.once)) row(totals, 'Einmalig', node => addSpan(node, result.once));
    if (hasValue(result.monthly)) row(totals, 'Im Monat', node => addSpan(node, result.monthly));
    if (result.onRequest) row(totals, 'Shop', node => node.append('auf Anfrage'));
    if (result.individual) root.append(element('p', 'price-box-request', 'Wir klären Umfang und Aufwand mit Ihnen und erstellen ein passendes Angebot.'));
    if (result.individual && (hasValue(result.once) || hasValue(result.monthly))) root.append(element('p', 'price-box-note', 'Die folgenden Preisbestandteile decken nur einen Teil Ihrer Auswahl ab. Individuelle Leistungen kommen hinzu.'));
    root.append(totals);
    if (details) {
      const list = element('dl', 'price-box-lines');
      result.lines.forEach(line => {
        row(list, line.label, node => {
          if (line.once) {
            addSpan(node, line.once);
            node.append(' einmalig');
          }
          if (line.once && line.monthly) node.append(', ');
          if (line.monthly) {
            addSpan(node, line.monthly);
            node.append(' im Monat');
          }
          if (line.onRequest || line.individual) node.append('auf Anfrage');
        });
        if (line.note) list.append(element('dd', 'price-line-note', line.note));
      });
      root.append(list);
      const facts = factsFor(result);
      if (facts.length) {
        const more = element('details', 'price-box-more');
        more.append(element('summary', '', 'So ist das gerechnet'));
        const notes = element('ul', 'price-box-facts');
        facts.forEach(fact => notes.append(element('li', '', fact)));
        more.append(notes);
        root.append(more);
      }
    }
    if (hasValue(result.once) || hasValue(result.monthly) || result.onRequest) root.append(element('p', 'price-box-note', 'Preisbestandteile gemäß Shop-Preisliste, zuzüglich Mehrwertsteuer. Das verbindliche Angebot folgt nach dem Gespräch.'));

    if (link && !result.individual) {
      const check = element('a', 'price-box-link', 'Im Preisrechner prüfen');
      check.href = '/preisrechner/';
      root.append(check);
    }
    return root;
  }

  /* Eine Zeile für unterwegs, zum Beispiel im Fragebogen. */
  function short() {
    const result = estimate();
    const parts = [];
    if (hasValue(result.once)) parts.push(`${span(result.once)} einmalig`);
    if (hasValue(result.monthly)) parts.push(`${span(result.monthly)} im Monat`);
    if (result.onRequest) parts.push('Shop auf Anfrage');
    if (result.individual) parts.push(parts.length ? 'weitere Leistungen auf Anfrage' : 'Individuelles Angebot');
    return parts.join(' + ');
  }

  window.Frosch.price = { estimate, letterText, box, short, isDraft: () => estimate().draft && !released };

  /* ---------- 3. Seite Preisrechner ---------- */

  const page = document.querySelector('[data-estimator]');
  if (!page) return;

  /* Es erscheinen nur Fragen und Antworten, die den Preis wirklich ändern. */
  const pricedLevels = name => levelsFor(name).slice(1)
    .map(level => ({ ...level, options: level.options.filter(option => effects[option.statement]) }))
    .filter(level => level.options.length);
  const hasOwnPrice = name => pricedLevels(name).some(level => level.id !== 'extra');
  const topics = data.questionnaire.first.options.filter(option => hasOwnPrice(option.topic));

  let topic = topicFromStore();
  /* Leistungsseiten verlinken direkt auf ihr Thema. */
  const wanted = new URLSearchParams(window.location.search).get('thema');
  if (topics.some(option => option.topic === wanted) && wanted !== topic) {
    dropForTopic(topic, wanted);
    topic = wanted;
  }

  const form = element('div', 'estimator-form');
  const result = element('div', 'estimator-result');
  result.id = 'preis-ergebnis';
  result.setAttribute('aria-live', 'polite');
  page.replaceChildren(form, result);

  /* Auf dem Handy bleibt die Summe sichtbar, solange das Ergebnis außerhalb des Bildschirms liegt. */
  const bar = element('a', 'est-bar');
  bar.href = '#preis-ergebnis';
  bar.hidden = true;
  page.after(bar);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => bar.classList.toggle('is-away', !entry.isIntersecting)).observe(result);
  } else {
    bar.classList.add('is-away');
  }

  function group(legend) {
    const fieldset = element('fieldset', 'est-group');
    fieldset.append(element('legend', '', legend));
    return fieldset;
  }

  function choice(parent, type, name, text, checked, onClick) {
    const label = element('label', 'est-option');
    const input = element('input');
    input.type = type;
    input.name = name;
    input.checked = checked;
    input.addEventListener('click', onClick);
    label.append(input, element('span', '', text));
    parent.append(label);
  }

  function topicGroup() {
    const fieldset = group(data.questionnaire.first.question);
    topics.forEach(option => {
      choice(fieldset, 'radio', 'est-topic', option.label, option.topic === topic, () => {
        if (option.topic === topic) return;
        dropForTopic(topic, option.topic);
        topic = option.topic;
        renderForm();
        renderResult();
        form.querySelector('input[name="est-topic"]:checked')?.focus();
      });
    });
    return fieldset;
  }

  function checkOptions(parent, level) {
    level.options.forEach(option => {
      choice(parent, 'checkbox', `est-${level.id}`, option.label, store.has(option.statement), event => {
        if (event.target.checked) store.add(option.statement); else store.remove(option.statement);
      });
    });
  }

  /* Ein zweiter Klick nimmt die Antwort wieder zurück. */
  function radioOptions(parent, level) {
    level.options.forEach(option => {
      choice(parent, 'radio', `est-${level.id}`, option.label, store.has(option.statement), event => {
        const wasChosen = store.has(option.statement);
        level.options.forEach(other => store.remove(other.statement));
        if (wasChosen) event.target.checked = false; else store.add(option.statement);
      });
    });
  }

  function singleGroup(level) {
    const fieldset = group(level.question);
    if (level.options.length === 1) checkOptions(fieldset, level); else radioOptions(fieldset, level);
    return fieldset;
  }

  /* Zusatzwünsche bleiben eingeklappt, bis sie gebraucht werden. */
  function extraGroup(level) {
    const more = element('details', 'est-more');
    more.open = level.options.some(option => store.has(option.statement));
    more.append(element('summary', '', level.question));
    const body = element('div', 'est-more-body');
    radioOptions(body, level);
    more.append(body);
    return more;
  }

  /* Umsatz als Regler, wie auf den Shop-Preisen. */
  function revenueGroup(level) {
    const wrap = element('div', 'est-revenue calc-input');
    const label = element('label', '', level.question);
    label.htmlFor = 'est-umsatz';
    const value = element('output');
    value.htmlFor = 'est-umsatz';
    const input = element('input');
    input.id = 'est-umsatz';
    input.type = 'range';
    input.min = '0';
    input.max = '100000';
    input.step = '1000';
    const known = store.revenue();
    input.value = String(known === null ? 5000 : known);
    const scale = element('div', 'calc-scale');
    scale.append(element('span', '', '0 €'), element('span', '', '100.000 €'));
    const show = () => {
      value.textContent = store.revenue() === null ? 'Regler bewegen' : `${Number(input.value).toLocaleString('de-DE')} €`;
      input.style.setProperty('--fill', `${Number(input.value) / Number(input.max) * 100}%`);
    };
    input.addEventListener('input', () => {
      const revenue = Number(input.value);
      const index = tierOf(revenue);
      level.options.forEach(option => { if (effects[option.statement].tier !== index) store.remove(option.statement); });
      store.setRevenue(revenue);
      store.add(level.options.find(option => effects[option.statement].tier === index).statement);
      show();
    });
    wrap.append(label, value, input, scale);
    show();
    return wrap;
  }

  /* Fallen durch eine Antwort andere weg, baut sich die Auswahl neu auf; der Fokus bleibt auf derselben Antwort. */
  const shownOptions = () => (topic ? pricedLevels(topic).flatMap(level => level.options.map(option => option.statement)).join() : '');
  let shown = '';

  function syncForm() {
    if (shownOptions() === shown) return;
    const active = document.activeElement.closest && document.activeElement.closest('.est-option');
    const text = active && active.textContent;
    renderForm();
    const same = [...form.querySelectorAll('.est-option')].find(option => option.textContent === text);
    if (same) same.querySelector('input').focus();
  }

  function renderForm() {
    shown = shownOptions();
    form.replaceChildren(topicGroup());
    if (!topic) return;
    pricedLevels(topic).forEach(level => {
      if (level.id === 'umsatz') form.append(revenueGroup(level));
      else if (level.id === 'extra') form.append(extraGroup(level));
      else form.append(singleGroup(level));
    });
    const reset = element('button', 'est-reset', 'Auswahl zurücksetzen');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      store.clear();
      topic = null;
      renderForm();
      renderResult();
      form.querySelector('input')?.focus();
    });
    form.append(reset);
  }

  function renderBar() {
    const sum = estimate();
    bar.hidden = !sum.lines.length;
    bar.replaceChildren();
    const text = element('span', 'est-bar-sum');
    if (hasValue(sum.once)) {
      addSpan(text, sum.once);
      text.append(' einmalig');
    }
    if (hasValue(sum.once) && hasValue(sum.monthly)) text.append(' + ');
    if (hasValue(sum.monthly)) {
      addSpan(text, sum.monthly);
      text.append(' im Monat');
    }
    if (sum.individual) text.append(hasValue(sum.once) || hasValue(sum.monthly) ? ' + Angebot für weitere Leistungen' : 'Individuelles Angebot');
    if (sum.onRequest) text.append(hasValue(sum.once) || hasValue(sum.monthly) || sum.individual ? ' + Shop auf Anfrage' : 'Shop auf Anfrage');
    bar.append(text, element('span', 'est-bar-go', 'Ansehen'));
  }

  function renderResult() {
    const priceBox = box({ details: true });
    result.replaceChildren();
    renderBar();
    if (!priceBox) {
      result.append(element('p', 'price-box-empty', topic ? 'Wählen Sie aus, was Sie vorhaben. Hier erscheint der nächste Schritt.' : 'Wählen Sie zuerst, wobei wir helfen dürfen.'));
      return;
    }
    const next = element('a', 'button', 'In die Anfrage übernehmen');
    next.href = topic ? `/kontakt/?thema=${encodeURIComponent(topic)}` : '/kontakt/';
    result.append(priceBox, next);
  }

  store.subscribe(() => {
    syncForm();
    renderResult();
  });
  renderForm();
  renderResult();
})();
