import { renderIslands } from './islands.js';

export function renderGame(state) {
  const elCanvas = window.canvas;
  renderIslands(elCanvas, state);
  // renderDialog(elDialog, this);
}
