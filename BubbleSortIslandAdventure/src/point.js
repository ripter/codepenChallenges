import { FLOOR_SIZE } from './consts.js';

export function indexToPoint(index) {
  return {
    x: 0| index % FLOOR_SIZE,
    y: 0| index / FLOOR_SIZE,
  };
}

export function pointToIndex({x, y}) {
  return x + (y * FLOOR_SIZE);
}
