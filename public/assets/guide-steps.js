'use strict';
/*
 * Fragebogen als Seerosen-Ebenen: Jede Frage ist eine Ebene aus Blättern, der Frosch hüpft aufs
 * gewählte Blatt und von dort zur nächsten Ebene. Die Fragen stehen in content/frog-guide.json,
 * jede Antwort landet als Aussage in Frosch.store und damit im Vorlagetext des Kontaktformulars.
 * Ab der zweiten Ebene lässt sich alles überspringen, die Zusammenfassung erlaubt Änderungen.
 */
window.Frosch.Steps = class {
  constructor(container, { onFinish, onLeave, onChange, onHop, onLevel }) {
    this.container = container;
    this.onFinish = onFinish;
    this.onLeave = onLeave;
    this.onChange = onChange;
    this.onHop = onHop;
    this.onLevel = onLevel;
    this.store = window.Frosch.store;
    this.questions = window.Frosch.data.questionnaire;
    this.statements = window.Frosch.data.statements;
    this.motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    this.topic = null;
    this.editing = false;
    this.busy = false;
  }

  /* Reihenfolge: Thema, Detail und Vertiefung zum Thema, dann die gemeinsamen Fragen, die dazu passen. */
  get levels() {
    const { first, details, followUp, common } = this.questions;
    const levels = [{ id: 'first', ...first }, { id: 'details', ...(details[this.topic] || { question: '', options: [] }) }];
    if (followUp[this.topic]) levels.push({ id: 'followUp', ...followUp[this.topic] });
    common.filter(level => !(level.skipFor || []).includes(this.topic)).forEach(level => {
      levels.push({ ...level, options: level.options.filter(option => option.hideFor !== this.topic) });
    });
    return levels;
  }

  chosen(level) {
    return level.options.filter(option => option.statement && this.store.has(option.statement));
  }

  /* Bereits gegebene Antworten bleiben auch nach einem Seitenwechsel erhalten. */
  restoreTopic() {
    const { details } = this.questions;
    const known = Object.keys(details).find(topic => details[topic].options.some(option => this.store.has(option.statement)));
    if (known) this.topic = known;
  }

  start() {
    this.restoreTopic();
    this.editing = false;
    if (this.store.count()) this.summary(); else this.show(0);
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
    /* Vor der Themenwahl fehlt noch die Vertiefung, die fast jedes Thema mitbringt. */
    const total = this.topic ? levels.length : levels.length + 1;
    const row = this.frame(index, total, `Ebene ${index + 1} von ${total}`);
    const heading = this.heading(level.question);
    if (level.multi) {
      const hint = document.createElement('p');
      hint.className = 'steps-hint';
      hint.textContent = 'Mehrere Antworten sind möglich.';
      this.container.append(hint);
    }

    const pond = document.createElement('div');
    pond.className = 'lily-pond';
    const picked = this.chosen(level);
    level.options.forEach((option, position) => {
      const selected = index === 0 ? option.topic === this.topic : picked.includes(option);
      const lily = this.lily(option, position, selected, () => {
        if (level.multi) this.toggle(lily, option); else this.answer(index, option, lily, pond);
      });
      pond.append(lily);
    });
    this.container.append(pond);

    if (level.multi) this.container.append(this.button('steps-next', 'Weiter', () => this.advance(index)));

    const footer = document.createElement('div');
    footer.className = 'steps-footer';
    footer.append(this.button('steps-back', 'Zurück', () => this.back(index)));
    if (index > 1 && this.store.count() && !this.editing) footer.append(this.button('steps-skip', 'Jetzt zur Anfrage', () => this.summary()));
    if (index > 0 && !level.multi) footer.append(this.button('steps-skip', 'Überspringen', () => this.skip(index)));
    this.container.append(footer);

    this.onChange();
    this.onLevel(row.querySelector('.is-current'));
    heading.focus({ preventScroll: true });
  }

  toggle(lily, option) {
    const selected = !this.store.has(option.statement);
    if (selected) this.store.add(option.statement); else this.store.remove(option.statement);
    lily.setAttribute('aria-pressed', String(selected));
    this.onHop(lily);
  }

  async answer(index, option, lily, pond) {
    if (this.busy) return;
    this.busy = true;
    lily.setAttribute('aria-pressed', 'true');
    await this.onHop(lily);
    if (this.motionOk) {
      pond.classList.add('is-sinking');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    this.busy = false;
    if (index === 0) {
      this.chooseTopic(option.topic);
      this.show(1);
      return;
    }
    this.chosen(this.levels[index]).forEach(old => this.store.remove(old.statement));
    this.store.add(option.statement);
    this.advance(index);
  }

  /* Ein anderes Thema verwirft die Antworten, die dazu nicht mehr passen. */
  chooseTopic(topic) {
    const { details, followUp, common } = this.questions;
    if (this.topic && this.topic !== topic) {
      [details[this.topic], followUp[this.topic]].filter(Boolean).forEach(level => {
        level.options.forEach(option => this.store.remove(option.statement));
      });
    }
    this.topic = topic;
    common.forEach(level => {
      const dropAll = (level.skipFor || []).includes(topic);
      level.options.filter(option => dropAll || option.hideFor === topic).forEach(option => this.store.remove(option.statement));
    });
  }

  skip(index) {
    this.chosen(this.levels[index]).forEach(old => this.store.remove(old.statement));
    this.advance(index);
  }

  advance(index) {
    if (this.editing || index >= this.levels.length - 1) this.summary(); else this.show(index + 1);
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
    const row = this.frame(levels.length, levels.length, 'Am Ziel');
    const rows = levels.flatMap((level, index) => (index ? this.chosen(level).map(answer => ({ index, answer })) : []));
    const heading = this.heading(rows.length ? 'Das schreiben wir für Sie in die Anfrage:' : 'Sie haben noch nichts ausgewählt.');

    const list = document.createElement('ul');
    list.className = 'steps-summary';
    rows.forEach(({ index, answer }) => {
      const item = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = this.statements.find(statement => statement.id === answer.statement).text;
      const change = this.button('steps-change', 'Ändern', () => this.show(index));
      change.setAttribute('aria-label', `Ändern: ${text.textContent}`);
      item.append(text, change);
      list.append(item);
    });
    this.container.append(list);
    const hint = document.createElement('p');
    hint.className = 'steps-hint';
    hint.textContent = 'Noch wird nichts gesendet. Im Formular können Sie alles ändern und ergänzen.';
    this.container.append(hint, this.button('steps-finish', 'In die Anfrage übernehmen', () => this.onFinish()));
    const footer = document.createElement('div');
    footer.className = 'steps-footer';
    footer.append(this.button('steps-back', 'Von vorn beginnen', () => {
      this.editing = false;
      this.show(0);
    }));
    this.container.append(footer);
    this.onChange();
    this.onLevel(row.lastElementChild);
    heading.focus({ preventScroll: true });
  }
};
