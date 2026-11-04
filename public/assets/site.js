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

// Keep the draft on the page while the server validates and processes the request.
const contactForm = document.querySelector('.contact-form');
if (contactForm && window.fetch) {
  const feedback = document.createElement('div');
  feedback.className = 'contact-feedback';
  feedback.hidden = true;
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  feedback.tabIndex = -1;
  contactForm.append(feedback);
  let sending = false;
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    sending = true;
    const button = contactForm.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Anfrage wird geprüft …';
    contactForm.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST', body: new FormData(contactForm),
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json();
      if (typeof result.title !== 'string' || typeof result.message !== 'string') throw new Error('Invalid response');
      const heading = document.createElement('h3');
      heading.textContent = result.title;
      const message = document.createElement('p');
      message.textContent = result.message;
      feedback.replaceChildren(heading, message);
      feedback.dataset.state = response.ok && result.ok ? 'success' : 'error';
    } catch (error) {
      const heading = document.createElement('h3');
      heading.textContent = 'Wir konnten den Versand nicht bestätigen.';
      const message = document.createElement('p');
      message.textContent = 'Ihre Eingaben bleiben erhalten. Bitte prüfen Sie Ihre Verbindung. Sie erreichen uns auch unter info@simplecommerce.de.';
      feedback.replaceChildren(heading, message);
      feedback.dataset.state = 'error';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = originalLabel;
      contactForm.removeAttribute('aria-busy');
      feedback.hidden = false;
      feedback.focus();
    }
  });
}
