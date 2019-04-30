import { animationRestoreIsland } from '../animations/restoreIsland.js';
import { openDialog } from '../animations/openDialog.js';


export function startGame(state) {
  return Promise.all([
    animationRestoreIsland(),
    openDialog(),
  ]);
}
