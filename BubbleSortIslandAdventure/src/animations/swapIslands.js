import { ANIMATION_DURATION } from '../consts.js';

export function animateSwapIslands(bottomIndex, topIndex) {
  const selectorIslands = `.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`;
  // Save the current z-index so we can restore it after the animation.
  document.querySelectorAll(selectorIslands).forEach((elm) => {
    elm.dataset.zIndex = elm.style.zIndex;
    return elm;
  });
  return Promise.all([
    anime({
      autoplay: true,
      targets: `.island:nth-child(${topIndex+1})`,
      delay: 0,
      duration: ANIMATION_DURATION,
      easing: 'easeOutExpo',
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 510},
        {translateX: '50%', translateY: '50%'},
        {translateX: '0%', translateY: '100%', 'z-index': 500},
      ],
    }).finished,
    anime({
      autoplay: true,
      targets: `.island:nth-child(${bottomIndex+1})`,
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc',
      delay: 0,
      keyframes: [
        {translateX: '0%', translateY: '0%', 'z-index': 510},
        {translateX: '-50%', translateY: '-50%'},
        {translateX: '0%', translateY: '-100%', 'z-index': 500},
      ],
    }).finished,
  ]).then(() => {
    // remove the styles anime added by the animation.
    // it conflicts with the smart-updating re-rendering and causes visual issues.
    document.querySelectorAll(selectorIslands).forEach(resetTransforms);
  });
}

function resetTransforms(elm) {
  const { zIndex } = elm.dataset;
  elm.style.transform = '';
  elm.style.zIndex = zIndex;
  return elm;
}
