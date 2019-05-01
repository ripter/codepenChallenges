import { html, render } from 'lighterhtml';
import { ACTIONS } from '../consts.js';

//
// Visitor is just a sprite.
const renderVisitor = ({sprite, spritesheet}) => html`<div class="visitor"
  spritesheet=${spritesheet}
  sprite=${sprite}>
</div>`;

//
// An island is a sprite with optional child sprite.
const renderIsland = ({sprite}, visitor, handleEvent, key) => html`<div
  class="island"
  data-idx=${key}
  sprite=${sprite}
  onclick=${handleEvent}
  action=${ACTIONS.SWAP_ISLANDS}
  style=${`z-index: ${100+key}`}
  >
  ${!visitor ? '' : renderVisitor(visitor)}
</div>`;

export function renderIslands(elm, state) {
  const { islands } = state;
  // Render the islands
  render(elm, () => html`<div>
  ${islands.map((island, idx) => {
    const visitor = state.getVisitorAt(idx);
    return renderIsland(island, visitor, state, idx);
  })}</div>`);
}
