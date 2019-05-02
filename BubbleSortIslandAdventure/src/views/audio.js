import { html, render } from 'lighterhtml';


export function renderAudio(elm, state) {
  render(elm, () => html`<audio controls>
    <source src="var(--sfx--explode)" />
  </audio>`);
}
