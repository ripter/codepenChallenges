import { animationRestoreIsland } from '../animations/restoreIsland.js';


export function startGame(state) {
  return Promise.all([
    animationRestoreIsland(state),
  ]);
}
