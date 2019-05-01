import { markStartAnimation, markEndAnimation } from '../markAnimation.js';
import { animationRestoreIsland } from '../animations/restoreIsland.js';
import { openDialog } from '../animations/openDialog.js';


export function startGame(state) {
  markStartAnimation(state);
  return Promise.all([
    animationRestoreIsland(),
    openDialog(),
  ]).then(() => {
    markEndAnimation(state);
  });
}
