import { html, render } from 'lighterhtml';
import { STORY } from '../consts.js';

export function renderDialog(elm, state) {
  const { storyIndex } = state;
  const { title, paragraphs, next, side } = STORY[storyIndex];
  const classList = ['nes-dialog', 'is-rounded'];
  if ('evil' === side) {
    classList.push('is-dark');
  }
  else {
    classList.push('is-light');
  }

  render(elm, () => html`<div class=${classList.join(' ')}>
    <form method="dialog" ontransitionend=${state}>
      <p class="title">${title}</p>
      ${paragraphs.map(txt => html`<p>${txt}</p>`)}
      <menu class="dialog-menu">
        <button onclick=${state} action=${next.action} class="btn nes-btn is-primary">${next.label}</button>
      </menu>
    </form>
  </div>`);
}
