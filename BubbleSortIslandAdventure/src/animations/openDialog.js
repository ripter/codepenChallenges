import { ANIMATION_DURATION } from '../consts.js';

export function openDialog() {
  return anime({
    targets: '#elDialog',
    duration: ANIMATION_DURATION,
    easing: 'easeInQuart',
    translateX: ['-80vw', 0],
  }).finished;
}
