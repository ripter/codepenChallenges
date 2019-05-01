import { wrapForAnimation } from '../markAnimation.js';
import { animateSwapIslands } from '../animations/swapIslands.js';
import { indexToPoint } from '../point.js';


export const swapIslands = wrapForAnimation((state, bottomIndex) => {
  const { islands } = state;
  const topIndex = state.getPairedIndex(bottomIndex);
  // Skip invalid pairs (like the top islands)
  if (topIndex < 0) { return state; }

  console.log('swapIslands', state);
  return Promise.all([
    // swapIslands(bottomIndex, topIndex),
    animateSwapIslands(bottomIndex, topIndex),
  ]).then(() => {
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

    // Trigger a re-render
    state.set({
      islands,
    });
  });
});



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
