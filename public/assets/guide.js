'use strict';
/*
 * Frosch-Wegweiser
 * Zusätzlich zur Navigation: Alle Ziele bleiben auch ohne ihn und ohne JavaScript erreichbar.
 * Er speichert nichts im Browser. Bei reduzierter Bewegung bleibt er still im Dock sitzen.
 *
 * Aufbau: 1. Inhalte  2. Hilfsfunktionen  3. Ausweichen  4. Frosch  5. Teich  6. Start
 */
(() => {
  const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- 1. Inhalte ---------- */

  const DESTINATIONS = [
    ['Onlineshop', '/shopsystem/'], ['Website', '/webseiten/'], ['IT-Beratung', '/it-beratung/'],
    ['Software', '/it-projekte/'], ['KI', '/ki-anwendungen/'], ['Service', '/service/'],
    ['Shop-Preise', '/preise/'], ['Online-Hilfe', '/hilfe/'], ['Kontakt', '/kontakt/']
  ];

  const HINTS = {
    '/': ['Quak! Wohin darf ich Sie bringen?', null],
    '/shopsystem/': ['Das steckt im Shopsystem. Wollen Sie den Preis wissen?', ['Zum Preisrechner', '/preise/#rechner']],
    '/preise/': ['Schieben Sie den Regler, ich rechne mit.', ['Shop anfragen', '/kontakt/']],
    '/leistungen/': ['Was steht bei Ihnen an?', ['Projekt besprechen', '/kontakt/']],
    '/webseiten/': ['Eine eigene Website? Erzählen Sie uns davon.', ['Website anfragen', '/kontakt/']],
    '/it-beratung/': ['Sortieren wir das gemeinsam?', ['Beratung anfragen', '/kontakt/']],
    '/it-projekte/': ['Haben Sie schon einen Ablauf im Kopf?', ['Projekt besprechen', '/kontakt/']],
    '/ki-anwendungen/': ['Welche Aufgabe soll Ihnen die KI abnehmen?', ['KI-Projekt besprechen', '/kontakt/']],
    '/service/': ['Wo können wir Ihnen helfen?', ['Unterstützung anfragen', '/kontakt/']],
    '/hilfe/': ['Suchen Sie oben einfach nach Ihrem Thema.', ['Lieber persönlich fragen', '/kontakt/']],
    '/kontakt/': ['Schreiben Sie uns kurz, wir melden uns persönlich.', null]
  };
  const HELP_HINT = ['Eine andere Anleitung gesucht?', ['Alle Hilfethemen', '/hilfe/']];
  const DEFAULT_HINT = ['Mehr wissen? Ich bringe Sie hin.', ['Projekt besprechen', '/kontakt/']];

  /* Was ausweicht: Buchstaben, Wörter und ganze Formen, jeweils mit eigener Reichweite und Stärke. */
  const SKIP_INSIDE = '.prose, .help-section, .help-sidebar, .calculator, .table-scroll, .contact-form, .faq';
  const SCATTER_GROUPS = [
    { split: 'letters', selector: 'main h1, main h2, main h3, .motif-caption', radius: 170, force: 72, spin: .9 },
    { split: 'words', selector: '.lead, .section-title p, .question p, .service-body p, .steps p, .contact-band p, .cta p, .service-content p, .note p', radius: 175, force: 38, spin: .3 },
    { split: 'none', selector: '.door, .service, .question, .tier, .button, .screen, .phone, .note, .service-content article', radius: 200, force: 16, spin: 0 }
  ];

  /* Worauf der Frosch springt. */
  const TEXT_SPOTS = 'main h1, main h2, main h3';
  const SHAPE_SPOTS = '.door, .service, .question, .tier, .button, .cta, .note, .service-content article, .feature-list';

  const AUTO = { firstDelay: 5000, interval: 20000, bursts: 3, hopsPerBurst: 4 };

  const FROG_SVG = `
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

  /* ---------- 2. Hilfsfunktionen ---------- */

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  /* ---------- 3. Ausweichen: Texte und Formen weichen federnd vor dem Frosch aus ---------- */

  class Scatter {
    constructor() {
      this.items = [];
      this.source = null;
      this.running = false;
      SCATTER_GROUPS.forEach(group => {
        document.querySelectorAll(group.selector).forEach(root => {
          if (root.closest(SKIP_INSIDE)) return;
          const parts = group.split === 'none' ? [root] : Scatter.split(root, group.split);
          parts.forEach(el => this.items.push({ el, ...group, cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0 }));
        });
      });
      this.tick = this.tick.bind(this);
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

    /* Stoßwelle bei der Landung: alles in der Nähe bekommt einen kurzen Schubs nach außen. */
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

  /* ---------- 4. Frosch: Körper, Mimik, Sprünge, Sprechblase ---------- */

  class Frog {
    constructor(scatter) {
      this.scatter = scatter;
      this.motion = 0; /* Nummer des laufenden Sprungs; ein neuer Sprung bricht den alten ab. */
      this.trip = 0; /* Nummer des laufenden Ausflugs; comeHome() beendet ihn. */
      this.out = false;
      this.root = element('div', 'fg');
      this.root.innerHTML = `
        <div class="fg-say" aria-hidden="true"></div>
        <span class="fg-ground"></span>
        <button type="button" class="fg-button" aria-expanded="false" aria-controls="fg-pond" aria-label="Frosch-Wegweiser öffnen">${FROG_SVG}</button>`;
      document.body.append(this.root);
      this.button = this.root.querySelector('.fg-button');
      this.rig = this.root.querySelector('.fg-rig');
      this.ground = this.root.querySelector('.fg-ground');
      this.bubble = this.root.querySelector('.fg-say');
      this.placeInDock();
      window.addEventListener('resize', () => { if (!this.out) this.placeInDock(); });
      if (motionOk) this.startBlinking();
      if (motionOk && hasHover) {
        document.addEventListener('pointermove', event => this.lookAt(event.clientX, event.clientY), { passive: true });
      }
    }

    get size() { return this.button.offsetWidth; }

    get dock() {
      const margin = window.innerWidth < 760 ? 12 : 22;
      return { x: window.innerWidth - this.size - margin, y: window.innerHeight - this.size - margin };
    }

    moveTo(x, y) {
      this.x = x;
      this.y = y;
      this.root.style.translate = `${x}px ${y}px`;
      this.bubble.classList.toggle('is-right', x < window.innerWidth / 2);
      if (this.out) this.scatter.setSource({ x: x + this.size / 2, y: y + this.size / 2 });
    }

    placeInDock() {
      const { x, y } = this.dock;
      this.moveTo(x, y);
    }

    /* Mimik */
    lookAt(px, py) {
      const dx = px - (this.x + this.size / 2);
      const dy = py - (this.y + this.size / 2);
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

    /* Ein Sprung mit Anlauf, Flugbogen und Landung. Liefert false, wenn er abgebrochen wurde. */
    async hop(targetX, targetY) {
      const id = ++this.motion;
      const startX = this.x;
      const startY = this.y;
      const distance = Math.hypot(targetX - startX, targetY - startY);
      const arc = Math.max(60, distance * .32);
      const duration = clamp(380 + distance * .5, 420, 760);
      const lean = clamp((targetX - startX) / 18, -16, 16);
      this.lookAt(targetX + this.size / 2, targetY + this.size / 2);

      await this.rig.animate(
        [{ transform: 'none' }, { transform: 'scale(1.14, .78)' }],
        { duration: 130, easing: 'ease-out', fill: 'forwards' }
      ).finished;
      if (id !== this.motion) return false;

      this.root.classList.add('is-air');
      const flight = this.rig.animate(
        [{ transform: 'scale(.92, 1.14)' }, { transform: `scale(.94, 1.1) rotate(${lean}deg)`, offset: .5 }, { transform: 'scale(1.02, .98)' }],
        { duration, fill: 'forwards' }
      );
      const landed = await new Promise(resolve => {
        const begin = performance.now();
        const step = now => {
          if (id !== this.motion) return resolve(false);
          const t = clamp((now - begin) / duration, 0, 1);
          const height = arc * 4 * t * (1 - t);
          this.moveTo(startX + (targetX - startX) * t, startY + (targetY - startY) * t - height);
          this.ground.style.setProperty('--air', (height / arc).toFixed(3));
          if (t < 1) requestAnimationFrame(step); else resolve(true);
        };
        requestAnimationFrame(step);
      });
      flight.cancel();
      this.root.classList.remove('is-air');
      if (!landed) return false;
      if (this.out) this.scatter.shock({ x: this.x + this.size / 2, y: this.y + this.size / 2 });

      await this.rig.animate(
        [{ transform: 'scale(1.2, .72)' }, { transform: 'scale(.96, 1.06)', offset: .55 }, { transform: 'none' }],
        { duration: 300, easing: 'ease-out' }
      ).finished;
      return id === this.motion;
    }

    /* Nächster Landeplatz: abwechselnd mitten zwischen Buchstaben und auf Formen, nah genug für einen Sprung. */
    nextSpot(onText) {
      const size = this.size;
      const spots = [...document.querySelectorAll(onText ? TEXT_SPOTS : SHAPE_SPOTS)]
        .map(el => el.getBoundingClientRect())
        .filter(box => box.width && box.top > 90 && box.top < window.innerHeight - size * .6)
        .map(box => ({
          x: clamp(box.left + Math.random() * Math.max(box.width - size, 0), 8, window.innerWidth - size - 8),
          y: clamp(onText ? box.top + Math.random() * box.height - size * .7 : box.top - size * .84, 70, window.innerHeight - size - 8)
        }))
        .filter(spot => Math.hypot(spot.x - this.x, spot.y - this.y) > size);
      if (!spots.length && onText) return this.nextSpot(false);
      if (!spots.length) return null;
      const near = spots.filter(spot => Math.hypot(spot.x - this.x, spot.y - this.y) < 700);
      return pick(near.length ? near : spots);
    }

    /* Ein Ausflug über die Seite und zurück ins Dock. */
    async wander(hops) {
      if (!motionOk || this.out) return;
      const trip = ++this.trip;
      this.out = true;
      this.scatter.measure();
      this.root.classList.add('is-out');
      for (let index = 0; index < hops; index += 1) {
        const spot = this.nextSpot(index % 2 === 0);
        if (!spot) break;
        if (!(await this.hop(spot.x, spot.y))) return;
        if (Math.random() < .5) this.wink();
        await wait(420 + Math.random() * 420);
        if (trip !== this.trip) return;
      }
      await this.comeHome();
    }

    async comeHome() {
      this.trip += 1;
      const { x, y } = this.dock;
      const arrived = await this.hop(x, y);
      if (!arrived) return false;
      this.out = false;
      this.root.classList.remove('is-out');
      this.scatter.setSource(null);
      this.wink();
      return true;
    }
  }

  /* ---------- 5. Teich: das Menü als Seerosenblätter ---------- */

  class Pond {
    constructor(frog, text, next, destinations) {
      this.frog = frog;
      this.root = element('div', 'pond');
      this.root.id = 'fg-pond';
      this.root.hidden = true;
      this.root.innerHTML = `
        <div class="pond-head"><p class="pond-title"></p><button type="button" class="pond-close" aria-label="Wegweiser schließen">×</button></div>
        <nav class="pond-pads" aria-label="Schnell zu"></nav>
        <div class="pond-actions"><button type="button" class="pond-hop">Hüpf mal!</button></div>
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
        this.root.querySelector('.pond-actions').prepend(link);
      }
      document.body.append(this.root);
      this.mini = this.root.querySelector('.pond-frog');
      this.bind();
    }

    get isOpen() { return !this.root.hidden; }

    bind() {
      const { frog, root } = this;
      root.querySelector('.pond-close').addEventListener('click', () => {
        this.toggle(false);
        frog.button.focus();
      });
      root.querySelector('.pond-hop').addEventListener('click', () => {
        this.toggle(false);
        frog.wander(AUTO.hopsPerBurst);
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
      /* Beim Klick springt der kleine Frosch ins Wasser, dann lädt die Seite. */
      root.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        if (link.matches('.pad')) this.leapTo(link);
        link.classList.add('is-splash');
        setTimeout(() => { window.location.href = link.href; }, 420);
      });
      window.addEventListener('pageshow', () => {
        root.querySelectorAll('.is-splash').forEach(link => link.classList.remove('is-splash'));
      });
    }

    /* Der kleine Frosch springt im Bogen auf das Blatt. */
    leapTo(pad) {
      const pond = this.root.getBoundingClientRect();
      const box = pad.getBoundingClientRect();
      const to = { x: box.left - pond.left + box.width / 2 - 22, y: box.top - pond.top - 12 };
      const from = this.miniAt || { x: to.x, y: to.y + 40 };
      this.miniAt = to;
      this.mini.classList.add('is-here');
      this.mini.animate([
        { translate: `${from.x}px ${from.y}px`, scale: '1.1 .8' },
        { translate: `${(from.x + to.x) / 2}px ${Math.min(from.y, to.y) - 34}px`, scale: '.92 1.14', offset: .5 },
        { translate: `${to.x}px ${to.y}px`, scale: '1.16 .78', offset: .85 },
        { translate: `${to.x}px ${to.y}px`, scale: '1 1' }
      ], { duration: 340, easing: 'ease-out', fill: 'forwards' });
    }

    toggle(open) {
      this.root.hidden = !open;
      this.frog.button.setAttribute('aria-expanded', String(open));
      this.frog.button.setAttribute('aria-label', open ? 'Frosch-Wegweiser schließen' : 'Frosch-Wegweiser öffnen');
      this.frog.root.classList.toggle('is-listening', open);
      if (open) {
        this.frog.hush();
        this.frog.wink();
      } else {
        this.miniAt = null;
        this.mini.classList.remove('is-here');
      }
    }
  }

  /* ---------- 6. Start ---------- */

  const path = window.location.pathname.replace(/index\.html$/, '');
  const isHelpArticle = path.startsWith('/hilfe/') && path !== '/hilfe/';
  const [text, next] = HINTS[path] || (isHelpArticle ? HELP_HINT : DEFAULT_HINT);
  const destinations = DESTINATIONS.filter(([, url]) => url !== path);

  const scatter = new (motionOk ? Scatter : class { measure() {} setSource() {} })();
  const frog = new Frog(scatter);
  const pond = new Pond(frog, text, next, destinations);
  let engaged = false;

  frog.button.addEventListener('click', async () => {
    engaged = true;
    if (frog.out) await frog.comeHome();
    pond.toggle(!pond.isOpen);
  });
  frog.button.addEventListener('pointerenter', () => {
    frog.wink();
    if (!pond.isOpen) frog.say(text, 3500);
  });

  /* Kommentare zu den Abschnitten der Startseite. */
  let currentSection = null;
  const sections = document.querySelectorAll('[data-guide]');
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target === currentSection) return;
        currentSection = entry.target;
        if (pond.isOpen) return;
        frog.say(entry.target.dataset.guide);
        frog.wink();
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(section => observer.observe(section));
  }
  setTimeout(() => { if (!currentSection && !pond.isOpen) frog.say(text); }, 1400);

  /* Von selbst hüpft er nur auf Werbeseiten und nur begrenzt oft, nie beim Lesen langer Texte oder beim Tippen. */
  if (motionOk && !document.querySelector('.prose')) {
    let bursts = 0;
    const busy = () => engaged || document.hidden || pond.isOpen || frog.out
      || document.activeElement.matches('input, textarea, select');
    const excursion = () => {
      if (engaged || bursts >= AUTO.bursts) return;
      if (!busy()) {
        bursts += 1;
        frog.wander(AUTO.hopsPerBurst);
      }
      setTimeout(excursion, AUTO.interval);
    };
    setTimeout(excursion, AUTO.firstDelay);
  }
})();
