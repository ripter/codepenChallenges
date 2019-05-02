import { wrapForAnimation } from '../markAnimation.js';
import { animateOpenDialog } from '../animations/openDialog.js';

/**
 * Advances the storyIndex and opens the dialog.
 * @return {Promise}
 */
export const nextStoryDialog = wrapForAnimation((state) => {
  const { storyIndex } = state;
  // Update the state
  state.set({
    storyIndex:  storyIndex + 1,
  });
  // Run the animation
  return Promise.all([
    animateOpenDialog(),
  ]);
});
