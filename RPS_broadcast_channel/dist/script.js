import {render, html, svg} from 'https://unpkg.com/uhtml?module';
import {define, useReducer, useEffect} from 'https://unpkg.com/hooked-elements?module';
const channel = new BroadcastChannel2('rps-301');





//
// Game Logic Reducer
function gameLogic(prevState, action) {
  const { type, hand } = action;
  let state = {...prevState}; // Shallow copy
  console.group('gameLogic Loop');
  console.log('action', action);
  console.log('prevState', prevState);
  console.groupEnd();

  if (type === 'click') {
    state.playerHand = hand;
  }
  else if (type === 'link-loaded') {
    console.log('Loaded from a link', action);
  }


  // Create the link to share
  state.urlParams.set('payload', JSON.stringify({
    hand: state.hand,
  }));
  state.shareLink = `${window.location.href}?${state.urlParams.toString()}`;
  return state;
}




//
// Main Game Component
define('rps-game', element => {
  // Hook reducer for game state.
  const [state, dispatch] = useReducer(gameLogic, {
    // Default Game State
    urlParams: new URLSearchParams(),
    possibleHands: ['rock', 'paper', 'scissors'],
    playerHand: null,
    opponentHand: null,
  });
  // On mount, start listening for channel messages.
  // dispatch any messages into the reducer.
  useEffect(() => {
    channel.addEventListener('message', dispatch);
  }, []);


  //
  // Render the component.
  render(element, html`
    <h1>Rock Paper Scissors!</h1>

    <rps-hand-picker
      selected=${state.playerHand}
      .possibleHands=${state.possibleHands}
      .dispatch=${dispatch}
      />

    <rps-share-link />

    <aside>
      <a href=${state.shareLink}>Opponent Turn Link</a>
    </aside>
  `);
});


//
// lets the player pick from a list of hands.
// Clicking a hand triggers dispatch
// The hand image is an SVG embeded in the HTML
define('rps-hand-picker', element => {
  const { dispatch, possibleHands } = element;

  render(element, html`${possibleHands.map(hand => svg.for({hand})`
    <svg hand=${hand} onClick=${() => dispatch({type: 'click', hand})}>
      <use href=${`#svg-${hand}`} />
    </svg>
  `)}
  </dialog>`);
});



//
// Share/Varifiy Link.
// This link is shared with the Opponent
define('rps-share-link', element => {
  render(element, html`
    <h1>Link!</h1>
  `);
});




//
// Channel Messages
const urlParams = new URLSearchParams(location.search);
// console.log('Init Page', urlParams.get('payload'));
if (urlParams.has('payload')) {
  const payload = urlParams.get('payload');
  // console.log('POST Message');
  // channel.postMessage('Howdy');
  channel.postMessage(JSON.stringify({
    type: 'link-loaded',
    payload,
  }));
}
