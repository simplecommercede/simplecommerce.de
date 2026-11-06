'use strict';
/*
 * Kontaktformular: Die Antworten aus dem Fragebogen (guide-steps.js) werden zum Vorlagetext.
 * Eigene Änderungen am Text werden nie überschrieben; nach dem Versand wird die Auswahl geleert.
 */
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const { store } = window.Frosch;
  const message = form.querySelector('#nachricht');
  const topic = form.querySelector('#thema');
  const help = document.createElement('button');
  help.type = 'button';
  help.className = 'form-help';
  help.innerHTML = `${window.Frosch.art}<span><strong></strong><small></small></span>`;
  help.addEventListener('click', () => document.dispatchEvent(new CustomEvent('frosch:ask')));
  const basket = document.createElement('div');
  basket.className = 'form-basket';
  basket.setAttribute('aria-live', 'polite');
  form.querySelector('h2').after(help, basket);
  let lastLetter = '';

  const render = () => {
    if (!message.value.trim() || message.value === lastLetter) {
      lastLetter = store.letter();
      message.value = lastLetter;
    }
    const main = store.mainTopic();
    if (main && [...topic.options].some(option => option.value === main || option.text === main)) topic.value = main;

    help.querySelector('strong').textContent = store.count() ? 'Angaben ergänzen oder ändern' : 'Nicht sicher, was Sie schreiben sollen?';
    help.querySelector('small').textContent = store.count() ? 'Der Frosch zeigt Ihnen Ihre Antworten.' : 'Der Frosch stellt ein paar kurze Fragen und schreibt den Text vor.';

    basket.replaceChildren();
    if (!store.count()) return;
    const title = document.createElement('p');
    title.className = 'form-basket-title';
    title.textContent = 'Ihre Angaben:';
    const list = document.createElement('ul');
    store.items().forEach(item => {
      const row = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = item.text;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Angabe entfernen: ${item.text}`);
      remove.addEventListener('click', () => store.remove(item.id));
      row.append(text, remove);
      list.append(row);
    });
    basket.append(title, list);
  };

  store.subscribe(render);
  render();
  form.addEventListener('contact:sent', () => {
    lastLetter = message.value;
    store.clear();
  });
})();
