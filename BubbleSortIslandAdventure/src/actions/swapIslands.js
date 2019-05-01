import { winGame } from './winGame.js';
import { wrapForAnimation } from '../markAnimation.js';
import { animateSwapIslands } from '../animations/swapIslands.js';
import { indexToPoint } from '../point.js';


export const swapIslands = wrapForAnimation((state, bottomIndex) => {
  const { goal, visitors } = state;
  const topIndex = state.getPairedIndex(bottomIndex);
  // Skip invalid pairs (like the top islands)
  if (topIndex < 0) { return Promise.resolve(state); }

  return Promise.all([
    animateSwapIslands(bottomIndex, topIndex),
  ]).then(() => {
    // const islands = swap(state, bottomIndex, topIndex);
    // const didWin = checkDidWin(goal, visitors);
    // Update the state to reflect the visual change
    state.set({
      islands: swap(state, bottomIndex, topIndex),
      didWin: checkDidWin(goal, visitors),
    });
  }).then(() => {
    // Did the user win?
    if (state.didWin) {
      console.log('You Won!!');
      return winGame(state);
    }
  });
});

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
