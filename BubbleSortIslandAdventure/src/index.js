import { FLOOR_SIZE, ACTIONS, LEVELS } from './consts.js';
import { loadLevel } from './actions/loadLevel.js';
import { startGame } from './actions/startGame.js';
import { previewIsland } from './actions/previewIsland.js';
import { destroyIsland } from './actions/destroyIsland.js';
import { bubbleIsland } from './actions/bubbleIsland.js';
import { nextStoryDialog } from './actions/nextStoryDialog.js';
import { nextLevel } from './actions/nextLevel.js';
import { renderGame } from './views/renderGame.js';
import { indexToPoint, pointToIndex } from './point.js';

//
// Game State
const gameState = window.gameState = {
  goal: [],
  isAnimating: false,
  islands: [],
  storyIndex: 0,
  level: 0,
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
    case ACTIONS.NEXT_STORY:
      return nextStoryDialog(state);
    case ACTIONS.NEXT_LEVEL:
      return nextLevel(state);
    default:
      console.warn('unknown action', nextAction);
  }

  return state;
}


//
// Main
// Update the CSS vars to match the JS CONSTS
document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

// Re-render on state change
gameState.onChange = renderGame;
// Load and start the level
loadLevel(gameState, LEVELS[gameState.level]);
renderGame(gameState);
startGame(gameState);
