'use strict';
/*
 * Scheibenbruch für den Frosch-Wegweiser.
 * Die Zielseite lädt unsichtbar in einem iframe hinter der "Scheibe". Die Scheibe sind Kopien des
 * sichtbaren Seitenausschnitts, jeweils auf eine Scherbe zugeschnitten. Fallen sie, erscheint die
 * bereits geladene neue Seite. Ablauf und Frosch steuert guide.js.
 *
 * Aufbau: 1. Geometrie  2. Risse zeichnen  3. Scherben  4. Klasse GlassBreak
 */
(() => {
  const LOAD_TIMEOUT = 5000;
  const random = (min, max) => min + Math.random() * (max - min);

  /* ---------- 1. Geometrie: Strahlen und Ringe um den Einschlagpunkt ---------- */

  function buildWeb(center, width, height) {
    const small = width < 760;
    const rayCount = small ? 8 : 11;
    const reach = Math.hypot(width, height) * 1.25;
    const radii = small ? [0, 105, reach] : [0, 125, 340, reach];
    const offset = random(0, Math.PI * 2);
    const angles = Array.from({ length: rayCount }, (_, index) => offset + (index + random(-.26, .26)) / rayCount * Math.PI * 2);
    const points = angles.map(angle => radii.map((radius, ring) => {
      const bend = ring && ring < radii.length - 1 ? random(-.09, .09) : 0;
      const length = ring && ring < radii.length - 1 ? radius * random(.82, 1.18) : radius;
      return { x: center.x + Math.cos(angle + bend) * length, y: center.y + Math.sin(angle + bend) * length };
    }));
    const cells = [];
    for (let ray = 0; ray < rayCount; ray += 1) {
      const next = points[(ray + 1) % rayCount];
      for (let ring = 0; ring < radii.length - 1; ring += 1) {
        cells.push(ring === 0
          ? [points[ray][0], points[ray][1], next[1]]
          : [points[ray][ring], points[ray][ring + 1], next[ring + 1], next[ring]]);
      }
    }
    return { points, cells, reach };
  }

  /* ---------- 2. Risse: wachsen vom Einschlag nach außen, hell mit dunkler Kante ---------- */

  function crackSegments(center, reach) {
    const segments = [];
    const rayCount = 26;
    const rings = [];
    for (let ray = 0; ray < rayCount; ray += 1) {
      const angle = (ray + random(-.35, .35)) / rayCount * Math.PI * 2;
      const length = ray % 2 ? random(.22, .52) * reach : random(.5, .95) * reach;
      let position = { x: center.x, y: center.y };
      let distance = 0;
      let heading = angle;
      const nodes = [];
      while (distance < length) {
        const step = random(24, 70) * (1 + distance / 500);
        heading += random(-.13, .13);
        const end = { x: position.x + Math.cos(heading) * step, y: position.y + Math.sin(heading) * step };
        distance += step;
        segments.push({ from: position, to: end, at: distance, weight: Math.max(.9, 2.6 - distance / 260) });
        nodes.push({ point: end, at: distance });
        position = end;
      }
      rings.push(nodes);
    }
    /* Querrisse verbinden benachbarte Strahlen, dicht am Einschlag am häufigsten. */
    rings.forEach((nodes, index) => {
      const neighbour = rings[(index + 1) % rings.length];
      nodes.forEach((node, step) => {
        const other = neighbour[step];
        if (!other || Math.random() > Math.max(.06, .95 - node.at / 330)) return;
        segments.push({ from: node.point, to: other.point, at: node.at + 30, weight: .7 });
      });
    });
    return segments.sort((a, b) => a.at - b.at);
  }

  function drawCracks(canvas, center, reach) {
    const context = canvas.getContext('2d');
    const segments = crackSegments(center, reach);
    const glints = Array.from({ length: 9 }, () => {
      const angle = random(0, Math.PI * 2);
      const near = random(14, 150);
      const spread = random(.12, .4);
      const far = near + random(30, 150);
      return [
        [center.x + Math.cos(angle) * near, center.y + Math.sin(angle) * near],
        [center.x + Math.cos(angle + spread) * far, center.y + Math.sin(angle + spread) * far],
        [center.x + Math.cos(angle - spread) * far, center.y + Math.sin(angle - spread) * far]
      ];
    });
    let drawn = 0;
    const paint = until => {
      for (; drawn < segments.length && segments[drawn].at <= until; drawn += 1) {
        const { from, to, weight } = segments[drawn];
        context.lineCap = 'round';
        context.strokeStyle = 'rgba(18, 34, 40, .78)';
        context.lineWidth = weight + .6;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
        context.strokeStyle = 'rgba(255, 255, 255, .95)';
        context.lineWidth = Math.max(.5, weight - .25);
        context.beginPath();
        context.moveTo(from.x + .9, from.y + .9);
        context.lineTo(to.x + .9, to.y + .9);
        context.stroke();
      }
    };
    glints.forEach(([a, b, c]) => {
      const gradient = context.createLinearGradient(a[0], a[1], b[0], b[1]);
      gradient.addColorStop(0, 'rgba(255, 255, 255, .5)');
      gradient.addColorStop(1, 'rgba(205, 232, 242, .04)');
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(...a);
      context.lineTo(...b);
      context.lineTo(...c);
      context.closePath();
      context.fill();
    });
    return new Promise(resolve => {
      const begin = performance.now();
      const step = now => {
        const progress = Math.min((now - begin) / 170, 1);
        paint(reach * (1 - (1 - progress) ** 3));
        if (progress < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- 3. Scherben: Kopie des sichtbaren Ausschnitts, ohne Unsichtbares und ohne Bewegung ---------- */

  function snapshotPage() {
    const page = document.createElement('div');
    page.className = 'glass-page';
    const viewBottom = window.innerHeight;
    [...document.body.children].forEach(child => {
      if (child.matches('script, .fg, .pond, .glass')) return;
      const copy = child.cloneNode(true);
      /* Abschnitte im Hauptinhalt außerhalb des Fensters werden zu Platzhaltern gleicher Höhe. */
      const originals = child.matches('main') ? [...child.children] : [];
      [...(child.matches('main') ? copy.children : [])].forEach((section, index) => {
        const box = originals[index].getBoundingClientRect();
        if (box.bottom >= -50 && box.top <= viewBottom + 50) return;
        const spacer = document.createElement('div');
        spacer.style.height = `${box.height}px`;
        section.replaceWith(spacer);
      });
      copy.querySelectorAll('.fg-sr').forEach(node => node.remove());
      copy.querySelectorAll('.fg-split').forEach(node => node.replaceWith(node.textContent));
      copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      copy.querySelectorAll('[loading]').forEach(node => node.removeAttribute('loading'));
      copy.querySelectorAll('a, button, input, select, textarea').forEach(node => node.setAttribute('tabindex', '-1'));
      page.append(copy);
    });
    return page;
  }

  function createShard(template, cell, scrollY) {
    const shard = document.createElement('div');
    shard.className = 'glass-shard';
    shard.style.clipPath = `polygon(${cell.map(point => `${point.x.toFixed(1)}px ${point.y.toFixed(1)}px`).join(',')})`;
    shard.style.setProperty('--sheen', `${random(85, 150).toFixed(0)}deg`);
    const scroller = document.createElement('div');
    scroller.className = 'glass-scroller';
    scroller.append(template.cloneNode(true));
    shard.append(scroller);
    shard.dataset.scroll = scrollY;
    return shard;
  }

  function fallShard(shard, cell, center, reach) {
    const cx = cell.reduce((sum, point) => sum + point.x, 0) / cell.length;
    const cy = cell.reduce((sum, point) => sum + point.y, 0) / cell.length;
    const distance = Math.hypot(cx - center.x, cy - center.y) || 1;
    const closeness = Math.max(0, 1 - distance / (reach * .75));
    const outX = (cx - center.x) / distance * random(50, 150) * (.5 + closeness);
    const outY = (cy - center.y) / distance * random(20, 90) * (.5 + closeness);
    const depth = random(30, 90) + closeness * 240;
    const axis = `${random(-1, 1).toFixed(2)}, ${random(-1, 1).toFixed(2)}, ${random(-.5, .5).toFixed(2)}`;
    const turn = random(40, 170) * (Math.random() < .5 ? -1 : 1);
    shard.style.transformOrigin = `${cx.toFixed(0)}px ${cy.toFixed(0)}px`;
    return shard.animate([
      { transform: 'none', opacity: 1 },
      { transform: `translate3d(${outX * .3}px, ${outY * .3}px, ${depth * .55}px) rotate3d(${axis}, ${turn * .14}deg)`, opacity: 1, offset: .22 },
      { transform: `translate3d(${outX}px, ${window.innerHeight * 1.45}px, ${depth}px) rotate3d(${axis}, ${turn}deg)`, opacity: .9 }
    ], {
      duration: random(760, 1120) + distance * .22,
      delay: Math.min(distance * .1, 170),
      easing: 'cubic-bezier(.32, .08, .78, .55)',
      fill: 'both'
    }).finished;
  }

  function burstSplinters(layer, center) {
    const count = window.innerWidth < 760 ? 24 : 44;
    for (let index = 0; index < count; index += 1) {
      const splinter = document.createElement('span');
      splinter.className = 'glass-splinter';
      const size = random(4, 17);
      splinter.style.cssText = `left:${center.x}px;top:${center.y}px;width:${size}px;height:${size * random(.6, 1.7)}px`;
      layer.append(splinter);
      const angle = random(0, Math.PI * 2);
      const power = random(70, 460);
      splinter.animate([
        { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate3d(${Math.cos(angle) * power * .6}px, ${Math.sin(angle) * power * .6}px, ${random(40, 340)}px) rotate(${random(-260, 260)}deg)`, opacity: 1, offset: .35 },
        { transform: `translate3d(${Math.cos(angle) * power}px, ${window.innerHeight}px, ${random(40, 340)}px) rotate(${random(-720, 720)}deg)`, opacity: 0 }
      ], { duration: random(620, 1250), easing: 'cubic-bezier(.3, .2, .8, .6)', fill: 'both' });
    }
  }

  /* ---------- 4. GlassBreak: vom Laden über den Riss bis zum Bruch ---------- */

  window.GlassBreak = class {
    constructor(url) {
      this.layer = document.createElement('div');
      this.layer.className = 'glass';
      this.layer.setAttribute('aria-hidden', 'true');
      this.frame = document.createElement('iframe');
      this.frame.className = 'glass-next';
      this.frame.tabIndex = -1;
      this.frame.title = 'Nächste Seite';
      this.layer.append(this.frame);
      document.body.append(this.layer);
      this.ready = this.load(url);
    }

    /* true, sobald die Zielseite wirklich geladen ist; sonst geht guide.js direkt zur Seite. */
    load(url) {
      return new Promise(resolve => {
        const timer = setTimeout(() => resolve(false), LOAD_TIMEOUT);
        this.frame.addEventListener('load', () => {
          clearTimeout(timer);
          try {
            resolve(Boolean(this.frame.contentDocument && this.frame.contentDocument.querySelector('main')));
          } catch (error) {
            resolve(false);
          }
        }, { once: true });
        this.frame.addEventListener('error', () => resolve(false), { once: true });
        this.frame.src = url;
      });
    }

    /* Erster Aufprall: Rissbild und Erschütterung. Die Seite dahinter bleibt noch stehen. */
    crack(center) {
      this.center = center;
      const { innerWidth: width, innerHeight: height, devicePixelRatio: ratio = 1 } = window;
      this.web = buildWeb(center, width, height);
      this.tint = document.createElement('div');
      this.tint.className = 'glass-tint';
      this.tint.style.setProperty('--x', `${center.x}px`);
      this.tint.style.setProperty('--y', `${center.y}px`);
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'glass-cracks';
      this.canvas.width = width * ratio;
      this.canvas.height = height * ratio;
      this.canvas.getContext('2d').scale(ratio, ratio);
      this.layer.append(this.tint, this.canvas);
      document.querySelectorAll('.header, main').forEach(part => part.animate(
        [{ translate: '0 0' }, { translate: '-7px 5px' }, { translate: '6px -4px' }, { translate: '-3px 2px' }, { translate: '0 0' }],
        { duration: 240, easing: 'ease-out' }
      ));
      return drawCracks(this.canvas, center, this.web.reach);
    }

    /* Scherben vorab anlegen und noch verborgen halten, damit der Bruch ohne Ruckeln beginnt. */
    prepare() {
      const template = snapshotPage();
      const scrollY = window.scrollY;
      this.pieces = this.web.cells.map(cell => ({ cell, shard: createShard(template, cell, scrollY) }));
      this.pieces.forEach(({ shard }) => this.layer.append(shard));
      const tracks = [...document.querySelectorAll('.slider-track')];
      this.pieces.forEach(({ shard }) => {
        shard.firstChild.scrollTop = Number(shard.dataset.scroll);
        shard.querySelectorAll('.slider-track').forEach((track, index) => { track.scrollLeft = tracks[index].scrollLeft; });
      });
    }

    /* Zweiter Aufprall: Die Scherben fallen, dahinter steht die neue Seite. */
    shatter() {
      this.layer.classList.add('is-broken');
      this.pieces.forEach(({ shard }) => shard.classList.add('is-loose'));
      this.tint.remove();
      this.canvas.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 90, fill: 'forwards' });
      burstSplinters(this.layer, this.center);
      return Promise.all(this.pieces.map(({ shard, cell }) => fallShard(shard, cell, this.center, this.web.reach)));
    }

    destroy() {
      this.layer.remove();
    }
  };
})();
