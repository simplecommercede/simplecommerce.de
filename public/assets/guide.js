'use strict';
/*
 * Frosch-Wegweiser
 * Zusätzlich zur Navigation: Alle Ziele bleiben auch ohne ihn und ohne JavaScript erreichbar.
 * Er bewegt sich nie von selbst über die Seite: Man kann ihn verschieben, und erst bei der Wahl
 * eines Ziels im Teich springt er durch die Scheibe (guide-glass.js). Im Teich führt der Fragebogen
 * (guide-steps.js) zur Anfrage, die Antworten liegen in guide-core.js.
 *
 * Die Mimik bleibt an Ort und Stelle: Freude bei Antworten, Fliege fangen und Nickerchen, wenn nichts passiert.
 *
 * Aufbau: 1. Inhalte  2. Hilfsfunktionen  3. Ausweichen  4. Frosch  5. Teich  6. Sprung durch die Scheibe  7. Start
 */
(() => {
  const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- 1. Inhalte ---------- */

  const DESTINATIONS = [
    ['Onlineshop', '/shopsystem/'], ['Website', '/webseiten/'], ['IT-Beratung', '/it-beratung/'],
    ['Software', '/it-projekte/'], ['KI', '/ki-anwendungen/'], ['Service', '/service/'],
    ['Shop-Preise', '/preise/'], ['Preisrechner', '/preisrechner/'], ['Online-Hilfe', '/hilfe/'], ['Kontakt', '/kontakt/']
  ];

  const hour = new Date().getHours();
  const GREETING = hour < 11 ? 'Quak, guten Morgen!' : hour < 18 ? 'Quak, hallo!' : 'Quak, guten Abend!';

  const HINTS = {
    '/': [`${GREETING} Wohin darf ich Sie bringen?`, null],
    '/shopsystem/': ['Das steckt im Shopsystem. Wollen Sie den Preis wissen?', ['Preis schätzen', '/preisrechner/?thema=Shopsystem']],
    '/preisrechner/': ['Wählen Sie Ihre Optionen, ich rechne mit.', ['Zur Anfrage', '/kontakt/']],
    '/preise/': ['Schieben Sie den Regler, ich rechne mit.', ['Gesamtkosten schätzen', '/preisrechner/?thema=Shopsystem']],
    '/leistungen/': ['Was steht bei Ihnen an?', ['Projekt besprechen', '/kontakt/']],
    '/webseiten/': ['Eine eigene Website? Erzählen Sie uns davon.', ['Preis schätzen', '/preisrechner/?thema=Webseitenerstellung']],
    '/it-beratung/': ['Sortieren wir das gemeinsam?', ['Preis schätzen', '/preisrechner/?thema=IT-Beratung']],
    '/it-projekte/': ['Haben Sie schon einen Ablauf im Kopf?', ['Preis schätzen', '/preisrechner/?thema=IT-Projekt']],
    '/ki-anwendungen/': ['Welche Aufgabe soll Ihnen die KI abnehmen?', ['Preis schätzen', '/preisrechner/?thema=KI-Anwendungen']],
    '/service/': ['Wo können wir Ihnen helfen?', ['Preis schätzen', '/preisrechner/?thema=Service']],
    '/hilfe/': ['Suchen Sie oben einfach nach Ihrem Thema.', ['Lieber persönlich fragen', '/kontakt/']],
    '/kontakt/': ['Schreiben Sie uns kurz, wir melden uns persönlich.', null]
  };
  const HELP_HINT = ['Eine andere Anleitung gesucht?', ['Alle Hilfethemen', '/hilfe/']];
  const DEFAULT_HINT = ['Mehr wissen? Ich bringe Sie hin.', ['Projekt besprechen', '/kontakt/']];

  /* Auf diesen Seiten kennt der Frosch das Thema und überspringt die erste Frage. */
  const PAGE_TOPICS = {
    '/shopsystem/': 'Shopsystem', '/preise/': 'Shopsystem', '/webseiten/': 'Webseitenerstellung', '/it-beratung/': 'IT-Beratung',
    '/it-projekte/': 'IT-Projekt', '/ki-anwendungen/': 'KI-Anwendungen', '/service/': 'Service'
  };
  const topicOfPage = path => PAGE_TOPICS[path] || (path.startsWith('/shopsystem/') ? 'Shopsystem' : undefined);

  /* Nichts los: erst schnappt er sich eine Fliege, später nickt er ein. */
  const FLY_AFTER = 20000;
  const SLEEP_AFTER = 45000;

  /* Was beim Verschieben ausweicht: Buchstaben, Wörter und ganze Formen, jeweils mit eigener Reichweite und Stärke. */
  const SKIP_INSIDE = '.prose, .help-section, .help-sidebar, .calculator, .table-scroll, .contact-form, .faq';
  const SCATTER_GROUPS = [
    { split: 'letters', selector: 'main h1, main h2, main h3, .motif-caption', radius: 170, force: 72, spin: .9 },
    { split: 'words', selector: '.lead, .section-title p, .question p, .service-body p, .steps p, .contact-band p, .cta p, .service-content p, .note p', radius: 175, force: 38, spin: .3 },
    { split: 'none', selector: '.service, .question, .tier, .button, .screen, .phone, .note, .service-content article', radius: 200, force: 16, spin: 0 }
  ];

  const KEY_STEP = 30;
  const CONTACT_PATH = '/kontakt/';

  const FROG_SVG = window.Frosch.art;
  const { store } = window.Frosch;

  /* ---------- 2. Hilfsfunktionen ---------- */

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  /* ---------- 3. Ausweichen: Texte und Formen weichen dem verschobenen Frosch federnd aus ---------- */

  class Scatter {
    constructor() {
      this.items = [];
      this.source = null;
      this.running = false;
      this.prepared = false;
      this.tick = this.tick.bind(this);
    }

    /* Texte werden erst beim ersten Verschieben zerlegt; das hält die Seite beim Laden schlank. */
    prepare() {
      if (this.prepared) return;
      this.prepared = true;
      SCATTER_GROUPS.forEach(group => {
        document.querySelectorAll(group.selector).forEach(root => {
          if (root.closest(SKIP_INSIDE)) return;
          const parts = group.split === 'none' ? [root] : Scatter.split(root, group.split);
          parts.forEach(el => this.items.push({ el, ...group, cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0 }));
        });
      });
    }

    /* Screenreader lesen den Klartext, sichtbar sind die einzelnen Teile. */
    static split(root, mode) {
      const parts = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const visible = element('span', 'fg-split');
        visible.setAttribute('aria-hidden', 'true');
        node.nodeValue.split(/(\s+)/).forEach(token => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            visible.append(' ');
          } else if (mode === 'words') {
            const word = element('span', 'fg-bit', token);
            visible.append(word);
            parts.push(word);
          } else {
            const word = element('span', 'fg-word');
            Array.from(token).forEach(letter => {
              const bit = element('span', 'fg-bit', letter);
              word.append(bit);
              parts.push(bit);
            });
            visible.append(word);
          }
        });
        node.replaceWith(element('span', 'fg-sr', node.nodeValue), visible);
      });
      return parts;
    }

    /* Ruhepositionen auf der Seite, ohne die aktuelle Auslenkung. */
    measure() {
      this.prepare();
      this.items.forEach(item => {
        const box = item.el.getBoundingClientRect();
        item.hidden = !box.width;
        item.cx = box.left + box.width / 2 + window.scrollX - item.x;
        item.cy = box.top + box.height / 2 + window.scrollY - item.y;
      });
    }

    setSource(point) {
      this.source = point;
      if (!this.running) {
        this.running = true;
        requestAnimationFrame(this.tick);
      }
    }

    /* Kurzer Schubs nach außen, wenn der Frosch abgesetzt wird. */
    shock(point) {
      const px = point.x + window.scrollX;
      const py = point.y + window.scrollY;
      this.items.forEach(item => {
        if (item.hidden) return;
        const dx = item.cx - px;
        const dy = item.cy - py;
        const distance = Math.hypot(dx, dy) || 1;
        const reach = item.radius * 1.5;
        if (distance > reach) return;
        const kick = (1 - distance / reach) * item.force * .28;
        item.vx += dx / distance * kick;
        item.vy += dy / distance * kick;
      });
    }

    tick() {
      const px = this.source ? this.source.x + window.scrollX : 0;
      const py = this.source ? this.source.y + window.scrollY : 0;
      let moving = Boolean(this.source);
      this.items.forEach(item => {
        if (item.hidden) return;
        let targetX = 0;
        let targetY = 0;
        if (this.source) {
          const dx = item.cx - px;
          const dy = item.cy - py;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < item.radius) {
            const push = (1 - distance / item.radius) ** 2 * item.force;
            targetX = dx / distance * push;
            targetY = dy / distance * push;
          }
        }
        if (!targetX && !targetY && !item.x && !item.y && !item.vx && !item.vy) return;
        item.vx = (item.vx + (targetX - item.x) * .09) * .78;
        item.vy = (item.vy + (targetY - item.y) * .09) * .78;
        item.x += item.vx;
        item.y += item.vy;
        const resting = !targetX && !targetY && Math.abs(item.x) + Math.abs(item.y) + Math.abs(item.vx) + Math.abs(item.vy) < .08;
        if (resting) {
          item.x = item.y = item.vx = item.vy = 0;
          item.el.style.translate = '';
          item.el.style.rotate = '';
          return;
        }
        moving = true;
        item.el.style.translate = `${item.x.toFixed(2)}px ${item.y.toFixed(2)}px`;
        if (item.spin) item.el.style.rotate = `${(item.x * item.spin).toFixed(2)}deg`;
      });
      if (moving) {
        requestAnimationFrame(this.tick);
      } else {
        this.running = false;
      }
    }
  }

  /* Ohne Bewegung bleibt der Text unzerlegt und still. */
  class StillText {
    measure() {}
    setSource() {}
    shock() {}
  }

  /* ---------- 4. Frosch: Körper, Mimik, Verschieben, Sprechblase ---------- */

  class Frog {
    constructor(scatter) {
      this.scatter = scatter;
      this.dragging = false;
      this.dragged = false;
      this.moved = false; /* Wurde er aus dem Dock verschoben, bleibt er dort, wo man ihn absetzt. */
      this.root = element('div', 'fg');
      this.root.innerHTML = `
        <div class="fg-say" aria-hidden="true"></div>
        <span class="fg-ground"></span>
        <span class="fg-count" hidden></span>
        <button type="button" class="fg-button" aria-expanded="false" aria-controls="fg-pond" aria-label="Frosch-Wegweiser öffnen, mit den Pfeiltasten verschieben">${FROG_SVG}</button>`;
      document.body.append(this.root);
      this.button = this.root.querySelector('.fg-button');
      this.rig = this.root.querySelector('.fg-rig');
      this.bubble = this.root.querySelector('.fg-say');
      this.placeInDock();
      this.bindDragging();
      window.addEventListener('resize', () => {
        if (this.moved) this.moveTo(this.x, this.y); else this.placeInDock();
      });
      if (motionOk) {
        this.startBlinking();
        this.watchIdle();
      }
      if (motionOk && hasHover) {
        document.addEventListener('pointermove', event => this.lookAt(event.clientX, event.clientY), { passive: true });
      }
    }

    get size() { return this.button.offsetWidth; }

    get center() { return { x: this.x + this.size / 2, y: this.y + this.size / 2 }; }

    placeInDock() {
      const margin = window.innerWidth < 760 ? 12 : 22;
      this.moveTo(window.innerWidth - this.size - margin, window.innerHeight - this.size - margin);
    }

    /* Bleibt innerhalb des Fensters. */
    moveTo(x, y) {
      this.setPosition(clamp(x, 0, window.innerWidth - this.size), clamp(y, 0, window.innerHeight - this.size));
      if (this.dragging) this.scatter.setSource(this.center);
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
      this.root.style.translate = `${x}px ${y}px`;
      this.bubble.classList.toggle('is-right', x < window.innerWidth / 2);
      this.bubble.classList.toggle('is-below', y < 170);
    }

    /* Verschieben mit Maus, Finger und Pfeiltasten. */
    bindDragging() {
      let grab = null;
      this.button.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        grab = { x: event.clientX, y: event.clientY, offsetX: event.clientX - this.x, offsetY: event.clientY - this.y };
        this.dragged = false;
        this.button.setPointerCapture(event.pointerId);
      });
      this.button.addEventListener('pointermove', event => {
        if (!grab) return;
        if (!this.dragging) {
          if (Math.hypot(event.clientX - grab.x, event.clientY - grab.y) < 6) return;
          this.startDrag();
        }
        this.moveTo(event.clientX - grab.offsetX, event.clientY - grab.offsetY);
      });
      const release = () => {
        grab = null;
        if (this.dragging) this.endDrag();
      };
      this.button.addEventListener('pointerup', release);
      this.button.addEventListener('pointercancel', release);
      this.button.addEventListener('keydown', event => {
        const step = { ArrowLeft: [-KEY_STEP, 0], ArrowRight: [KEY_STEP, 0], ArrowUp: [0, -KEY_STEP], ArrowDown: [0, KEY_STEP] }[event.key];
        if (!step) return;
        event.preventDefault();
        this.moved = true;
        this.moveTo(this.x + step[0], this.y + step[1]);
        if (this.onPicked) this.onPicked();
      });
    }

    startDrag() {
      this.dragging = true;
      this.dragged = true;
      this.moved = true;
      this.hush();
      this.scatter.measure();
      this.root.classList.add('is-dragging');
      if (this.onPicked) this.onPicked();
    }

    endDrag() {
      this.dragging = false;
      this.root.classList.remove('is-dragging');
      this.scatter.shock(this.center);
      this.scatter.setSource(null);
      if (!motionOk) return;
      this.rig.animate(
        [{ transform: 'scale(1.18, .76)' }, { transform: 'scale(.96, 1.06)', offset: .55 }, { transform: 'none' }],
        { duration: 300, easing: 'ease-out' }
      );
      this.wink();
    }

    /* Liefert true, wenn der Klick nur das Ende des Verschiebens war. */
    consumeDrag() {
      const dragged = this.dragged;
      this.dragged = false;
      return dragged;
    }

    /* Mimik */
    lookAt(px, py) {
      const dx = px - this.center.x;
      const dy = py - this.center.y;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(distance / 60, 1) * 3;
      this.root.style.setProperty('--look', `${(dx / distance * reach).toFixed(2)}px ${(dy / distance * reach).toFixed(2)}px`);
    }

    expression(name, duration) {
      if (!motionOk) return;
      this.root.classList.add(name);
      setTimeout(() => this.root.classList.remove(name), duration);
    }

    wink() { this.expression('is-winking', 650); }

    /* Freut sich über eine Antwort. */
    happy() { this.expression('is-happy', 620); }

    /* Sobald sich etwas tut, ist er wieder wach. */
    watchIdle() {
      const schedule = () => {
        clearTimeout(this.flyTimer);
        clearTimeout(this.sleepTimer);
        if (!this.flyCaught) this.flyTimer = setTimeout(() => this.catchFly(), FLY_AFTER);
        this.sleepTimer = setTimeout(() => this.fallAsleep(), SLEEP_AFTER);
      };
      const wake = () => {
        if (this.root.classList.contains('is-sleeping')) {
          this.root.classList.remove('is-sleeping');
          this.wink();
        }
        schedule();
      };
      ['pointermove', 'pointerdown', 'keydown', 'scroll'].forEach(type => {
        window.addEventListener(type, wake, { passive: true });
      });
      schedule();
    }

    get mayRest() { return !this.dragging && !document.hidden && (!this.canRest || this.canRest()); }

    /* Einmal je Seite: Die Fliege kommt angeflogen, die Zunge holt sie. */
    async catchFly() {
      if (!this.mayRest) return;
      this.flyCaught = true;
      this.hush();
      const fly = element('span', 'fg-fly');
      fly.setAttribute('aria-hidden', 'true');
      this.root.append(fly);
      const spot = { x: -14, y: 22 };
      await fly.animate([
        { translate: '-130px -90px', opacity: 0 },
        { translate: '-96px -30px', opacity: 1, offset: .25 },
        { translate: '-34px -62px', offset: .5 },
        { translate: '-70px 8px', offset: .75 },
        { translate: `${spot.x}px ${spot.y}px` }
      ], { duration: 1700, easing: 'ease-in-out', fill: 'forwards' }).finished;
      this.lookAt(this.x + spot.x, this.y + spot.y);
      const lash = element('span', 'fg-lash');
      lash.setAttribute('aria-hidden', 'true');
      this.root.append(lash);
      await lash.animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 90, easing: 'ease-out', fill: 'forwards' }).finished;
      const mouth = { x: 50, y: 56 };
      fly.animate([{ translate: `${spot.x}px ${spot.y}px` }, { translate: `${mouth.x}px ${mouth.y}px`, scale: .4 }], { duration: 110, easing: 'ease-in', fill: 'forwards' });
      await lash.animate([{ scale: '1 1' }, { scale: '0 1' }], { duration: 110, easing: 'ease-in', fill: 'forwards' }).finished;
      fly.remove();
      lash.remove();
      this.expression('is-gulping', 420);
      setTimeout(() => this.wink(), 420);
    }

    fallAsleep() {
      if (this.mayRest) this.root.classList.add('is-sleeping');
    }

    startBlinking() {
      const next = () => setTimeout(() => {
        this.expression('is-blinking', 180);
        next();
      }, 2800 + Math.random() * 3800);
      next();
    }

    /* Sprechblase */
    say(message, duration = 6000) {
      this.bubble.textContent = message;
      this.bubble.classList.add('is-visible');
      clearTimeout(this.sayTimer);
      this.sayTimer = setTimeout(() => this.hush(), duration);
    }

    hush() { this.bubble.classList.remove('is-visible'); }

    /* Ein Satz mit Anlauf und Flugbogen, dabei kommt er dem Betrachter näher (Maßstab). */
    async leap(center, scale, duration) {
      const start = { ...this.center, scale: this.scale || 1 };
      const distance = Math.hypot(center.x - start.x, center.y - start.y);
      const arc = Math.max(50, distance * .38);
      await this.rig.animate(
        [{ transform: 'none' }, { transform: 'scale(1.14, .78)' }, { transform: 'none' }],
        { duration: 180, easing: 'ease-out' }
      ).finished;
      this.root.classList.add('is-air');
      await new Promise(resolve => {
        const begin = performance.now();
        const step = now => {
          const t = clamp((now - begin) / duration, 0, 1);
          const growth = t * t;
          this.scale = start.scale + (scale - start.scale) * growth;
          this.button.style.scale = this.scale;
          this.setPosition(
            start.x + (center.x - start.x) * t - this.size / 2,
            start.y + (center.y - start.y) * t - arc * 4 * t * (1 - t) - this.size / 2
          );
          if (t < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      this.root.classList.remove('is-air');
    }

    /* Der Aufprall an der Scheibe: flach angedrückt. */
    splat() {
      this.root.classList.add('is-splat');
    }

    /* Vom Aufprall zurückfedern, bevor er erneut zuschlägt. */
    recoil(scale, duration) {
      this.root.classList.remove('is-splat');
      const from = this.scale;
      return new Promise(resolve => {
        const begin = performance.now();
        const step = now => {
          const t = clamp((now - begin) / duration, 0, 1);
          this.scale = from + (scale - from) * (1 - (1 - t) ** 2);
          this.button.style.scale = this.scale;
          if (t < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    }

    /* Fällt mit den Scherben aus dem Bild. */
    fall() {
      this.root.classList.remove('is-splat');
      return this.button.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translateY(${window.innerHeight * .9 / this.scale}px) rotate(38deg)`, opacity: 1 }
      ], { duration: 820, easing: 'cubic-bezier(.45, 0, .9, .55)', fill: 'forwards' }).finished;
    }

    /* Ausgangszustand, zum Beispiel nach dem Zurück-Knopf des Browsers. */
    reset() {
      this.scale = 1;
      this.button.style.scale = '';
      this.button.getAnimations().forEach(animation => animation.cancel());
      this.root.classList.remove('is-air', 'is-splat', 'is-through');
      this.placeInDock();
    }
  }

  /* ---------- 5. Teich: das Menü als Seerosenblätter ---------- */

  class Pond {
    constructor(frog, text, next, destinations, onGo) {
      this.frog = frog;
      this.onGo = onGo;
      this.root = element('div', 'pond');
      this.root.id = 'fg-pond';
      this.root.hidden = true;
      this.root.innerHTML = `
        <div class="pond-head"><p class="pond-title"></p><button type="button" class="pond-close" aria-label="Wegweiser schließen">×</button></div>
        <button type="button" class="pond-start"><span><strong>Anfrage zusammenstellen</strong><small>Ein paar kurze Fragen, den Preis rechne ich mit</small></span></button>
        <div class="pond-basket" hidden><p></p><a class="pond-next" href="/kontakt/">Zur Anfrage</a></div>
        <div class="pond-search"><label class="fg-sr" for="pond-suche">Seite oder Thema suchen</label><input id="pond-suche" type="search" placeholder="Oder suchen Sie etwas?" autocomplete="off" enterkeyhint="go"><div class="pond-results" aria-live="polite"></div></div>
        <nav class="pond-pads" aria-label="Schnell zu"></nav>
        <div class="pond-steps" hidden></div>
        <span class="pond-frog" aria-hidden="true">${FROG_SVG}</span>`;
      this.root.querySelector('.pond-title').textContent = text;
      const pads = this.root.querySelector('.pond-pads');
      destinations.forEach(([name, url], index) => {
        const pad = element('a', 'pad');
        pad.href = url;
        pad.style.setProperty('--i', index);
        pad.append(element('span', 'pad-label', name));
        pads.append(pad);
      });
      if (next) {
        const link = element('a', 'pond-next', next[0]);
        link.href = next[1];
        pads.after(link);
      }
      document.body.append(this.root);
      this.mini = this.root.querySelector('.pond-frog');
      this.search = new window.Frosch.Search(this.root.querySelector('.pond-search'), searching => {
        this.root.classList.toggle('is-searching', searching);
        if (this.isOpen) this.placeNearFrog();
      });
      this.bindSteps();
      this.bind();
    }

    get isOpen() { return !this.root.hidden; }

    /* Fragebogen und Korb */
    bindSteps() {
      const panel = this.root.querySelector('.pond-steps');
      const atContact = path === CONTACT_PATH;
      this.steps = new window.Frosch.Steps(panel, {
        onLeave: () => this.showAsking(false),
        onChange: () => this.placeNearFrog(),
        onHop: lily => this.leapTo(lily),
        onLevel: mark => { this.leapTo(mark); },
        onArrive: () => this.cheer(),
        onFinish: topic => {
          if (atContact) {
            this.toggle(false);
            if (topic && !store.count()) document.querySelector('#thema').value = topic;
            /* Weiter im ersten Feld, das noch fehlt. */
            const missing = [...document.querySelectorAll('.contact-form [required]')].find(field => !field.value.trim());
            (missing || document.querySelector('#nachricht')).focus({ preventScroll: true });
            document.querySelector('.contact-form').scrollIntoView({ block: 'start', behavior: motionOk ? 'smooth' : 'auto' });
          } else {
            this.onGo(topic ? `${CONTACT_PATH}?thema=${encodeURIComponent(topic)}` : CONTACT_PATH);
          }
        }
      });
      this.root.querySelector('.pond-start').addEventListener('click', () => this.ask());
      document.addEventListener('frosch:ask', () => {
        if (!this.isOpen) this.toggle(true);
        this.ask();
      });
      this.updateBasket();
      store.subscribe(() => this.updateBasket());
    }

    ask() {
      this.search.clear();
      this.showAsking(true);
      this.steps.start(topicOfPage(path));
    }

    /* Am Ziel: Der kleine Frosch macht einen Freudensprung, der große freut sich mit. */
    cheer() {
      this.frog.happy();
      if (!motionOk) return;
      setTimeout(() => {
        this.mini.querySelector('.fg-rig').animate([
          { transform: 'none' },
          { transform: 'translateY(-26px) rotate(-10deg)', offset: .3 },
          { transform: 'none', offset: .55 },
          { transform: 'translateY(-14px) rotate(8deg)', offset: .75 },
          { transform: 'none' }
        ], { duration: 720, easing: 'ease-in-out' });
      }, 220);
    }

    showAsking(asking) {
      this.root.classList.toggle('is-asking', asking);
      this.root.querySelector('.pond-steps').hidden = !asking;
      this.miniAt = null;
      this.mini.classList.remove('is-here');
      if (this.isOpen) this.placeNearFrog();
    }

    updateBasket() {
      const basket = this.root.querySelector('.pond-basket');
      const count = store.count();
      basket.hidden = !count || path === CONTACT_PATH;
      basket.querySelector('p').textContent = count === 1 ? '1 Angabe gesammelt' : `${count} Angaben gesammelt`;
    }

    bind() {
      const { frog, root } = this;
      root.querySelector('.pond-close').addEventListener('click', () => {
        this.toggle(false);
        frog.button.focus();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.isOpen) {
          this.toggle(false);
          frog.button.focus();
        }
      });
      document.addEventListener('pointerdown', event => {
        if (this.isOpen && !root.contains(event.target) && !frog.root.contains(event.target)) this.toggle(false);
      });
      if (!motionOk) return;

      root.querySelectorAll('.pad').forEach(pad => {
        pad.addEventListener('pointerenter', () => this.leapTo(pad));
        pad.addEventListener('focus', () => this.leapTo(pad));
      });
      root.addEventListener('pointermove', event => {
        const box = root.getBoundingClientRect();
        root.style.setProperty('--tilt-x', `${((event.clientY - box.top) / box.height - .5) * -7}deg`);
        root.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 7}deg`);
        root.style.setProperty('--glow-x', `${event.clientX - box.left}px`);
        root.style.setProperty('--glow-y', `${event.clientY - box.top}px`);
      }, { passive: true });
      root.addEventListener('pointerleave', () => {
        root.style.removeProperty('--tilt-x');
        root.style.removeProperty('--tilt-y');
      });
      /* Mit gedrückter Taste (neuer Tab) bleibt das normale Link-Verhalten. */
      root.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link || link.dataset.direct || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        this.onGo(link.href);
      });
    }

    /* Der kleine Frosch springt im Bogen auf das Blatt. Liefert ein Versprechen für den Abschluss des Sprungs. */
    leapTo(target) {
      const pond = this.root.getBoundingClientRect();
      const box = (target.querySelector('.lily-leaf') || target).getBoundingClientRect();
      const width = this.mini.offsetWidth;
      const height = this.mini.offsetHeight;
      const to = {
        x: box.left - pond.left + this.root.scrollLeft + box.width / 2 - width / 2,
        y: box.top - pond.top + this.root.scrollTop + box.height / 2 - height * .78
      };
      const from = this.miniAt || { x: to.x, y: to.y + 40 };
      this.miniAt = to;
      this.mini.classList.add('is-here');
      if (!motionOk) {
        this.mini.style.translate = `${to.x}px ${to.y}px`;
        return Promise.resolve();
      }
      return this.mini.animate([
        { translate: `${from.x}px ${from.y}px`, scale: '1.1 .8' },
        { translate: `${(from.x + to.x) / 2}px ${Math.min(from.y, to.y) - 34}px`, scale: '.92 1.14', offset: .5 },
        { translate: `${to.x}px ${to.y}px`, scale: '1.16 .78', offset: .85 },
        { translate: `${to.x}px ${to.y}px`, scale: '1 1' }
      ], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished;
    }

    /* Der Teich öffnet sich dort, wo der Frosch gerade sitzt. */
    placeNearFrog() {
      const { frog, root } = this;
      const margin = 12;
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      const center = frog.center;
      const left = clamp(center.x - width + frog.size / 2, margin, window.innerWidth - width - margin);
      const above = frog.y - height - margin;
      const top = above >= margin ? above : clamp(frog.y + frog.size + margin, margin, window.innerHeight - height - margin);
      root.style.left = `${left}px`;
      root.style.top = `${top}px`;
      root.style.setProperty('--open-x', `${clamp(center.x - left, 0, width)}px`);
      root.style.setProperty('--open-y', `${clamp(center.y - top, 0, height)}px`);
    }

    toggle(open) {
      this.root.hidden = !open;
      this.frog.button.setAttribute('aria-expanded', String(open));
      this.frog.root.classList.toggle('is-listening', open);
      if (open) {
        this.placeNearFrog();
        this.frog.hush();
        this.frog.wink();
        this.frog.root.classList.remove('is-sleeping');
        /* Mit Maus und Tastatur kann man sofort lostippen; auf dem Handy öffnet sich keine Tastatur von selbst. */
        if (hasHover) this.search.input.focus({ preventScroll: true });
      } else {
        this.search.clear();
        this.miniAt = null;
        this.mini.classList.remove('is-here');
        this.showAsking(false);
      }
    }
  }

  /* ---------- 6. Sprung durch die Scheibe ---------- */

  let glass = null;
  let leaving = false;

  /* Die neue Seite ist bereits sichtbar geladen; der Übergang zur echten Adresse ist nur eine kurze Überblendung. */
  window.addEventListener('pageswap', event => {
    if (event.viewTransition && !leaving) event.viewTransition.skipTransition();
  });

  async function jumpThroughGlass(url, frog, pond) {
    if (leaving) return;
    if (!motionOk || !window.GlassBreak) {
      window.location.href = url;
      return;
    }
    leaving = true;
    pond.toggle(false);
    frog.hush();
    frog.root.classList.add('is-through');
    glass = new window.GlassBreak(url);
    const impact = { x: window.innerWidth / 2, y: window.innerHeight * .46 };
    const full = clamp(Math.min(window.innerWidth, window.innerHeight) * .5 / frog.size, 2.4, 4.6);

    /* Zwei Sätze aus der Seite auf den Betrachter zu, dann der erste Aufprall. */
    await frog.leap({ x: (frog.center.x + impact.x) / 2, y: (frog.center.y + impact.y) / 2 + 40 }, full * .42, 340);
    await frog.leap(impact, full, 300);
    frog.splat();
    await glass.crack(impact);

    /* Die Scheibe hält, bis die neue Seite wirklich geladen ist. */
    const [loaded] = await Promise.all([glass.ready, wait(420)]);
    if (!loaded) {
      window.location.href = url;
      return;
    }
    glass.prepare();
    await frog.recoil(full * .62, 260);
    await wait(60);
    await frog.recoil(full * 1.12, 110);
    frog.splat();
    await wait(30);

    /* Zweiter Aufprall: Die Scheibe bricht, dahinter steht die neue Seite. */
    const falling = glass.shatter();
    frog.fall();
    await falling;
    window.location.href = url;
  }

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    leaving = false;
    if (glass) glass.destroy();
    glass = null;
    if (window.simplecommerceFrog) window.simplecommerceFrog.reset();
  });

  /* ---------- 7. Start ---------- */

  const path = window.location.pathname.replace(/index\.html$/, '');
  const isHelpArticle = path.startsWith('/hilfe/') && path !== '/hilfe/';
  const [text, next] = HINTS[path] || (isHelpArticle ? HELP_HINT : DEFAULT_HINT);
  const destinations = DESTINATIONS.filter(([, url]) => url !== path);

  const scatter = motionOk ? new Scatter() : new StillText();
  const frog = new Frog(scatter);
  const pond = new Pond(frog, text, next, destinations, url => jumpThroughGlass(url, frog, pond));
  window.simplecommerceFrog = frog;
  frog.canRest = () => !pond.isOpen && !leaving;

  /* Zähler am Helfer: So viele Angaben warten auf die Anfrage. */
  const counter = frog.root.querySelector('.fg-count');
  let lastCount = store.count();
  const showCount = () => {
    const count = store.count();
    if (count > lastCount) frog.happy();
    lastCount = count;
    counter.hidden = !count;
    counter.textContent = count;
    frog.button.setAttribute('aria-label', `Frosch-Wegweiser öffnen, mit den Pfeiltasten verschieben${count ? `, ${count} Angaben gesammelt` : ''}`);
  };
  showCount();
  store.subscribe(showCount);
  frog.onPicked = () => { if (pond.isOpen) pond.toggle(false); };

  frog.button.addEventListener('click', () => {
    if (frog.consumeDrag()) return;
    pond.toggle(!pond.isOpen);
  });
  frog.button.addEventListener('pointerenter', () => {
    frog.wink();
    if (!pond.isOpen && !frog.dragging) frog.say(text, 3500);
  });

  /* Nach dem Absenden bedankt er sich. */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('contact:sent', () => {
      frog.happy();
      frog.say('Danke! Wir melden uns persönlich bei Ihnen.', 7000);
    });
  }

  /* Kommentare zu den Abschnitten der Startseite; auf dem Handy würden sie den Inhalt verdecken. */
  const chatty = window.matchMedia('(min-width: 761px)').matches;
  /* Rechner und Formular sollen frei bleiben: dort spricht der Frosch nur, wenn man ihn berührt. */
  const atWork = ['/preisrechner/', '/kontakt/'].includes(window.location.pathname);
  let currentSection = null;
  const sections = document.querySelectorAll('[data-guide]');
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target === currentSection) return;
        currentSection = entry.target;
        if (!chatty || pond.isOpen || frog.dragging) return;
        frog.say(entry.target.dataset.guide);
        frog.wink();
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(section => observer.observe(section));
  }
  setTimeout(() => { if (chatty && !atWork && !currentSection && !pond.isOpen && !frog.dragging) frog.say(text); }, 1400);
})();
