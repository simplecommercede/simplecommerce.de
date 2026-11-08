'use strict';
// Erst hier aktivieren: Lädt das Skript nicht, bleibt aller Inhalt sichtbar.
document.documentElement.classList.add('js');
const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Der Frosch im Logo hüpft, trifft mit der Zunge das "e" und neigt sich zum Mauszeiger.
// Die Szene läuft einmal nach dem Laden und bei jeder Berührung; das "e" dreht zusätzlich von selbst.
document.querySelectorAll('[data-logo]').forEach(logo => {
  const play = () => {
    if (!prefersMotion || logo.classList.contains('is-hopping')) return;
    logo.classList.add('is-hopping');
  };
  setTimeout(play, 1200);
  logo.addEventListener('pointerenter', play);
  logo.addEventListener('focus', play);
  logo.addEventListener('animationend', event => {
    if (event.animationName === 'logo-spin') logo.classList.remove('is-hopping');
  });
  if (prefersMotion) {
    logo.addEventListener('pointermove', event => {
      const box = logo.getBoundingClientRect();
      logo.style.setProperty('--lean', `${((event.clientX - box.left) / box.width - .16) * 5}deg`);
    });
    logo.addEventListener('pointerleave', () => logo.style.removeProperty('--lean'));
  }
});

// Froschmotive hüpfen, wenn man sie berührt.
document.querySelectorAll('[data-hop]').forEach(item => {
  if (!prefersMotion) return;
  item.addEventListener('pointerenter', () => item.classList.add('is-hopping'));
  item.addEventListener('animationend', () => item.classList.remove('is-hopping'));
});

// Inhalte erscheinen einmalig beim Scrollen; ohne Beobachter oder Bewegung bleiben sie sichtbar.
const revealItems = document.querySelectorAll('.reveal, [data-steps]');
if (prefersMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Slider: Ohne JavaScript bleibt das normale Wischen; hier kommen Pfeile, Fortschritt und Ziehen mit der Maus dazu.
document.querySelectorAll('[data-slider]').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const bar = slider.querySelector('.slider-bar');
  const progress = slider.querySelector('.slider-progress span');
  const buttons = [...slider.querySelectorAll('[data-step]')];
  const stepWidth = () => track.firstElementChild.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
  const update = () => {
    const end = track.scrollWidth - track.clientWidth;
    const share = track.clientWidth / track.scrollWidth;
    progress.style.setProperty('--progress', (share + (1 - share) * (end ? track.scrollLeft / end : 1)).toFixed(3));
    buttons.forEach(button => {
      button.disabled = Number(button.dataset.step) < 0 ? track.scrollLeft < 4 : track.scrollLeft > end - 4;
    });
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    track.scrollBy({ left: Number(button.dataset.step) * stepWidth(), behavior: prefersMotion ? 'smooth' : 'auto' });
  }));

  // Ziehen nur mit der Maus; Finger scrollen nativ. Nach dem Ziehen löst der Klick keinen Link aus.
  let grab = null;
  let dragged = false;
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    grab = { x: event.clientX, left: track.scrollLeft };
    dragged = false;
  });
  window.addEventListener('pointermove', event => {
    if (!grab) return;
    const distance = event.clientX - grab.x;
    if (!dragged && Math.abs(distance) < 6) return;
    dragged = true;
    track.classList.add('is-dragging');
    track.scrollLeft = grab.left - distance;
  });
  window.addEventListener('pointerup', () => {
    grab = null;
    track.classList.remove('is-dragging');
  });
  track.addEventListener('click', event => {
    if (!dragged) return;
    event.preventDefault();
    dragged = false;
  }, true);
  track.addEventListener('dragstart', event => event.preventDefault());

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  bar.hidden = false;
  update();
});

// Beispielrechnung; die Stufen kommen aus der Preistabelle. Ohne JavaScript bleibt die Stufenübersicht.
document.querySelectorAll('[data-calculator]').forEach(calculator => {
  const tiers = JSON.parse(calculator.dataset.calculator);
  const section = calculator.closest('section');
  const input = calculator.querySelector('input');
  const value = calculator.querySelector('output');
  const total = calculator.querySelector('#calc-total');
  const parts = calculator.querySelector('#calc-parts');
  const cards = [...section.querySelectorAll('[data-tier]')];
  /* Cent-Beträge erscheinen kleiner. */
  const showEuro = (node, amount) => {
    const [euros, cents] = amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
    const small = document.createElement('span');
    small.className = 'cents';
    small.textContent = `,${cents}`;
    node.replaceChildren(euros, small, ' €');
  };
  const update = () => {
    const revenue = Number(input.value);
    const index = tiers.findIndex(tier => tier.limit === null || revenue < tier.limit || (revenue === tier.limit && tier.limit < 80000));
    const tier = tiers[index];
    value.textContent = revenue.toLocaleString('de-DE') + ' €';
    input.style.setProperty('--fill', `${revenue / Number(input.max) * 100}%`);
    cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index));
    if (tier.rent === null || tier.rate === null) {
      total.textContent = 'Auf Anfrage';
      parts.replaceChildren();
      return;
    }
    const commission = revenue * tier.rate / 100;
    const rows = [['Shopmiete', tier.rent], [`Provision: ${tier.rate.toLocaleString('de-DE')} % von ${revenue.toLocaleString('de-DE')} €`, commission]];
    showEuro(total, tier.rent + commission);
    parts.replaceChildren(...rows.flatMap(([label, amount]) => {
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      showEuro(detail, amount);
      return [term, detail];
    }));
  };
  calculator.hidden = false;
  input.addEventListener('input', update);
  update();
});

const search = document.getElementById('hilfe-suche');
if (search) {
  const entries = [...document.querySelectorAll('#help-topics [data-topic]')];
  const groups = [...document.querySelectorAll('[data-help-group]')];
  const status = document.getElementById('suchstatus');
  const normalize = value => value.toLocaleLowerCase('de').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss');
  search.addEventListener('input', () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    entries.forEach(entry => {
      entry.hidden = !terms.every(term => normalize(entry.textContent).includes(term));
      if (!entry.hidden) count++;
    });
    groups.forEach(group => { group.hidden = !group.querySelector('[data-topic]:not([hidden])'); });
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
      if (feedback.dataset.state === 'success') contactForm.dispatchEvent(new CustomEvent('contact:sent'));
    } catch (error) {
      const heading = document.createElement('h3');
      heading.textContent = 'Wir konnten den Versand nicht bestätigen.';
      const message = document.createElement('p');
      message.textContent = 'Ihre Eingaben bleiben erhalten. Bitte prüfen Sie Ihre Verbindung. Sie erreichen uns auch unter projekt@simplecommerce.de.';
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
