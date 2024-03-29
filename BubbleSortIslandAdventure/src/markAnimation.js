
export function markStartAnimation(state) {
  // setting directly because we do not want to trigger a re-render
  state.isAnimating = true;
  //TODO: better spot to touching the DOM
  document.body.classList.add('is-animating');
  return state;
}

export function markEndAnimation(state) {
  // setting directly because we do not want to trigger a re-render
  state.isAnimating = false;
  //TODO: better spot to touching the DOM
  document.body.classList.remove('is-animating');
  return state;
}

export function wrapForAnimation(func) {
  return function(...args) {
    markStartAnimation(args[0]);
    return func.apply(null, args).then(() => {
      markEndAnimation(args[0]);
    });
  };
}
