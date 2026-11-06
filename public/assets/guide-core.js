'use strict';
/*
 * Gemeinsame Grundlage für Wegweiser, Fragebogen und Kontaktformular.
 * Frosch.art    gezeichneter Frosch
 * Frosch.store  gewählte Aussagen; bleiben nur für diesen Tab im Sitzungsspeicher und auf dem Gerät.
 * Die Aussagen kommen aus content/frog-guide.json (erzeugt als guide-data.js).
 */
window.Frosch = (() => {
  const STORAGE_KEY = 'simplecommerce-anfrage';
  const { statements } = window.FROSCH_DATA;
  const byId = new Map(statements.map(statement => [statement.id, statement]));

  const art = `
    <svg class="fg-svg" viewBox="0 0 120 108" aria-hidden="true" focusable="false">
      <g class="fg-rig">
        <g class="fg-legs" fill="#ff8a1f">
          <ellipse cx="24" cy="97" rx="18" ry="6"/><circle cx="8" cy="97" r="4"/><circle cx="16" cy="102" r="4"/><circle cx="30" cy="103" r="4"/>
          <ellipse cx="96" cy="97" rx="18" ry="6"/><circle cx="112" cy="97" r="4"/><circle cx="104" cy="102" r="4"/><circle cx="90" cy="103" r="4"/>
          <ellipse cx="27" cy="78" rx="14" ry="19" fill="#57b92c" transform="rotate(-20 27 78)"/>
          <ellipse cx="93" cy="78" rx="14" ry="19" fill="#57b92c" transform="rotate(20 93 78)"/>
        </g>
        <ellipse cx="60" cy="72" rx="29" ry="27" fill="#6fd13a"/>
        <ellipse class="fg-throat" cx="60" cy="78" rx="20" ry="19" fill="#fbf7ef"/>
        <path d="M36 72Q30 88 38 96M84 72Q90 88 82 96" fill="none" stroke="#3f6fd8" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="38" cy="98" rx="9" ry="4" fill="#ff8a1f"/><ellipse cx="82" cy="98" rx="9" ry="4" fill="#ff8a1f"/>
        <g class="fg-head">
          <path d="M20 44C20 26 40 22 60 22S100 26 100 44 80 66 60 66 20 60 20 44Z" fill="#6fd13a"/>
          <path class="fg-tongue" d="M51 57q9 17 18 0Z" fill="#ee6a90"/>
          <path d="M34 50Q60 64 86 50" fill="none" stroke="#2e7a18" stroke-width="2.6" stroke-linecap="round"/>
          <ellipse cx="30" cy="50" rx="5" ry="3" fill="#ff9a57" opacity=".55"/><ellipse cx="90" cy="50" rx="5" ry="3" fill="#ff9a57" opacity=".55"/>
          ${[[36, 'l'], [84, 'r']].map(([x, side]) => `
            <circle cx="${x}" cy="26" r="15" fill="#e8401c" stroke="#2e7a18" stroke-width="2.5"/>
            <circle cx="${x}" cy="26" r="10.5" fill="#ff7a2a"/>
            <g class="fg-eye"><ellipse cx="${x}" cy="26" rx="3.6" ry="9.5" fill="#16110f"/><circle cx="${x - 2}" cy="20" r="2.4" fill="#fff"/></g>
            <circle class="fg-lid fg-lid-${side}" cx="${x}" cy="26" r="15.8" fill="#6fd13a" stroke="#2e7a18" stroke-width="2"/>`).join('')}
        </g>
      </g>
    </svg>`;

  /* Ist der Speicher gesperrt, gilt die Auswahl nur bis zum nächsten Seitenwechsel. */
  const read = () => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]').filter(id => byId.has(id));
    } catch (error) {
      return [];
    }
  };

  let ids = read();
  const listeners = new Set();
  const commit = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) { /* siehe read() */ }
    listeners.forEach(listener => listener());
  };

  const store = {
    has: id => ids.includes(id),
    items: () => statements.filter(item => ids.includes(item.id)),
    count: () => ids.length,
    add(id) {
      if (!byId.has(id) || ids.includes(id)) return;
      ids = [...ids, id];
      commit();
    },
    remove(id) {
      ids = ids.filter(other => other !== id);
      commit();
    },
    clear() {
      ids = [];
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
      const lines = this.items().map(item => `- ${item.text}`).join('\n');
      const phone = this.items().some(item => item.askPhone) ? 'Meine Telefonnummer: \n\n' : '';
      return `Hallo simplecommerce-Team,\n\ndas trifft auf mich zu:\n${lines}\n\n${phone}Können wir darüber sprechen?\n`;
    }
  };

  return { art, store, data: window.FROSCH_DATA };
})();
