import { wrapForAnimation } from '../markAnimation.js';
import { animateRestoreIsland } from '../animations/restoreIsland.js';
import { animateOpenDialog } from '../animations/openDialog.js';


/**
 * Combines the grid into a single island and opens the dialog.
 * @return {Promise}
 */
export const startGame = wrapForAnimation((/*state*/) => {
  return Promise.all([
    animateRestoreIsland(),
    animateOpenDialog(),
  ]);
});
