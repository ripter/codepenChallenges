import { wrapForAnimation } from '../markAnimation.js';
import { animateCloseDialog } from '../animations/closeDialog.js';

/**
 * Closes the dialog
 * @return {Promise}
 */
export const previewIsland = wrapForAnimation((/*state*/) => {
  return Promise.all([
    animateCloseDialog(),
  ]);
});
