
export function markStartAnimation(state) {
  state.isAnimating = true;
  console.log('marking start animation');
  //TODO: better spot to touching the DOM
  document.body.classList.add('is-animating');
  return state;
}

export function markEndAnimation(state) {
  state.isAnimating = false;
  console.log('marking end animation');
  //TODO: better spot to touching the DOM
  document.body.classList.remove('is-animating');
  return state;
}

export function wrapForAnimation(func) {
  return function(state) {
    markStartAnimation(state);
    return func(state).then(() => {
      markEndAnimation(state);
    });
  }
}
