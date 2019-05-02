import { wrapForAnimation } from '../markAnimation.js';
import { animateDestoryIsland } from '../animations/destroyIsland.js';
import { animateCloseDialog } from '../animations/closeDialog.js';
import { FLOOR_SIZE } from '../consts.js';


/**
 * "Destory" the island by randomizing the visitors and breaking it into a grid.
 * @return {Promise}
 */
export const destroyIsland = wrapForAnimation((state) => {
  const { visitors } = state;
  state.set({
    visitors: randomizeVisitors(visitors),
  });
  return Promise.all([
    animateCloseDialog(),
    animateDestoryIsland(),
  ]);
});

/**
 * Randomizes the visitors along the y-axis only.
 */
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
