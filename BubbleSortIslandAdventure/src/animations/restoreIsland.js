import { ANIMATION_DURATION, SELECTOR_ISLANDS } from '../consts.js';

export function animationRestoreIsland() {
  const promiseList = SELECTOR_ISLANDS.map(({targets, start}) => {
    return anime({
      targets,
      duration: ANIMATION_DURATION,
      translateX: [0, anime.stagger('-54%', { start: start.x })],
      translateY: [0, anime.stagger('23%', { start: start.y })],
      easing: 'easeInOutSine',
    }).finished;
  });
  return Promise.all(promiseList);
}
