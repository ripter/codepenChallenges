import { FLOOR_SIZE, ACTIONS } from './consts.js';
import { loadLevel } from './actions/loadLevel.js';
import { startGame } from './actions/startGame.js';
import { previewIsland } from './actions/previewIsland.js';
import { destroyIsland } from './actions/destroyIsland.js';
import { bubbleIsland } from './actions/bubbleIsland.js';
import { nextStoryDialog } from './actions/nextStoryDialog.js';
import { renderGame } from './views/renderGame.js';
import { indexToPoint, pointToIndex } from './point.js';

//
// Game State
const gameState = window.gameState = {
  isDialogOpen: false,
  storyIndex: 0,
  islands: [],
  goal: [],
  visitors: [],
  //
  // Handle's events, updates state, and triggers re-render
  handleEvent(event) {
    event.preventDefault();
    // console.log('event', event.type, event);
    handleClick(this, event);
  },
  //
  // Returns the the index for the island above.
  // User clicks the bottom and the island swaps with the one above it.
  getPairedIndex(index) {
    const { x, y } = indexToPoint(index);
    return pointToIndex({x, y: y-1});
  },
  //
  // Returns the visitor on island at index.
  // or null if no visitor is on that island.
  getVisitorAt(index) {
    const { x, y } = indexToPoint(index);
    return this.visitors.find((visitor) => visitor.x === x && visitor.y === y);
  },

  //
  // Updates the state and triggers a change aka re-render.
  set(newState) {
    // Merge in the new state.
    Object.assign(this, newState);
    // Trigger change, we don't need to check if it really changed because lighterhtml is awesome!
    this.onChange(this);
  },
};



function handleClick(state, event) {
  const { lastAction, isAnimating } = state;
  const { currentTarget, type } = event;
  // Only respond to clicks when not animating.
  if ('click' !== type || isAnimating) { return state; }
  const nextAction = currentTarget.getAttribute('action');
  let bottomIndex;

  state.lastAction = nextAction;

  // If we where previewing the island,
  // then this click should open the next dialog.
  if (lastAction === ACTIONS.PREVIEW_ISLAND) {
    return nextStoryDialog(state);
  }

  switch (nextAction) {
    case ACTIONS.PREVIEW_ISLAND:
      return previewIsland(state);
    case ACTIONS.DESTROY_ISLAND:
      return destroyIsland(state);
    case ACTIONS.SWAP_ISLANDS:
      bottomIndex = parseInt(currentTarget.dataset.idx, 10);
      return bubbleIsland(state, bottomIndex);
    default:
      // console.warn('unknown action', nextAction);
  }

  return state;
}


//
// Define some levels
const levels = [{
  mobs: [
    {x: 4, y: 0, spritesheet: 'img-water', sprite: 3},
    {x: 3, y: 0, spritesheet: 'img-water', sprite: 5},
    {x: 4, y: 1, spritesheet: 'img-water', sprite: 1},
    {x: 3, y: 1, spritesheet: 'img-water', sprite: 0},
    {x: 4, y: 2, spritesheet: 'img-water', sprite: 4},
    {x: 3, y: 2, spritesheet: 'img-water', sprite: 2},

    {x: 0, y: 3, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 0, spritesheet: 'img-visitor', sprite: 1},
    {x: 1, y: 2, spritesheet: 'img-golem-1', sprite: 'forward'},
  ],
}, {
  mobs: [
    {x: 0, y: 2, spritesheet: 'img-number', sprite: 1},
    {x: 1, y: 2, spritesheet: 'img-number', sprite: 2},
    {x: 2, y: 2, spritesheet: 'img-number', sprite: 3},
    {x: 3, y: 2, spritesheet: 'img-number', sprite: 4},
    {x: 4, y: 2, spritesheet: 'img-number', sprite: 5},
  ],
}];

//
// Main
// Update the CSS vars to match the JS CONSTS
document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

// Re-render on state change
gameState.onChange = renderGame;
// Load and start the level
loadLevel(gameState, levels[1]);
renderGame(gameState);
startGame(gameState);
