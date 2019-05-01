import { ANIMATION_DURATION } from '../consts.js';

export function closeDialog() {
  return anime({
    targets: '#elDialog',
    easing: 'easeInQuart',
    duration: ANIMATION_DURATION/2,
    translateX: [0, '-80vw'],
  }).finished;
}
