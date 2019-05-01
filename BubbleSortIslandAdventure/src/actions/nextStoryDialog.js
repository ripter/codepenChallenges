import { openDialog } from '../animations/openDialog.js';

export function nextStoryDialog(state) {
  state.storyIndex += 1;
  return Promise.all([
    openDialog(),
  ]);
}
