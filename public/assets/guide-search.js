'use strict';
/*
 * Suche im Teich des Frosch-Wegweisers: findet jede öffentliche Seite direkt aus dem Teich.
 * Der Seitenindex (assets/search-index.json, vom Generator erzeugt) wird erst beim ersten Fokus geladen
 * und nur im Browser durchsucht. Eingaben verlassen das Gerät nicht und werden nicht gespeichert.
 */
window.Frosch.Search = class {
  constructor(root, onChange) {
    this.input = root.querySelector('input');
    this.results = root.querySelector('.pond-results');
    this.onChange = onChange;
    this.pages = null;
    this.input.addEventListener('focus', () => this.load(), { once: true });
    this.input.addEventListener('input', () => this.render());
    this.input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const first = this.results.querySelector('a');
      if (first) window.location.href = first.href;
    });
  }

  static normalize(text) {
    return text.toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  load() {
    if (!this.loading) {
      this.loading = fetch('/assets/search-index.json')
        .then(response => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then(pages => {
          this.pages = pages.map(page => ({
            ...page,
            title: window.Frosch.Search.normalize(page.t),
            text: window.Frosch.Search.normalize(page.d)
          }));
        })
        .catch(() => { this.pages = []; this.failed = true; });
    }
    return this.loading;
  }

  find(query) {
    const words = window.Frosch.Search.normalize(query).split(/\s+/).filter(Boolean);
    return this.pages
      .map(page => {
        const fits = words.every(word => page.title.includes(word) || page.text.includes(word));
        return { page, score: fits ? words.filter(word => page.title.includes(word)).length * 3 + 1 : 0 };
      })
      .filter(hit => hit.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(hit => hit.page);
  }

  link(text, url, note) {
    const link = document.createElement('a');
    link.className = 'pond-hit';
    link.href = url;
    /* Direkt zur Seite, ohne Scheibenbruch: Wer sucht, will schnell ankommen. */
    link.dataset.direct = 'true';
    const title = document.createElement('strong');
    title.textContent = text;
    link.append(title);
    if (note) {
      const detail = document.createElement('small');
      detail.textContent = note;
      link.append(detail);
    }
    return link;
  }

  async render() {
    const query = this.input.value.trim();
    if (query.length < 2) {
      this.results.replaceChildren();
      this.onChange(false);
      return;
    }
    await this.load();
    if (query !== this.input.value.trim()) return;
    const hits = this.find(query);
    const nodes = hits.map(page => this.link(page.t, page.p, page.d));
    if (!hits.length) {
      const empty = document.createElement('p');
      empty.className = 'pond-empty';
      empty.textContent = this.failed ? 'Die Suche geht gerade nicht. Fragen Sie uns gern direkt.' : 'Dazu finde ich nichts. Fragen Sie uns gern direkt.';
      nodes.push(empty, this.link('Zum Kontakt', '/kontakt/'));
    }
    this.results.replaceChildren(...nodes);
    this.onChange(true);
  }

  clear() {
    this.input.value = '';
    this.results.replaceChildren();
    this.onChange(false);
  }
};
