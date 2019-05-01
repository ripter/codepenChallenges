import { FLOOR_SIZE } from '../consts.js';

/**
 * Loads the level data
 * Turns mobs into visitors, islands, and goal
 * @return {Promise}
 */
export function loadLevel(state = {}, level) {
  const { mobs } = level;

  // Mob original position is the solution to the puzzle.
  state.goal = JSON.parse(JSON.stringify(mobs));
  // Mobs become visitors that are shuffled on the y-axis
  state.visitors = JSON.parse(JSON.stringify(mobs));
  // Islands use random sprites.
  state.islands = Array(FLOOR_SIZE*FLOOR_SIZE).fill().map(() => {
    return {
      spritesheet: 'island',
      sprite: 0|Math.random()*6,
    };
  });

  return Promise.resolve(state);
}
