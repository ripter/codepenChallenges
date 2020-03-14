import {render, html} from 'https://unpkg.com/uhtml?module';
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
    state.hand = hand;
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
define('game-rps', element => {
  // Hook reducer for game state.
  const [state, dispatch] = useReducer(gameLogic, {
    urlParams: new URLSearchParams(),
  });
  // On mount, start listening for channel messages.
  // dispatch any messages into the reducer.
  useEffect(() => {
    channel.addEventListener('message', dispatch);
  }, []);
  
  // Create a Hand for each possible option.  

  
  // Render the component.
  render(element, html`
    <h1>Rock Paper Scissors!</h1>
    
    <aside>
      <a href=${state.shareLink}>Opponent Turn Link</a>
    </aside>
  `);
});


define('rps-picker', element => {
    const hands = ['rock', 'paper', 'scissors'].map((hand) => {
    return html`<rps-hand 
      .hand=${hand} 
      onClick=${() => dispatch({type: 'click', hand})}
    ></rps-hand>`;
  });
  
  render(element, html`<dialog>
    ${hands}
  </dialog>`);
});


// Hand component. Just shows the SVG Image.
define('rps-hand', element => {
  const { hand } = element;
  render(element, html`
    <svg class="hand">
      <use href=${`#svg-${hand}`} />
    </svg>
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