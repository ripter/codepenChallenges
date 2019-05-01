(function (lighterhtml) {
  'use strict';

  const FLOOR_SIZE = 5;
  const ANIMATION_DURATION = 2000;
  const ACTIONS = {
    PREVIEW_ISLAND: 'PREVIEW_ISLAND',
    DESTROY_ISLAND: 'DESTROY_ISLAND',
    
    START_GAME: 'START_GAME',
    SWAP_ISLANDS: 'SWAP_ISLANDS',
    WAIT: 'WAIT',
    NEXT_PAGE: 'NEXT_PAGE',
    GAME_OVER: 'GAME_OVER',
  };

  //
  // Island sectors and offsets used in the explode/restore animations
  const SELECTOR_ISLANDS = [{x:200, y:108}, {x:154, y:31}, {x:108, y:-46}, {x:62, y:-123}, {x:16, y:-200}].map((start, index) => {
    const targets = Array(FLOOR_SIZE)
      .fill()
      .map((_, i) => index*FLOOR_SIZE+i)
      .reduce((result, num) => `${result}, .island:nth-child(${num+1})`, '')
      .substring(1);
    return {
      targets,
      start,
    };
  });

  //
  // Story Phases!
  const STORY = [
    {
      title: 'Islander:',
      side: 'good',
      paragraphs: [
        'Oh! Hi there! I was just putting together my first island. 😁',
        'It\'s not much now, but I think it has potental 🥰',
        'Please, take a look around, but be careful not to poke it too hard, the dirt is still soft.',
      ],
      next: {
        label: 'Let me take a better look',
        action:  ACTIONS.PREVIEW_ISLAND,
      },
    },{
      title: 'Trouble Maker:',
      side: 'evil',
      paragraphs: [
        'You poked me!',
        'You look smart, so I\'ll poke your brain!',
        'Watch as I destroy this pitiful island!',
        'Bubble sort everything back into place, if you can!',
      ],
      next: {
        label: 'I\'m on it!',
        action: ACTIONS.DESTROY_ISLAND,
      },
    },{
      title: 'Islander:',
      side: 'good',
      paragraphs: [
        'You did it! 🤩🥳',
        'I knew you could do it!',
      ],
      next: {
        label: 'Thank you!',
        action: ACTIONS.GAME_OVER,
      },
    },
  ];

  /**
   * Loads the level data
   * Turns mobs into visitors, islands, and goal
   * @param  {Object} [state={}]
   * @param  {Object} level
   * @return {Object}
   */
  function loadLevel(state = {}, level) {
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

  function markStartAnimation(state) {
    // setting directly because we do not want to trigger a re-render
    state.isAnimating = true;
    //TODO: better spot to touching the DOM
    document.body.classList.add('is-animating');
    return state;
  }

  function markEndAnimation(state) {
    // setting directly because we do not want to trigger a re-render
    state.isAnimating = false;
    //TODO: better spot to touching the DOM
    document.body.classList.remove('is-animating');
    return state;
  }

  function wrapForAnimation(func) {
    return function(...args) {
      markStartAnimation(args[0]);
      return func.apply(null, args).then(() => {
        markEndAnimation(args[0]);
      });
    };
  }

  function restoreIsland() {
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

  function openDialog() {
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION,
      translateX: ['-80vw', 0],
    }).finished;
  }

  const startGame = wrapForAnimation((/*state*/) => {
    return Promise.all([
      restoreIsland(),
      openDialog(),
    ]);
  });

  function closeDialog() {
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION/2,
      translateX: [0, '-80vw'],
    }).finished;
  }

  const previewIsland = wrapForAnimation((/*state*/) => {
    return Promise.all([
      closeDialog(),
    ]);
  });

  function destoryIsland() {
    const promiseList = SELECTOR_ISLANDS.map(({targets, start}) => {
      return anime({
        targets,
        duration: ANIMATION_DURATION,
        translateX: [anime.stagger('-54%', { start: start.x }), 0],
        translateY: [anime.stagger('23%', { start: start.y }), 0],
        easing: 'easeInOutSine',
      }).finished;
    });
    return Promise.all(promiseList);
  }

  const destroyIsland = wrapForAnimation((state) => {
    const { visitors } = state;
    state.set({
      visitors: randomizeVisitors(visitors),
    });
    return Promise.all([
      closeDialog(),
      destoryIsland(),
    ]);
  });


  //
  // Randomizes the visitors along the y-axis only.
  function randomizeVisitors(visitors) {
    // Create a random list of indexes for each column.
    const randomIndexes = Array(FLOOR_SIZE).fill().map(() => {
      return Array(FLOOR_SIZE).fill().map((_, i) => i).sort(() => 0|Math.random()*3-2);
    });
    // Give each visitor a new random y position from the random list.
    return visitors.map((visitor) => {
      visitor.y = randomIndexes[visitor.x].pop();
      return visitor;
    });
  }

  const winGame = wrapForAnimation((state) => {
    const { storyIndex } = state;
    state.set({
      storyIndex: storyIndex + 1,
    });
    return Promise.all([
      restoreIsland(),
      openDialog(),
    ]);
  });

  function animateSwapIslands(bottomIndex, topIndex) {
    const selectorIslands = `.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`;
    // Save the current z-index so we can restore it after the animation.
    document.querySelectorAll(selectorIslands).forEach((elm) => {
      elm.dataset.zIndex = elm.style.zIndex;
      return elm;
    });
    return Promise.all([
      anime({
        autoplay: true,
        targets: `.island:nth-child(${topIndex+1})`,
        delay: 0,
        duration: ANIMATION_DURATION,
        easing: 'easeOutExpo',
        keyframes: [
          {translateX: '0%', translateY: '0%', 'z-index': 510},
          {translateX: '50%', translateY: '50%'},
          {translateX: '0%', translateY: '100%', 'z-index': 500},
        ],
      }).finished,
      anime({
        autoplay: true,
        targets: `.island:nth-child(${bottomIndex+1})`,
        duration: ANIMATION_DURATION,
        easing: 'easeOutCirc',
        delay: 0,
        keyframes: [
          {translateX: '0%', translateY: '0%', 'z-index': 510},
          {translateX: '-50%', translateY: '-50%'},
          {translateX: '0%', translateY: '-100%', 'z-index': 500},
        ],
      }).finished,
    ]).then(() => {
      // remove the styles anime added by the animation.
      // it conflicts with the smart-updating re-rendering and causes visual issues.
      document.querySelectorAll(selectorIslands).forEach(resetTransforms);
    });
  }

  function resetTransforms(elm) {
    const { zIndex } = elm.dataset;
    elm.style.transform = '';
    elm.style.zIndex = zIndex;
    return elm;
  }

  function indexToPoint(index) {
    return {
      x: 0| index % FLOOR_SIZE,
      y: 0| index / FLOOR_SIZE,
    };
  }

  function pointToIndex({x, y}) {
    return x + (y * FLOOR_SIZE);
  }

  const swapIslands = wrapForAnimation((state, bottomIndex) => {
    const { goal, visitors } = state;
    const topIndex = state.getPairedIndex(bottomIndex);
    // Skip invalid pairs (like the top islands)
    if (topIndex < 0) { return Promise.resolve(state); }

    return Promise.all([
      animateSwapIslands(bottomIndex, topIndex),
    ]).then(() => {
      // const islands = swap(state, bottomIndex, topIndex);
      // const didWin = checkDidWin(goal, visitors);
      // Update the state to reflect the visual change
      state.set({
        islands: swap(state, bottomIndex, topIndex),
        didWin: checkDidWin(goal, visitors),
      });
    }).then(() => {
      // Did the user win?
      if (state.didWin) {
        return winGame(state);
      }
      return state;
    });
  });

  function swap(state, bottomIndex, topIndex) {
    const { islands } = state;
    const bottomIsland = islands[bottomIndex];
    const topIsland = islands[topIndex];
    // Swap the islands!
    islands.splice(topIndex, 1, bottomIsland);
    islands.splice(bottomIndex, 1, topIsland);
    // Swap the Visitors x,y positions
    const bottomVisitor = state.getVisitorAt(bottomIndex);
    const topVisitor = state.getVisitorAt(topIndex);
    if (bottomVisitor) {
      Object.assign(bottomVisitor, indexToPoint(topIndex));
    }
    if (topVisitor) {
      Object.assign(topVisitor, indexToPoint(bottomIndex));
    }
    return islands;
  }

  function checkDidWin(goal, visitors) {
    return goal.every(({x, y, spritesheet, sprite}) => {
      return visitors.find((visitor) => {
        return visitor.x === x
        && visitor.y === y
        && visitor.spritesheet === spritesheet
        && visitor.sprite === sprite;
      });
    });
  }

  const nextStoryDialog = wrapForAnimation((state) => {
    const { storyIndex } = state;
    // Update the state
    state.set({
      storyIndex:  storyIndex + 1,
    });
    // Run the animation
    return Promise.all([
      openDialog(),
    ]);
  });

  //
  // Visitor is just a sprite.
  const renderVisitor = ({sprite, spritesheet}) => lighterhtml.html`<div class="visitor"
  spritesheet=${spritesheet}
  sprite=${sprite}>
</div>`;

  //
  // An island is a sprite with optional child sprite.
  const renderIsland = ({sprite}, visitor, handleEvent, key) => lighterhtml.html`<div
  class="island"
  data-idx=${key}
  sprite=${sprite}
  onclick=${handleEvent}
  action=${ACTIONS.SWAP_ISLANDS}
  style=${`z-index: ${100+key}`}
  >
  ${!visitor ? '' : renderVisitor(visitor)}
</div>`;

  function renderIslands(elm, state) {
    const { islands } = state;
    // Render the islands
    lighterhtml.render(elm, () => lighterhtml.html`<div>
  ${islands.map((island, idx) => {
    const visitor = state.getVisitorAt(idx);
    return renderIsland(island, visitor, state, idx);
  })}</div>`);
  }

  function renderDialog(elm, state) {
    const { storyIndex } = state;
    const { title, paragraphs, next, side } = STORY[storyIndex];
    const classList = ['nes-dialog', 'is-rounded'];
    if ('evil' === side) {
      classList.push('is-dark');
    }
    else {
      classList.push('is-light');
    }

    lighterhtml.render(elm, () => lighterhtml.html`<div class=${classList.join(' ')}>
    <form method="dialog" ontransitionend=${state}>
      <p class="title">${title}</p>
      ${paragraphs.map(txt => lighterhtml.html`<p>${txt}</p>`)}
      <menu class="dialog-menu">
        <button onclick=${state} action=${next.action} class="btn nes-btn is-primary">${next.label}</button>
      </menu>
    </form>
  </div>`);
  }

  /**
   * Render/Update the state on the DOM
   * @param  {Object} state [description]
   */
  function renderGame(state) {
    renderIslands(window.canvas, state);
    renderDialog(window.elDialog, state);
  }

  //
  // Game State
  const gameState = window.gameState = {
    isDialogOpen: false,
    didWin: true,
    storyIndex: 0,
    // swapIndexes: [],
    islands: [],
    goal: [],
    visitors: [],
    //
    // Handle's events, updates state, and triggers re-render
    handleEvent(event) {
      event.preventDefault();
      // console.log('event', event.type, event);
      handleClick(this, event);
    },
    //
    // Returns the the index for the island above.
    // User clicks the bottom and the island swaps with the one above it.
    getPairedIndex(index) {
      const { x, y } = indexToPoint(index);
      return pointToIndex({x, y: y-1});
    },
    //
    // Returns the visitor on island at index.
    // or null if no visitor is on that island.
    getVisitorAt(index) {
      const { x, y } = indexToPoint(index);
      return this.visitors.find((visitor) => visitor.x === x && visitor.y === y);
    },
    //
    // Helper to trigger a re-render.
    triggerRender() {
      this.handleEvent({
        type: 'render',
      });
    },

    set(newState) {
      // Merge in the new state.
      Object.assign(this, newState);
      // Trigger change
      if (this.onChange) {
        this.onChange(this);
      }
    },
  };



  function handleClick(state, event) {
    const { lastAction, isAnimating } = state;
    const { currentTarget, type } = event;
    // Only respond to clicks when not animating.
    if ('click' !== type || isAnimating) { return state; }
    const nextAction = currentTarget.getAttribute('action');
    let bottomIndex;

    state.lastAction = nextAction;

    // If we where previewing the island,
    // then this click should open the next dialog.
    if (lastAction === ACTIONS.PREVIEW_ISLAND) {
      return nextStoryDialog(state);
    }

    switch (nextAction) {
      case ACTIONS.PREVIEW_ISLAND:
        return previewIsland(state);
      case ACTIONS.DESTROY_ISLAND:
        return destroyIsland(state);
      case ACTIONS.SWAP_ISLANDS:
        bottomIndex = parseInt(currentTarget.dataset.idx, 10);
        return swapIslands(state, bottomIndex);
      default:
        // console.warn('unknown action', nextAction);
    }

    return state;
  }


  //
  // Define some levels
  const levels = [{
    mobs: [
      {x: 4, y: 0, spritesheet: 'img-water', sprite: 3},
      {x: 3, y: 0, spritesheet: 'img-water', sprite: 5},
      {x: 4, y: 1, spritesheet: 'img-water', sprite: 1},
      {x: 3, y: 1, spritesheet: 'img-water', sprite: 0},
      {x: 4, y: 2, spritesheet: 'img-water', sprite: 4},
      {x: 3, y: 2, spritesheet: 'img-water', sprite: 2},

      {x: 0, y: 3, spritesheet: 'img-visitor', sprite: 0},
      {x: 2, y: 0, spritesheet: 'img-visitor', sprite: 1},
      {x: 1, y: 2, spritesheet: 'img-golem-1', sprite: 'forward'},
    ],
  }, {
    mobs: [
      {x: 0, y: 2, spritesheet: 'img-number', sprite: 1},
      {x: 1, y: 2, spritesheet: 'img-number', sprite: 2},
      {x: 2, y: 2, spritesheet: 'img-number', sprite: 3},
      {x: 3, y: 2, spritesheet: 'img-number', sprite: 4},
      {x: 4, y: 2, spritesheet: 'img-number', sprite: 5},
    ],
  }];

  //
  // Main
  // Update the CSS vars to match the JS CONSTS
  document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
  document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

  // Re-render on state change
  gameState.onChange = renderGame;
  // Load and start the level
  loadLevel(gameState, levels[1]);
  renderGame(gameState);
  startGame(gameState);

}(lighterhtml));
