import { html, render } from 'lighterhtml';
import { sfxExplode } from '../audio.js';


export function renderAudio(elm, {audio = null}) {
  let audioSource = html``;

  if (audio) {
    audioSource = html`<source src=${sfxExplode} />`;
  }
  render(elm, () => html`<audio autoplay>
    ${audioSource}
  </audio>`);
}
