import { loadLevel } from './loadLevel.js';
import { startGame } from './startGame.js';
import { wrapForAnimation } from '../markAnimation.js';
import { animateCloseDialog } from '../animations/closeDialog.js';
import { LEVELS } from '../consts.js';


/**
 * Restore the grid back into one island.
 * Advance the story and open the dialog.
 * @return {Promise}
 */
export const nextLevel = wrapForAnimation((state) => {
  const level = state.level + 1;
  const storyIndex = state.storyIndex + 1;

  return Promise.all([
    animateCloseDialog(),
    loadLevel(state, LEVELS[level]),
  ]).then(() => {
    state.set({
      level,
      storyIndex,
    });
    return startGame(state);
    // return animateOpenDialog();
  });
});
