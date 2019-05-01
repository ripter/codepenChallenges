import { wrapForAnimation } from '../markAnimation.js';
import { animationDestroyIsland } from '../animations/destroyIsland.js';
import { closeDialog } from '../animations/closeDialog.js';


export const destroyIsland = wrapForAnimation((state) => {
  return Promise.all([
    closeDialog(),
    animationDestroyIsland(),
  ]);
});


  // if (nextAction === ACTIONS.START_GAME) {
  //   Promise.all([
  //     animationHideDialog(state),
  //     animationExplode(state),
  //   ]).then(() => {
  //     state.visitors = randomizeVisitors(visitors);
  //     // re-render with the new state.
  //     state.triggerRender();
  //   });
  // }
