import { ANIMATION_DURATION } from '../consts.js';

export function animateOpenDialog() {
  return anime({
    targets: '#elDialog',
    easing: 'easeInQuart',
    duration: ANIMATION_DURATION,
    translateX: ['-80vw', 0],
  }).finished;
}
