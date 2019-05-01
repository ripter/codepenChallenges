
export function markStartAnimation(state) {
  state.isAnimating = true;
  //TODO: better spot to touching the DOM
  document.body.classList.add('is-animating');
  return state;
}

export function markEndAnimation(state) {
  state.isAnimating = false;
  //TODO: better spot to touching the DOM
  document.body.classList.remove('is-animating');
  return state;
}
