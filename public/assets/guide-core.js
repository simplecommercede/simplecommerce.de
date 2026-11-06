'use strict';
/*
 * Gemeinsame Grundlage für Wegweiser, Fragebogen und Kontaktformular.
 * Frosch.art    gezeichneter Frosch
 * Frosch.store  gewählte Aussagen; bleiben nur für diesen Tab im Sitzungsspeicher und auf dem Gerät.
 * Die Aussagen kommen aus content/frog-guide.json (erzeugt als guide-data.js).
 */
window.Frosch = (() => {
  const STORAGE_KEY = 'simplecommerce-anfrage';
  const REVENUE_KEY = 'simplecommerce-umsatz';
  const { statements, questionnaire } = window.FROSCH_DATA;
  const { first, details, followUp, common } = questionnaire;
  const byId = new Map(statements.map(statement => [statement.id, statement]));

  /*
   * Gezeichnet nach dem Rotaugenlaubfrosch der Markenbilder: limettengrüner Kopf, helle Kehle, rote Augen
   * mit senkrechter Pupille, blaue Flanken mit gelber Kante, orange Finger mit runden Haftscheiben.
   * Die Verläufe liegen einmal im Dokument, damit sie auch in ausgeblendeten Kopien gelten.
   */
  const paint = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  paint.setAttribute('aria-hidden', 'true');
  paint.setAttribute('focusable', 'false');
  paint.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  paint.innerHTML = `
    <defs>
      <linearGradient id="fg-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3ec3a"/><stop offset=".55" stop-color="#8fd92a"/><stop offset="1" stop-color="#5fb81f"/></linearGradient>
      <linearGradient id="fg-belly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf4"/><stop offset="1" stop-color="#ecdcc0"/></linearGradient>
      <radialGradient id="fg-iris" cx=".42" cy=".36" r=".72"><stop offset="0" stop-color="#ff8a2e"/><stop offset=".55" stop-color="#f4501a"/><stop offset="1" stop-color="#b81a10"/></radialGradient>
    </defs>`;
  document.body.append(paint);

  /* Finger und Zehen laufen strahlenförmig aus und enden in runden Haftscheiben. */
  const toes = (x, y, length, angles) => angles.map(angle => {
    const endX = (x + Math.cos(angle * Math.PI / 180) * length).toFixed(1);
    const endY = (y + Math.sin(angle * Math.PI / 180) * length).toFixed(1);
    return `<path d="M${x} ${y}L${endX} ${endY}" stroke="#ff7a1c" stroke-width="3.2" stroke-linecap="round"/><circle cx="${endX}" cy="${endY}" r="2.7" fill="#ff9430"/>`;
  }).join('');

  const art = `
    <svg class="fg-svg" viewBox="0 0 120 108" aria-hidden="true" focusable="false">
      <g class="fg-rig">
        <g class="fg-legs">
          ${toes(19, 94, 14, [95, 135, 170, 205])}${toes(101, 94, 14, [85, 45, 10, -25])}
          <path d="M36 62C16 62 6 80 15 92c7 8 21 5 28-5Z" fill="url(#fg-skin)"/>
          <path d="M84 62C104 62 114 80 105 92c-7 8-21 5-28-5Z" fill="url(#fg-skin)"/>
          <path d="M31 70C22 75 18 83 22 90" fill="none" stroke="#3b57c8" stroke-width="5" stroke-linecap="round"/>
          <path d="M89 70C98 75 102 83 98 90" fill="none" stroke="#3b57c8" stroke-width="5" stroke-linecap="round"/>
        </g>
        <path d="M33 60C29 80 37 99 60 99S91 80 87 60Z" fill="url(#fg-belly)"/>
        <path d="M34 63C32 75 35 87 42 94" fill="none" stroke="#3b57c8" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M86 63C88 75 85 87 78 94" fill="none" stroke="#3b57c8" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M38 64C36 75 39 85 45 92M82 64C84 75 81 85 75 92" fill="none" stroke="#f6e04a" stroke-width="1.6" stroke-linecap="round"/>
        <ellipse class="fg-throat" cx="60" cy="69" rx="21" ry="13" fill="url(#fg-belly)"/>
        ${toes(40, 97, 10, [100, 145, 190])}${toes(80, 97, 10, [80, 35, -10])}
        <path d="M40 66Q31 80 40 96M80 66Q89 80 80 96" fill="none" stroke="#86d326" stroke-width="7.5" stroke-linecap="round"/>
        <path d="M40 72Q35 81 40 91M80 72Q85 81 80 91" fill="none" stroke="#3b57c8" stroke-width="2.4" stroke-linecap="round"/>
        <g class="fg-head">
          <path d="M23 46H97V55C92 69 76 73 60 73S28 69 23 55Z" fill="url(#fg-belly)"/>
          <path d="M14 44C14 30 36 22 60 22S106 30 106 44C106 53 97 57 86 59 70 62 50 62 34 59 23 57 14 53 14 44Z" fill="url(#fg-skin)"/>
          <path class="fg-tongue" d="M50 60q10 15 20 0Z" fill="#ee6a90"/>
          <path d="M19 51C36 63 84 63 101 51" fill="none" stroke="#3f8416" stroke-width="2" stroke-linecap="round"/>
          <circle cx="54" cy="36" r="1.1" fill="#3f8416"/><circle cx="66" cy="36" r="1.1" fill="#3f8416"/>
          <ellipse cx="60" cy="29" rx="14" ry="3.6" fill="#f2fbb0" opacity=".45"/>
          ${[[33, 'l'], [87, 'r']].map(([x, side]) => `
            <circle cx="${x}" cy="29" r="18" fill="url(#fg-skin)"/>
            <circle cx="${x}" cy="29" r="14.5" fill="url(#fg-iris)" stroke="#7a1208" stroke-width="1.2"/>
            <g class="fg-eye"><path d="M${x} 17.5C${x + 3.6} 23 ${x + 3.6} 35 ${x} 40.5C${x - 3.6} 35 ${x - 3.6} 23 ${x} 17.5Z" fill="#120d0b"/><circle cx="${x - 5}" cy="23" r="2.4" fill="#fff"/></g>
            <circle class="fg-lid fg-lid-${side}" cx="${x}" cy="29" r="15.6" fill="url(#fg-skin)" stroke="#5a9e1c" stroke-width="1.4"/>`).join('')}
        </g>
      </g>
    </svg>`;

  /* Ebenen eines Themas: Thema, Detail, Vertiefung, dann die gemeinsamen Fragen, die dazu passen. */
  const fits = (level, topic) => !(level.skipFor || []).includes(topic) && (!level.onlyFor || level.onlyFor.includes(topic));
  const levelsFor = topic => {
    const levels = [{ id: 'first', ...first }, { id: 'details', ...(details[topic] || { question: '', options: [] }) }];
    /* Antworten, die einer früheren widersprechen, entfallen; bleibt keine echte Wahl, entfällt die Frage. */
    const allowed = option => !(option.hideIf || []).some(id => ids.includes(id));
    if (followUp[topic]) {
      const options = followUp[topic].options.filter(allowed);
      if (options.length > 1) levels.push({ id: 'followUp', ...followUp[topic], options });
    }
    common.filter(level => fits(level, topic)).forEach(level => {
      levels.push({ ...level, options: level.options.filter(option => option.hideFor !== topic && allowed(option)) });
    });
    return levels;
  };

  /* Die Reihenfolge der Fragen bestimmt die Reihenfolge im Text, egal in welcher Folge geklickt wurde. */
  const rank = new Map();
  [...Object.values(details), ...Object.values(followUp), ...common].forEach(level => {
    level.options.forEach(option => { if (!rank.has(option.statement)) rank.set(option.statement, rank.size); });
  });

  /* Welche Antworten eine andere Antwort ausschließt. */
  const conflicts = new Map();
  [...Object.values(followUp), ...common].forEach(level => {
    level.options.forEach(option => {
      (option.hideIf || []).forEach(id => conflicts.set(id, [...(conflicts.get(id) || []), option.statement]));
    });
  });

  /* Ist der Speicher gesperrt, gilt die Auswahl nur bis zum nächsten Seitenwechsel. */
  const read = () => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]').filter(id => byId.has(id));
    } catch (error) {
      return [];
    }
  };

  let ids = read();
  const readRevenue = () => {
    try {
      const value = sessionStorage.getItem(REVENUE_KEY);
      return value !== null && Number.isFinite(Number(value)) ? Number(value) : null;
    } catch (error) {
      return null;
    }
  };
  let revenue = readRevenue();
  const listeners = new Set();
  const commit = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      if (revenue === null) sessionStorage.removeItem(REVENUE_KEY); else sessionStorage.setItem(REVENUE_KEY, String(revenue));
    } catch (error) { /* siehe read() */ }
    listeners.forEach(listener => listener());
  };

  const store = {
    has: id => ids.includes(id),
    items: () => statements.filter(item => ids.includes(item.id)).sort((a, b) => rank.get(a.id) - rank.get(b.id)),
    revenue: () => revenue,
    setRevenue(value) {
      revenue = value;
      commit();
    },
    count: () => ids.length,
    add(id) {
      if (!byId.has(id) || ids.includes(id)) return;
      const excluded = conflicts.get(id) || [];
      ids = [...ids.filter(other => !excluded.includes(other)), id];
      commit();
    },
    remove(id) {
      ids = ids.filter(other => other !== id);
      commit();
    },
    clear() {
      ids = [];
      revenue = null;
      commit();
    },
    subscribe(listener) { listeners.add(listener); },

    /* Thema mit den meisten Aussagen; bei Gleichstand das zuerst gewählte. */
    mainTopic() {
      const counts = new Map();
      this.items().filter(item => item.topic).forEach(item => counts.set(item.topic, (counts.get(item.topic) || 0) + 1));
      return [...counts.entries()].reduce((best, entry) => (!best || entry[1] > best[1] ? entry : best), null)?.[0] || null;
    },

    /* Vorlagetext für das Kontaktformular. */
    letter() {
      if (!ids.length) return '';
      const facts = this.items().filter(item => !item.closing).map(item => `- ${item.text}`).join('\n');
      const wishes = this.items().filter(item => item.closing).map(item => item.text).join(' ');
      const price = window.Frosch.price ? window.Frosch.price.letterText() : '';
      return `Hallo simplecommerce-Team,\n\n${facts ? `darum geht es:\n${facts}\n\n` : ''}${price}${wishes || 'Können wir darüber sprechen?'}\n`;
    },

    /* Soll zurückgerufen werden, braucht das Formular eine Nummer. */
    wantsCall() { return this.items().some(item => item.askPhone); }
  };

  /* Das Thema folgt aus der ersten Antwort, sonst aus Folgefragen und Fragen, die es nur bei einem Thema gibt. */
  const answered = level => level && level.options.some(option => store.has(option.statement));
  const topicFromStore = () => {
    const topics = Object.keys(details);
    return topics.find(topic => answered(details[topic]))
      || topics.find(topic => answered(followUp[topic]) || common.some(level => (level.onlyFor || []).join() === topic && answered(level)))
      || null;
  };

  /* Ein anderes Thema verwirft die Antworten, die dazu nicht mehr passen. */
  const dropForTopic = (oldTopic, newTopic) => {
    if (oldTopic && oldTopic !== newTopic) {
      [details[oldTopic], followUp[oldTopic]].filter(Boolean).forEach(level => {
        level.options.forEach(option => store.remove(option.statement));
      });
    }
    common.forEach(level => {
      const dropAll = !fits(level, newTopic);
      level.options.filter(option => dropAll || option.hideFor === newTopic).forEach(option => store.remove(option.statement));
    });
    if (newTopic !== 'Shopsystem') store.setRevenue(null);
  };

  return { art, store, data: window.FROSCH_DATA, levelsFor, topicFromStore, dropForTopic };
})();
