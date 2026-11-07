'use strict';
/*
 * Kontaktformular: Die Antworten aus dem Fragebogen (guide-steps.js) werden zum Vorlagetext.
 * Eigene Änderungen am Text werden nie überschrieben: Ändern sich danach die Angaben, erscheint ein Hinweis.
 * Das Telefonfeld erscheint nur bei einem Rückrufwunsch. Nach dem Versand wird die Auswahl geleert.
 */
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const { store, topicFromStore, price } = window.Frosch;
  const message = form.querySelector('#nachricht');
  const topic = form.querySelector('#thema');
  const phoneField = form.querySelector('.phone-field');
  const phone = form.querySelector('#telefon');

  const help = document.createElement('button');
  help.type = 'button';
  help.className = 'form-help';
  help.innerHTML = `${window.Frosch.art}<span><strong></strong><small></small></span>`;
  help.addEventListener('click', () => document.dispatchEvent(new CustomEvent('frosch:ask')));
  form.querySelector('h2').after(help);

  const stale = document.createElement('p');
  stale.className = 'form-stale';
  stale.setAttribute('role', 'status');
  stale.hidden = true;
  const staleText = document.createElement('span');
  staleText.textContent = 'Ihre Angaben haben sich geändert, der Text noch nicht.';
  const refill = document.createElement('button');
  refill.type = 'button';
  refill.textContent = 'Text neu einfügen';
  refill.setAttribute('aria-label', 'Text neu einfügen, das ersetzt Ihren bisherigen Text');
  stale.append(staleText, refill);
  message.after(stale);

  let lastLetter = '';
  let lastTopic = null;

  const known = new URLSearchParams(window.location.search).get('thema');
  if ([...topic.options].some(option => option.value === known)) topic.value = known;

  /* Das Nachrichtenfeld wächst mit dem Text. */
  const fit = () => {
    message.style.height = 'auto';
    message.style.height = `${message.scrollHeight + message.offsetHeight - message.clientHeight}px`;
  };

  const showStale = () => {
    stale.hidden = message.value === lastLetter || store.letter() === lastLetter;
  };

  const insert = () => {
    lastLetter = store.letter();
    message.value = lastLetter;
    fit();
  };

  const render = () => {
    if (!message.value.trim() || message.value === lastLetter) insert();
    showStale();

    const main = topicFromStore();
    if (main && main !== lastTopic && [...topic.options].some(option => option.value === main)) topic.value = main;
    lastTopic = main;

    const wanted = store.wantsCall();
    phoneField.classList.toggle('is-wanted', wanted);
    phone.required = wanted;
    phone.disabled = !wanted;
    if (!wanted && phoneField.dataset.shown) phone.value = '';
    if (wanted) phoneField.dataset.shown = 'true'; else delete phoneField.dataset.shown;

    const count = store.count();
    help.querySelector('strong').textContent = count ? `${count === 1 ? '1 Angabe' : `${count} Angaben`} übernommen` : 'Nicht sicher, was Sie schreiben sollen?';
    const sum = price.short();
    help.querySelector('small').textContent = count
      ? `${sum ? `${sum} · ` : ''}Ändern`
      : 'Der Frosch stellt ein paar kurze Fragen und schreibt den Text vor.';
  };

  refill.addEventListener('click', () => {
    insert();
    showStale();
    message.focus();
  });
  message.addEventListener('input', () => {
    fit();
    showStale();
  });
  store.subscribe(render);
  render();
  form.addEventListener('contact:sent', () => {
    const sentText = message.value;
    store.clear();
    message.value = sentText;
    lastLetter = sentText;
    stale.hidden = true;
    fit();
  });
})();
