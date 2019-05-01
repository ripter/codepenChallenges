import { wrapForAnimation } from '../markAnimation.js';
import { restoreIsland } from '../animations/restoreIsland.js';
import { openDialog } from '../animations/openDialog.js';


export const startGame = wrapForAnimation((/*state*/) => {
  return Promise.all([
    restoreIsland(),
    openDialog(),
  ]);
});
