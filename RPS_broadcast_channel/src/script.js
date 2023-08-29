import {render, html, svg} from 'https://unpkg.com/uhtml?module';
import {define, useReducer, useEffect} from 'https://unpkg.com/hooked-elements?module';

//
// Game Logic Functions.
//

//
// Main Reducer that creates a new game state.
function gameLogic(prevState, action) {
  const { type, hand, token, payload } = action;
  let state = {...prevState}; // Shallow copy
  console.group('gameLogic Loop');
  console.log('action', action);
  console.log('prevState', prevState);
  console.log('playerToken', prevState.playerToken);
  // console.log('state.token', state.token);

  //
  // Perform action based on type
  if (type === 'init') {
    // Load inital state
    Object.assign(state, initGame(payload, token));
  }
  else if (type === 'click') {
    // state.playerHand = hand;
  }

  // update share link and saved state.
  const turn = {
    hand: state.playerHand,
    token: state.playerToken,
  };
  state.sharePayload = createPayload(turn);
  // Update the token
  setToken(turn);

  console.log('turn', turn);
  console.log('state', state);
  console.groupEnd();
  return state;
}

//
// Returns the starting state based on localStorage and URL Search params
function initGame(payload, token) {
  const state = {};

  // Token holds our hand/token
  if (!token) {
    state.playerToken = uuidv4();
    state.playerHand = null;
  }
  else {
    state.playerToken = token.token;
    state.playerHand = token.hand;
  }

  // Payload holds opponent hand/token
  if (payload && payload.token !== state.playerToken) {
    state.opponentToken = payload.token;
    state.opponentHand = payload.hand;
  }

  return state;
  // console.group('initGame');
  // console.log('payload', payload);
  // console.log('token', token);
  // console.groupEnd();
  // Payload with no Token means we loaded from an opponent link,
  // but we have not taken our turn yet.
  // if (payload && !token) {
  //   console.log('Opponent has taken their turn, now take yours!');
  //   return {
  //     opponentHand: payload.hand,
  //     opponentToken: payload.token,
  //     playerToken: uuidv4(),
  //   };
  // }
  //
  // if (!payload && !token) {
  //   return {
  //     playerToken: uuidv4(),
  //   };
  // }
}


//
// React Hook Style Components
// Created with hooked-elements and uHtml
//

//
// Root Component
// Hooks used to manage game state.
define('rps-game', element => {
  // Hook reducer for game state.
  const [state, dispatch] = useReducer(gameLogic, {
    // Default State
    possibleHands: ['rock', 'paper', 'scissors'],
  });
  // On mount, dispatch the game init event.
  useEffect(() => {
    dispatch({
      type: 'init',
      payload: getPayload(),
      token: getToken(),
    })
  }, []);
  //
  // Render the component.
  render(element, html`
    <h1>Rock Paper Scissors!</h1>

    <h2>Pick your hand!</h2>
    <rps-hand-picker
      selected=${state.playerHand}
      .possibleHands=${state.possibleHands}
      .dispatch=${dispatch}
      />

    <h2>Opponent hand</h2>
    ${ShareLink({payload: state.sharePayload})}

    <rps-hand-picker
      selected=${state.opponentHand}
      .possibleHands=${state.possibleHands}
      />

  `);
});

//
// Render a clickable list of Hands
// defined as a hooked-element
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
function ShareLink(props) {
  const { payload } = props
  return html`
    <a href=${`${window.location.href}?${payload}`}>Opponent Link!</a>
  `;
}





//
// Utility Functions
//

// Returns a random UUID
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Retuns the payload object form the URL Search, or null
function getPayload() {
  try {
    const urlParams = new URLSearchParams(location.search);
    return JSON.parse(urlParams.get('payload'));
  }
  catch (e) {
    return null;
  }
}
// Creates a Search param string from the payload object.
function createPayload(payload) {
  try {
    const urlParams = new URLSearchParams();
    urlParams.set('payload', JSON.stringify(payload));
    return urlParams.toString();
  }
  catch (e) {
    throw new Error('Unable to update the URL payload.');
  }
}

// Returns the stored token object or null
function getToken() {
  try {
    const state = JSON.parse(localStorage.getItem('active-game'));
    // If it's an empty object, return null instead.
    if (Object.keys(state).length === 0) {
      return null;
    }
    return state;
  }
  catch (e) {
    return null;
  }
}
// Sets the token object in localStorage
// Set a null token to clear it.
function setToken(token) {
  try {
    if (token) {
      return localStorage.setItem('active-game', JSON.stringify(token));
    }
    return localStorage.removeItem('active-game');
  }
  catch (e) {
    // oops, game won't work without localStorage
    throw new Error('Game not playable without localStorage');
  }
}
