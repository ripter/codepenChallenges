import { markStartAnimation } from '../markAnimation.js';
import { animateCloseDialog } from '../animations/closeDialog.js';

/**
 * Closes the dialog
 * @return {Promise}
 */
export const gameOver =(state) => {
  // Mark it as animating, FOREVER!!!!
  markStartAnimation(state);
  return Promise.all([
    animateCloseDialog(),
  ]);
};
