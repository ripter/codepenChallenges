import { winGame } from './winGame.js';
import { wrapForAnimation } from '../markAnimation.js';
import { animateSwapIslands } from '../animations/swapIslands.js';
import { indexToPoint } from '../point.js';


/**
 * Swaps the island at bottomIndex with the island above it.
 * aka, a single step in a bubble sort
 * @return {Promise}
 */
export const bubbleIsland = wrapForAnimation((state, bottomIndex) => {
  const { goal, visitors } = state;
  const topIndex = state.getPairedIndex(bottomIndex);
  // Skip invalid pairs (like the top islands)
  if (topIndex < 0) { return Promise.resolve(state); }

  return Promise.all([
    animateSwapIslands(bottomIndex, topIndex),
  ]).then(() => {
    // swap mutates the islands array
    swap(state, bottomIndex, topIndex);
    // calling set just to trigger a re-render.
    // swap mutated the islands array in place.
    state.set({});

    if (didWin(goal, visitors)) {
      winGame(state);
    }
  });
});

/**
 * Swaps two islands and their visitors in place.
 */
function swap(state, bottomIndex, topIndex) {
  const { islands } = state;
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

/**
 * Returns true when visitors are in the goal positions.
 */
function didWin(goal, visitors) {
  return goal.every(({x, y, spritesheet, sprite}) => {
    return visitors.find((visitor) => {
      return visitor.x === x
      && visitor.y === y
      && visitor.spritesheet === spritesheet
      && visitor.sprite === sprite;
    });
  });
}
