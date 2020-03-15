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
  // console.group('gameLogic Loop');
  // console.log('action', action);
  // console.log('prevState', prevState);
  // console.log('state.token', state.token);

  //
  // Perform action based on type
  if (type === 'init') {
    // Load inital state
    Object.assign(state, initGame(payload, token));
  }
  else if (type === 'click') {
    state.playerHand = hand;
    state.playerToken = uuidv4();
  }

  // update share link and saved state.
  const turn = {
    hand: state.playerHand,
    token: state.playerToken,
  };
  state.sharePayload = createPayload(turn);
  // Update the token
  setToken(turn);

  // const queryParams = createPayload({
  //   hand: state.playerHand,
  // });
  // state.shareLink = `${window.location.href}?${queryParams}`;

  // console.log('queryParams', queryParams);
  // console.log('state', state);
  // console.groupEnd();
  return state;
}

//
// Returns the starting state based on localStorage and URL Search params
function initGame(payload, token) {
  // Payload with no Token means we loaded from an opponent link,
  // but we have not taken our turn yet.
  if (payload && !token) {
    return {
      opponentHand: payload.hand,
      opponentToken: payload.token,
    };
  }
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

    <rps-hand-picker
      selected=${state.playerHand}
      .possibleHands=${state.possibleHands}
      .dispatch=${dispatch}
      />

    <a href=${`${window.location.href}?${state.sharePayload}`}>Opponent Link!</a>
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
// function ShareLink(props) {
//   const { link } = props
//   console.log('ShareLink', props);
//   return html`
//     <a href=${link}>Opponent Link!</a>
//   `;
// }
// define('rps-share-link', element => {
//   const { link } = element;
//   // const href = element.getAttribute('href');
//   console.log('rps-share-link', element);
//   render(element, html`
//     <a href=${link}>Opponent Link!</a>
//   `);
// });
define('rps-share-link', {
  // observedAttributes: ['payload'],
  attributeChanged(name, oldValue, newValue) {
    console.group('attribbute changed');
    console.log('name', name);
    console.log('newValue', newValue);
    console.log('this', this);
    console.groupEnd();
    this.render(this);
    this.link = newValue;
    // this.element.removeAttribute(name);
  },

  render(element) {
    // const link = element.getAttribute('href');
    // const link = 'Rose:Chris';
    const { payload } = element;
    console.log('element', element, payload);
    render(element, html`
      <a href=${`${window.location.href}?${payload}`}>Opponent Link!</a>
    `);
  },
});




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
    return JSON.parse(localStorage.getItem('active-game'));
  }
  catch (e) {
    return null;
  }
}
// Sets the token object in localStorage
function setToken(token) {
  try {
    return localStorage.setItem('active-game', JSON.stringify(token));
  }
  catch (e) {
    // oops, game won't work without localStorage
    throw new Error('Game not playable without localStorage');
  }
}
