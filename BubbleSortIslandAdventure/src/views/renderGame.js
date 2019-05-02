import { renderAudio } from './audio.js';
import { renderIslands } from './islands.js';
import { renderDialog } from './dialog.js';

/**
 * Render/Update the state on the DOM
 * @param  {Object} state [description]
 */
export function renderGame(state) {
  renderAudio(window.elAudio, state);
  renderIslands(window.canvas, state);
  renderDialog(window.elDialog, state);
}
