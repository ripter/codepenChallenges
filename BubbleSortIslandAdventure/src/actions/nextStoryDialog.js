import { openDialog } from '../animations/openDialog.js';

export function nextStoryDialog(state) {
  const { storyIndex } = state;

  // Update the state
  state.set({
    storyIndex:  storyIndex + 1,
  });
  // Run the animation
  return Promise.all([
    openDialog(),
  ]);
}
