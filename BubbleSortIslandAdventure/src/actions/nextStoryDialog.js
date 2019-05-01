import { wrapForAnimation } from '../markAnimation.js';
import { openDialog } from '../animations/openDialog.js';

export const nextStoryDialog = wrapForAnimation((state) => {
  const { storyIndex } = state;
  // Update the state
  state.set({
    storyIndex:  storyIndex + 1,
  });
  // Run the animation
  return Promise.all([
    openDialog(),
  ]);
});
