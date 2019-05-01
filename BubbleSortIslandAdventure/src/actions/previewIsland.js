import { markStartAnimation, markEndAnimation } from '../markAnimation.js';
import { closeDialog } from '../animations/closeDialog.js';

export function previewIsland(state) {
  markStartAnimation(state);
  return Promise.all([
    closeDialog(),
  ]).then(() => {
    // advance to the next story
    // state.storyIndex += 1;
    markEndAnimation(state);
  });
}
