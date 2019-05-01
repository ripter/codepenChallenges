import { wrapForAnimation } from '../markAnimation.js';
import { restoreIsland } from '../animations/restoreIsland.js';


export const swapIslands = wrapForAnimation((/*state*/) => {
  return Promise.all([
    restoreIsland(),
    openDialog(),
  ]);
});
