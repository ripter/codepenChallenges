import { ANIMATION_DURATION, SELECTOR_ISLANDS } from '../consts.js';

export function animationDestroyIsland() {
  const promiseList = SELECTOR_ISLANDS.map(({targets, start}) => {
    return anime({
      targets,
      duration: ANIMATION_DURATION,
      translateX: [anime.stagger('-54%', { start: start.x }), 0],
      translateY: [anime.stagger('23%', { start: start.y }), 0],
      easing: 'easeInOutSine',
    }).finished;
  });
  return Promise.all(promiseList);
}
