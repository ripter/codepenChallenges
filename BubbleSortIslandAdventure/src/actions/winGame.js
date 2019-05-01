import { wrapForAnimation } from '../markAnimation.js';
import { restoreIsland } from '../animations/restoreIsland.js';
import { openDialog } from '../animations/openDialog.js';


export const winGame = wrapForAnimation((state) => {
  const { storyIndex } = state;
  state.set({
    storyIndex: storyIndex + 1,
  });
  return Promise.all([
    restoreIsland(),
    openDialog(),
  ]);
});
