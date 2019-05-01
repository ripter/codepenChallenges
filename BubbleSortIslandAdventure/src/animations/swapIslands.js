import { ANIMATION_DURATION, SELECTOR_ISLANDS } from '../consts.js';

export function swapIslands() {

}


//
// Animations
// Island Swap
function animationSwap(state, [bottomIndex, topIndex]) {
  markStartAnimation(state);
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
    // remove the styles anime added for the animation. State will have the island in the new position on re-render.
    document.querySelectorAll(`.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`).forEach(elm => elm.removeAttribute('style'));
    markEndAnimation(state);
  });
}
