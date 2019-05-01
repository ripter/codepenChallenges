import { FLOOR_SIZE, ANIMATION_DURATION, ACTIONS } from './consts.js';
import { loadLevel } from './actions/loadLevel.js';
import { startGame } from './actions/startGame.js';
import { previewIsland } from './actions/previewIsland.js';
import { nextStoryDialog } from './actions/nextStoryDialog.js';
import { renderGame } from './views/index.js';
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
    updateIslandPositions(this, event);
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
// updates the position of islands in the state.islands array.
// Swaps the two islands in state.swapIndexes.
function updateIslandPositions(state) {
  const { swapIndexes, islands } = state;
  if (swapIndexes.length !== 2) { return state; }
  const bottomIsland = islands[swapIndexes[0]];
  const topIsland = islands[swapIndexes[1]];

  // Swap the islands!
  islands.splice(swapIndexes[1], 1, bottomIsland);
  islands.splice(swapIndexes[0], 1, topIsland);
  // Swap the Visitors x,y positions
  const bottomVisitor = state.getVisitorAt(swapIndexes[0]);
  const topVisitor = state.getVisitorAt(swapIndexes[1]);
  if (bottomVisitor) {
    Object.assign(bottomVisitor, indexToPoint(swapIndexes[1]));
  }
  if (topVisitor) {
    Object.assign(topVisitor, indexToPoint(swapIndexes[0]));
  }
  // clear the indexes
  swapIndexes.length = 0;
  return state;
}
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

  console.log('nextAction', nextAction);
  state.lastAction = nextAction;

  // If we where previewing the island
  // this click should open the next dialog
  if (lastAction === ACTIONS.PREVIEW_ISLAND) {
    return nextStoryDialog(state).then(() => {
      console.log('nextStoryDialog complete');
    });
  }

  if (nextAction === ACTIONS.PREVIEW_ISLAND) {
    console.log('show island preview');
    return previewIsland(state).then(() => {
      console.log('previewIsland complete');
    });
  }



  if(nextAction === ACTIONS.HIDE_UNTIL_CLICK) {
    // Animate closed and then update the state.
    animationHideDialog(state).then(() => {
      // re-render with the new state.
      state.triggerRender();
    });
  }

  if (nextAction === ACTIONS.START_GAME) {
    Promise.all([
      animationHideDialog(state),
      animationExplode(state),
    ]).then(() => {
      state.visitors = randomizeVisitors(visitors);
      // re-render with the new state.
      state.triggerRender();
    });
  }

  if (nextAction === ACTIONS.GAME_OVER) {
    // just close the dialog so the user can see the island.
    animationHideDialog(state);
  }

  if (nextAction === ACTIONS.SWAP_ISLANDS && !isDialogOpen) {
    const bottomIndex = parseInt(currentTarget.dataset.idx, 10);
    const topIndex = state.getPairedIndex(bottomIndex);
    // Skip invalid pairs (like the top islands)
    if (topIndex < 0) { return state; }
    // Start the animation.
    animationSwap(state, [bottomIndex, topIndex]).then(() => {
      state.swapIndexes = [bottomIndex, topIndex];
      // re-render with the new state.
      state.triggerRender();
    });
  }

  return state;
}


//
// Randomizes the visitors along the y-axis only.
function randomizeVisitors(visitors) {
  // Create a random list of indexes for each column.
  const randomIndexes = Array(FLOOR_SIZE).fill().map(() => {
    return Array(FLOOR_SIZE).fill().map((_, i) => i).sort(() => 0|Math.random()*3-2);
  });
  // Give each visitor a new random y position from the random list.
  return visitors.map((visitor) => {
    visitor.y = randomIndexes[visitor.x].pop();
    return visitor;
  });
}



//
// Animations
// Island Swap
function animationSwap(state, [bottomIndex, topIndex]) {
  markStartAnimation(state);
  return Promise.all([
    anime({
      targets: `.island:nth-child(${topIndex+1})`,
      delay: 0,
      duration: ANIMATION_DURATION,
      easing: 'easeOutExpo',
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 110},
        {translateX: '50%', translateY: '50%'},
        {translateX: '0%', translateY: '100%', 'z-index': 100},
      ],
    }).finished,
    anime({
      targets: `.island:nth-child(${bottomIndex+1})`,
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc',
      delay: 0,
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 110},
        {translateX: '-50%', translateY: '-50%'},
        {translateX: '0%', translateY: '-100%', 'z-index': 100},
      ],
    }).finished,
  ]).then(() => {
    // remove the styles anime added for the animation. State will have the island in the new position on re-render.
    document.querySelectorAll(`.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`).forEach(elm => elm.removeAttribute('style'));
    markEndAnimation(state);
  });
}
//
// explode the world into islands!
function animationExplode(state) {
  markStartAnimation(state);

  const promiseList = [{x:200, y:108}, {x:154, y:31}, {x:108, y:-46}, {x:62, y:-123}, {x:16, y:-200}].map((start, index) => {
    const targets = Array(FLOOR_SIZE)
      .fill()
      .map((_, i) => index*FLOOR_SIZE+i)
      .reduce((result, num) => `${result}, .island:nth-child(${num+1})`, '').substring(1);
    return anime({
      targets,
      duration: ANIMATION_DURATION,
      translateX: [anime.stagger('-54%', { start: start.x }), 0],
      translateY: [anime.stagger('23%', { start: start.y }), 0],
      easing: 'easeInOutSine',
    }).finished;
  });
  return Promise.all(promiseList).then(() => {
    markEndAnimation(state);
    document.querySelectorAll('.island').forEach(resetTransforms);
  });
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
function resetTransforms(elm) {
  elm.style.transform = '';
  return elm;
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
