import { wrapForAnimation } from '../markAnimation.js';
import { animateSwapIslands } from '../animations/swapIslands.js';
import { indexToPoint } from '../point.js';


export const swapIslands = wrapForAnimation((state, bottomIndex) => {
  const { islands, goal, visitors } = state;
  const topIndex = state.getPairedIndex(bottomIndex);
  // Skip invalid pairs (like the top islands)
  if (topIndex < 0) { return state; }

  return Promise.all([
    animateSwapIslands(bottomIndex, topIndex),
  ]).then(() => {
    // Update the state to reflect the visual change
    state.set({
      islands: swap(state, bottomIndex, topIndex),
      didWin: checkDidWin(goal, visitors),
    });
  });
});

function swap(state, bottomIndex, topIndex) {
  const { islands } = state
  const bottomIsland = islands[bottomIndex];
  const topIsland = islands[topIndex];
  // Swap the islands!
  islands.splice(topIndex, 1, bottomIsland);
  islands.splice(bottomIndex, 1, topIsland);
  // Swap the Visitors x,y positions
  const bottomVisitor = state.getVisitorAt(bottomIndex);
  const topVisitor = state.getVisitorAt(topIndex);
  if (bottomVisitor) {
    Object.assign(bottomVisitor, indexToPoint(topIndex));
  }
  if (topVisitor) {
    Object.assign(topVisitor, indexToPoint(bottomIndex));
  }
  return islands;
}

function checkDidWin(goal, visitors) {
  return goal.every(({x, y, spritesheet, sprite}) => {
    return visitors.find((visitor) => {
      return visitor.x === x
      && visitor.y === y
      && visitor.spritesheet === spritesheet
      && visitor.sprite === sprite;
    });
  });
}

//
// Check if the user won!
/*
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
*/


/*
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
*/


//
// updates the position of islands in the state.islands array.
// Swaps the two islands in state.swapIndexes.
/*
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
*/
