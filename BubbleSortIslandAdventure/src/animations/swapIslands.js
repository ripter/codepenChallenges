import { ANIMATION_DURATION } from '../consts.js';

export function animateSwapIslands(bottomIndex, topIndex) {
  return Promise.all([
    anime({
      targets: `.island:nth-child(${topIndex+1})`,
      delay: 0,
      duration: ANIMATION_DURATION,
      easing: 'easeOutExpo',
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 110},
        {translateX: '50%', translateY: '50%'},
        {translateX: '0%', translateY: '100%', 'z-index': 100},
      ],
    }).finished,
    anime({
      targets: `.island:nth-child(${bottomIndex+1})`,
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc',
      delay: 0,
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 110},
        {translateX: '-50%', translateY: '-50%'},
        {translateX: '0%', translateY: '-100%', 'z-index': 100},
      ],
    }).finished,
  ]).then(() => {
    // remove the styles anime added by the animation.
    // it conflicts with the smart-updating re-rendering and causes visual issues.
    document.querySelectorAll(`.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`).forEach(resetTransforms);
  });
}

function resetTransforms(elm) {
  elm.style.transform = '';
  return elm;
}
