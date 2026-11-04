'use strict';
const search = document.getElementById('hilfe-suche');
if (search) {
  const entries = [...document.querySelectorAll('#help-topics [data-topic]')];
  const status = document.getElementById('suchstatus');
  const normalize = value => value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
  search.addEventListener('input', () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    entries.forEach(entry => {
      entry.hidden = !terms.every(term => normalize(entry.textContent).includes(term));
      if (!entry.hidden) count++;
    });
    status.textContent = terms.length ? (count ? `${count} passende Hilfethemen` : 'Kein passendes Thema gefunden. Versuchen Sie einen anderen Suchbegriff oder kontaktieren Sie uns.') : '';
  });
}
