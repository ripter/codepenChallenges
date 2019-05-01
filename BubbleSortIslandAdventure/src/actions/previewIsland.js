import { wrapForAnimation } from '../markAnimation.js';
import { closeDialog } from '../animations/closeDialog.js';

export const previewIsland = wrapForAnimation((/*state*/) => {
  return Promise.all([
    closeDialog(),
  ]);
});
