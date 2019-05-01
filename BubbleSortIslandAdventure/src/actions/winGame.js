import { wrapForAnimation } from '../markAnimation.js';
import { animateRestoreIsland } from '../animations/restoreIsland.js';
import { animateOpenDialog } from '../animations/openDialog.js';


/**
 * Restore the grid back into one island.
 * Advance the story and open the dialog.
 * @return {Promise}
 */
export const winGame = wrapForAnimation((state) => {
  const { storyIndex } = state;
  state.set({
    storyIndex: storyIndex + 1,
  });
  return Promise.all([
    animateRestoreIsland(),
    animateOpenDialog(),
  ]);
});
