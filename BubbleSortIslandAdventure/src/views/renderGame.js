import { renderIslands } from './islands.js';
import { renderDialog } from './dialog.js';

/**
 * Render/Update the state on the DOM
 * @param  {Object} state [description]
 */
export function renderGame(state) {
  renderIslands(window.canvas, state);
  renderDialog(window.elDialog, state);
}
