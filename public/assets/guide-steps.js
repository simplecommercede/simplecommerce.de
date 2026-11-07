'use strict';
/*
 * Fragebogen als Seerosen-Ebenen: Jede Frage ist eine Ebene aus Blättern, der Frosch hüpft aufs
 * gewählte Blatt und von dort zur nächsten Ebene. Die Fragen stehen in content/frog-guide.json,
 * jede Antwort landet als Aussage in Frosch.store und damit im Vorlagetext des Kontaktformulars.
 * Ab der zweiten Ebene lässt sich alles überspringen. Ein zweiter Klick wählt eine Antwort wieder ab,
 * die Zusammenfassung erlaubt Ändern und Abwählen.
 * Der kurze Weg endet nach den Fragen zur Sache; die übrigen Fragen sind freiwillig.
 */
const OPTIONAL_LEVELS = new Set(['team', 'wichtig', 'timing', 'extra', 'kontakt']);
const coreCount = levels => levels.filter(level => !OPTIONAL_LEVELS.has(level.id)).length;

window.Frosch.Steps = class {
  constructor(container, { onFinish, onLeave, onChange, onHop, onLevel, onArrive }) {
    this.container = container;
    this.onFinish = onFinish;
    this.onLeave = onLeave;
    this.onChange = onChange;
    this.onHop = onHop;
    this.onLevel = onLevel;
    this.onArrive = onArrive;
    this.store = window.Frosch.store;
    this.questions = window.Frosch.data.questionnaire;
    this.statements = window.Frosch.data.statements;
    this.motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    this.topic = null;
    this.editing = false;
    this.more = false;
    this.busy = false;
  }

  get levels() {
    return window.Frosch.levelsFor(this.topic);
  }

  /* Wie viele Ebenen der Weg gerade hat. */
  totalAt(index = 0) {
    const { levels } = this;
    const core = coreCount(levels);
    return this.more || index >= core ? levels.length : core;
  }

  chosen(level) {
    return level.options.filter(option => option.statement && this.store.has(option.statement));
  }

  /* Kennt die Seite das Thema, entfällt die erste Frage; zurück geht es trotzdem. */
  start(pageTopic) {
    this.topic = window.Frosch.topicFromStore() || pageTopic || this.topic;
    this.editing = false;
    this.more = false;
    if (this.store.count()) this.summary();
    else this.show(pageTopic && this.topic === pageTopic ? 1 : 0);
  }

  /* Bausteine */
  button(className, text, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  frame(index, total, label) {
    this.container.replaceChildren();
    const count = document.createElement('p');
    count.className = 'steps-count';
    count.textContent = label;
    const row = document.createElement('ol');
    row.className = 'lily-path';
    row.setAttribute('aria-hidden', 'true');
    for (let dot = 0; dot < total; dot += 1) {
      const item = document.createElement('li');
      if (dot < index) item.className = 'is-done';
      if (dot === index) item.className = 'is-current';
      row.append(item);
    }
    this.container.append(count, row);
    return row;
  }

  heading(text) {
    const heading = document.createElement('p');
    heading.className = 'steps-question';
    heading.tabIndex = -1;
    heading.textContent = text;
    this.container.append(heading);
    return heading;
  }

  lily(option, position, selected, onClick) {
    const lily = this.button('lily', '', onClick);
    lily.style.setProperty('--i', position);
    lily.setAttribute('aria-pressed', String(selected));
    const leaf = document.createElement('span');
    leaf.className = 'lily-leaf';
    const label = document.createElement('span');
    label.className = 'lily-label';
    label.textContent = option.label;
    lily.append(leaf, label);
    return lily;
  }

  /* Eine Ebene */
  show(index) {
    const { levels } = this;
    const level = levels[index];
    /* Vor der Themenwahl steht die Länge noch nicht fest: der längste Weg zählt. */
    const total = this.topic
      ? this.totalAt(index)
      : Math.max(...level.options.map(option => coreCount(window.Frosch.levelsFor(option.topic))));
    const row = this.frame(index, total, `Ebene ${index + 1} von ${total}`);
    const heading = this.heading(level.question);
    const picked = this.chosen(level);
    if (picked.length) {
      const hint = document.createElement('p');
      hint.className = 'steps-hint';
      hint.textContent = 'Nochmals antippen wählt die Antwort ab.';
      this.container.append(hint);
    }

    const pond = document.createElement('div');
    pond.className = 'lily-pond';
    level.options.forEach((option, position) => {
      const selected = index === 0 ? option.topic === this.topic : picked.includes(option);
      const lily = this.lily(option, position, selected, () => this.answer(index, option, lily, pond));
      pond.append(lily);
    });
    this.container.append(pond);

    this.live = document.createElement('p');
    this.live.className = 'steps-live';
    this.container.append(this.live);
    this.showLive();

    const footer = document.createElement('div');
    footer.className = 'steps-footer';
    footer.append(this.button('steps-back', 'Zurück', () => this.back(index)));
    if (index > 1 && this.store.count() && !this.editing) footer.append(this.button('steps-skip', 'Jetzt zur Anfrage', () => this.summary()));
    if (index > 0) {
      /* Mit einer Antwort geht es weiter, ohne sie zu verlieren. */
      footer.append(picked.length
        ? this.button('steps-skip', 'Weiter', () => this.advance(index))
        : this.button('steps-skip', 'Überspringen', () => this.skip(index)));
    }
    this.container.append(footer);

    this.onChange();
    this.onLevel(row.querySelector('.is-current'));
    heading.focus({ preventScroll: true });
  }

  /* Der Preis rechnet während der Fragen sichtbar mit. */
  showLive() {
    const sum = window.Frosch.price.short();
    this.live.hidden = !sum;
    this.live.textContent = sum ? `Kostenrahmen: ${sum}` : '';
  }

  async answer(index, option, lily, pond) {
    if (this.busy) return;
    if (index > 0 && this.store.has(option.statement)) {
      this.clearLevel(index);
      this.show(index);
      return;
    }
    this.busy = true;
    lily.setAttribute('aria-pressed', 'true');
    await this.onHop(lily);
    if (this.motionOk) {
      pond.classList.add('is-sinking');
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    this.busy = false;
    if (index === 0) {
      window.Frosch.dropForTopic(this.topic, option.topic);
      this.topic = option.topic;
      this.show(1);
      return;
    }
    this.clearLevel(index);
    this.store.add(option.statement);
    this.advance(index);
  }

  /* Eine neue Umsatzstufe ersetzt auch einen genauen Wert aus dem Preisrechner. */
  clearLevel(index) {
    const level = this.levels[index];
    this.chosen(level).forEach(old => this.store.remove(old.statement));
    if (level.id === 'umsatz') this.store.setRevenue(null);
  }

  skip(index) {
    this.clearLevel(index);
    this.advance(index);
  }

  advance(index) {
    if (this.editing || index >= this.totalAt(index) - 1) this.summary(); else this.show(index + 1);
  }

  back(index) {
    if (this.editing && index > 1) this.summary();
    else if (index === 0) this.onLeave();
    else this.show(index - 1);
  }

  /* Zusammenfassung: Jede Antwort lässt sich einzeln ändern, gesendet wird erst im Formular. */
  summary() {
    this.editing = true;
    const { levels } = this;
    const total = this.totalAt();
    const row = this.frame(total, total, 'Am Ziel');
    const rows = levels.flatMap((level, index) => (index ? this.chosen(level).map(answer => ({ index, answer })) : []));
    const heading = this.heading(rows.length ? 'Ihre Anfrage ist vorbereitet.' : 'Sie haben noch nichts ausgewählt.');

    const list = document.createElement('ul');
    list.className = 'steps-summary';
    rows.forEach(({ index, answer }) => {
      const item = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = this.statements.find(statement => statement.id === answer.statement).text;
      const change = this.button('steps-change', 'Ändern', () => this.show(index));
      change.setAttribute('aria-label', `Ändern: ${text.textContent}`);
      const remove = this.button('steps-change', 'Abwählen', () => {
        if (levels[index].id === 'umsatz') this.store.setRevenue(null);
        this.store.remove(answer.statement);
        this.summary();
      });
      remove.setAttribute('aria-label', `Abwählen: ${text.textContent}`);
      const actions = document.createElement('span');
      actions.className = 'steps-actions';
      actions.append(change, remove);
      item.append(text, actions);
      list.append(item);
    });
    this.container.append(this.button('steps-finish', rows.length ? 'Anfrage ansehen' : 'Zum Formular', () => this.onFinish(this.topic)));
    this.container.append(list);
    const price = window.Frosch.price.box({ link: true });
    if (price) this.container.append(price);
    const hint = document.createElement('p');
    hint.className = 'steps-hint';
    hint.textContent = 'Noch wird nichts gesendet. Im Formular können Sie alles ändern und ergänzen.';
    this.container.append(hint);
    const footer = document.createElement('div');
    footer.className = 'steps-footer';
    footer.append(this.button('steps-back', 'Von vorn beginnen', () => {
      this.editing = false;
      this.more = false;
      this.show(0);
    }));
    if (!this.more && total < levels.length) {
      footer.append(this.button('steps-skip', 'Genauer angeben (freiwillig)', () => {
        this.more = true;
        this.editing = false;
        this.show(total);
      }));
    }
    this.container.append(footer);
    this.onChange();
    this.onLevel(row.lastElementChild);
    if (this.onArrive) this.onArrive();
    heading.focus({ preventScroll: true });
  }
};
