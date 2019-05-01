import { FLOOR_SIZE, ANIMATION_DURATION, ACTIONS } from './consts.js';
import { loadLevel } from './actions/loadLevel.js';
import { startGame } from './actions/startGame.js';
import { previewIsland } from './actions/previewIsland.js';
import { destroyIsland } from './actions/destroyIsland.js';
import { swapIslands } from './actions/swapIslands.js';
import { nextStoryDialog } from './actions/nextStoryDialog.js';
import { renderGame } from './views/renderGame.js';
import { indexToPoint, pointToIndex } from './point.js';

//
// Game State
const gameState = window.gameState = {
  isDialogOpen: false,
  didWin: true,
  storyIndex: 0,
  swapIndexes: [],
  islands: [],
  goal: [],
  visitors: [],
  //
  // Handle's events, updates state, and triggers re-render
  handleEvent(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    // console.log('event', event.type, event);
    handleClick(this, event);
    // updateIslandPositions(this, event);
    updateDidWin(this, event);
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
  // Helper to trigger a re-render.
  triggerRender() {
    this.handleEvent({
      type: 'render',
    });
  },

  set(newState) {
    // Merge in the new state.
    Object.assign(this, newState);
    // Trigger change
    if (this.onChange) {
      this.onChange(this);
    }
  }
};


//
// Check if the user won!
function updateDidWin(state) {
  const { goal, visitors, didWin } = state;
  state.didWin = goal.every(({x, y, spritesheet, sprite}) => {
    return visitors.find((visitor) => {
      return visitor.x === x
        && visitor.y === y
        && visitor.spritesheet === spritesheet
        && visitor.sprite === sprite;
    });
  });

  // If we are switching to win for the first time.
  if (!didWin && state.didWin) {
    // ugly hack, we need to wait until after render to trigger the animation.
    setTimeout(() => {
      animationWin(state);
    });
  }
  return state;
}

function handleClick(state, event) {
  const { lastAction, visitors, isDialogOpen, isAnimating } = state;
  const { currentTarget, type } = event;
  // Only respond to clicks when not animating.
  if ('click' !== type || isAnimating) { return state; }
  const nextAction = currentTarget.getAttribute('action');

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
      const bottomIndex = parseInt(currentTarget.dataset.idx, 10);
      return swapIslands(state, bottomIndex);
    default:
      console.warn('unknown action', nextAction);
  }


  debugger;
  if (nextAction === ACTIONS.GAME_OVER) {
    // just close the dialog so the user can see the island.
    animationHideDialog(state);
  }

  return state;
}

function animationWin(state) {
  markStartAnimation(state);
  const promiseList = [
    animationRestore(state),
    animationShowDialog(state),
  ];
  return Promise.all(promiseList).then(() => {
    markEndAnimation(state);
  });
}



//
// Utils

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
}];

//
// Main
// Update the CSS vars to match the JS CONSTS
document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

// Re-render on state change
gameState.onChange = renderGame;
// Load and start the level
loadLevel(gameState, levels[0]);
renderGame(gameState);
startGame(gameState);
