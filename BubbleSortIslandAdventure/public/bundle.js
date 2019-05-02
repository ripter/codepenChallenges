(function (lighterhtml) {
  'use strict';

  const FLOOR_SIZE = 5;
  const ANIMATION_DURATION = 2000;
  const ACTIONS = {
    PREVIEW_ISLAND: 'PREVIEW_ISLAND',
    DESTROY_ISLAND: 'DESTROY_ISLAND',
    SWAP_ISLANDS: 'SWAP_ISLANDS',
    NEXT_STORY: 'NEXT_STORY',
    NEXT_LEVEL: 'NEXT_LEVEL',
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
  // Story!
  const STORY = [
    //
    // Level 0
    //
    {
      title: 'Islander Sue:',
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
      title: 'Islander Sue:',
      side: 'good',
      paragraphs: [
        'You did it! 🤩🥳',
        'You are amazing at this! I bet you could fix all the islands!',
      ],
      next: {
        label: 'Thank you!',
        action: ACTIONS.NEXT_STORY,
      },
    },{
      title: 'Trouble Maker:',
      side: 'evil',
      paragraphs: [
        'Oh you are sooooo smart are you? 👿',
        'Let\'s see you handle this island! 😈',
      ],
      next: {
        label: 'Bring it!',
        action: ACTIONS.NEXT_LEVEL,
      },
    },
    //
    // Level 1
    //
    {
      title: 'Islander Roy:',
      side: 'good',
      paragraphs: [
        'Oh no! the Trouble Maker is back! 😱',
        'Please leave me and my island alone!',
      ],
      next: {
        label: 'I am here to help!',
        action: ACTIONS.PREVIEW_ISLAND,
      },
    },{
      title: 'Trouble Maker:',
      side: 'evil',
      paragraphs: [
        'Watch as I destroy this mediocre island!',
        'Bubble sort everything back into place, if you can!',
      ],
      next: {
        label: 'I\'m on it!',
        action: ACTIONS.DESTROY_ISLAND,
      },
    }, {
      title: 'Islander Roy:',
      side: 'good',
      paragraphs: [
        'Wow, you are incredible!',
        'Are you sure you are even human?',
      ],
      next: {
        label: 'Glad I could help!',
        action: ACTIONS.NEXT_STORY,
      },
    },{
      title: 'Trouble Maker:',
      side: 'evil',
      paragraphs: [
        'How dare you? 😡',
        'Who do you think you are?',
        'Let\'s see you handle this island! 😈',
      ],
      next: {
        label: 'Stop destroying people\'s islands!',
        action: ACTIONS.NEXT_LEVEL,
      },
    },
    //
    // Level 2
    //
    {
      title: 'Islander Jill:',
      side: 'good',
      paragraphs: [
        'Welcome, both of you. 🙂',
        'I have heard about your skill from Sue and Roy',
      ],
      next: {
        label: 'You have?',
        action: ACTIONS.PREVIEW_ISLAND,
      },
    },{
      title: 'Trouble Maker:',
      side: 'evil',
      paragraphs: [
        'Watch as I destroy this amazing island!',
        'Bubble sort everything back into place, if you can!',
      ],
      next: {
        label: 'I\'m on it!',
        action: ACTIONS.DESTROY_ISLAND,
      },
    }, {
      title: 'Islander Jill:',
      side: 'good',
      paragraphs: [
        'You really are as good as they said.',
        'Thank you for restoring the islands.',
        'I hope you have enjoyed playing my little game.',
      ],
      next: {
        label: 'It was fun!',
        action: ACTIONS.GAME_OVER,
      },
    },
  ];

  //
  // Define the levels
  const LEVELS = [{
    mobs: [
      {x: 0, y: 2, spritesheet: 'img-number', sprite: 1},
      {x: 1, y: 2, spritesheet: 'img-number', sprite: 2},
      {x: 2, y: 2, spritesheet: 'img-number', sprite: 3},
      {x: 3, y: 2, spritesheet: 'img-number', sprite: 4},
      {x: 4, y: 2, spritesheet: 'img-number', sprite: 5},
      {x: 0, y: 0, spritesheet: 'img-golem-1', sprite: 'forward'},
    ],
  }, {
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
      {x: 0, y: 0, spritesheet: 'img-water', sprite: 3},
      {x: 1, y: 0, spritesheet: 'img-path', sprite: 5},
      {x: 2, y: 0, spritesheet: 'img-visitor', sprite: 1},
      {x: 3, y: 0, spritesheet: 'img-water', sprite: 5},
      {x: 4, y: 0, spritesheet: 'img-path', sprite: 2},

      {x: 0, y: 1, spritesheet: 'img-water', sprite: 1},
      {x: 1, y: 1, spritesheet: 'img-path', sprite: 0},
      {x: 2, y: 1, spritesheet: 'img-path', sprite: 1},
      {x: 3, y: 1, spritesheet: 'img-path', sprite: 1},
      {x: 4, y: 1, spritesheet: 'img-path', sprite: 4},

      {x: 0, y: 2, spritesheet: 'img-water', sprite: 4},
      {x: 1, y: 2, spritesheet: 'img-path', sprite: 2},
      {x: 2, y: 2, spritesheet: 'img-visitor', sprite: 0},
      {x: 3, y: 2, spritesheet: 'img-water', sprite: 2},
      {x: 4, y: 2, spritesheet: 'img-water', sprite: 4},

      {x: 0, y: 3, spritesheet: 'img-path', sprite: 3},
      {x: 1, y: 3, spritesheet: 'img-path', sprite: 4},
      {x: 2, y: 3, spritesheet: 'img-visitor', sprite: 0},
      {x: 3, y: 3, spritesheet: 'img-visitor', sprite: 0},
      {x: 4, y: 3, spritesheet: 'img-visitor', sprite: 0},

      {x: 0, y: 4, spritesheet: 'img-path', sprite: 2},
      {x: 1, y: 4, spritesheet: 'img-visitor', sprite: 0},
      {x: 2, y: 4, spritesheet: 'img-visitor', sprite: 0},
      {x: 3, y: 4, spritesheet: 'img-visitor', sprite: 0},
      {x: 4, y: 4, spritesheet: 'img-visitor', sprite: 0},
    ],
  }];

  /**
   * Loads the level data
   * Turns mobs into visitors, islands, and goal
   * @return {Promise}
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

  function animateRestoreIsland() {
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

  function animateOpenDialog() {
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION,
      translateX: ['-80vw', 0],
    }).finished;
  }

  /**
   * Combines the grid into a single island and opens the dialog.
   * @return {Promise}
   */
  const startGame = wrapForAnimation((/*state*/) => {
    return Promise.all([
      animateRestoreIsland(),
      animateOpenDialog(),
    ]);
  });

  function animateCloseDialog() {
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION/2,
      translateX: [0, '-80vw'],
    }).finished;
  }

  /**
   * Closes the dialog
   * @return {Promise}
   */
  const previewIsland = wrapForAnimation((/*state*/) => {
    return Promise.all([
      animateCloseDialog(),
    ]);
  });

  function animateDestoryIsland() {
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

  /**
   * "Destory" the island by randomizing the visitors and breaking it into a grid.
   * @return {Promise}
   */
  const destroyIsland = wrapForAnimation((state) => {
    const { visitors } = state;
    state.set({
      visitors: randomizeVisitors(visitors),
    });
    return Promise.all([
      animateCloseDialog(),
      animateDestoryIsland(),
    ]);
  });

  /**
   * Randomizes the visitors along the y-axis only.
   */
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

  /**
   * Restore the grid back into one island.
   * Advance the story and open the dialog.
   * @return {Promise}
   */
  const winGame = wrapForAnimation((state) => {
    const { storyIndex } = state;
    state.set({
      storyIndex: storyIndex + 1,
    });
    return Promise.all([
      animateRestoreIsland(),
      animateOpenDialog(),
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

  /**
   * Swaps the island at bottomIndex with the island above it.
   * aka, a single step in a bubble sort
   * @return {Promise}
   */
  const bubbleIsland = wrapForAnimation((state, bottomIndex) => {
    const { goal, visitors } = state;
    const topIndex = state.getPairedIndex(bottomIndex);
    // Skip invalid pairs (like the top islands)
    if (topIndex < 0) { return Promise.resolve(state); }

    return Promise.all([
      animateSwapIslands(bottomIndex, topIndex),
    ]).then(() => {
      // swap mutates the islands array
      swap(state, bottomIndex, topIndex);
      // calling set just to trigger a re-render.
      // swap mutated the islands array in place.
      state.set({});

      if (didWin(goal, visitors)) {
        winGame(state);
      }
    });
  });

  /**
   * Swaps two islands and their visitors in place.
   */
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

  /**
   * Returns true when visitors are in the goal positions.
   */
  function didWin(goal, visitors) {
    return goal.every(({x, y, spritesheet, sprite}) => {
      return visitors.find((visitor) => {
        return visitor.x === x
        && visitor.y === y
        && visitor.spritesheet === spritesheet
        && visitor.sprite === sprite;
      });
    });
  }

  /**
   * Advances the storyIndex and opens the dialog.
   * @return {Promise}
   */
  const nextStoryDialog = wrapForAnimation((state) => {
    const { storyIndex } = state;
    // Update the state
    state.set({
      storyIndex:  storyIndex + 1,
    });
    // Run the animation
    return Promise.all([
      animateOpenDialog(),
    ]);
  });

  /**
   * Restore the grid back into one island.
   * Advance the story and open the dialog.
   * @return {Promise}
   */
  const nextLevel = wrapForAnimation((state) => {
    const level = state.level + 1;
    const storyIndex = state.storyIndex + 1;

    return Promise.all([
      animateCloseDialog(),
      loadLevel(state, LEVELS[level]),
    ]).then(() => {
      state.set({
        level,
        storyIndex,
      });
      return startGame(state);
      // return animateOpenDialog();
    });
  });

  /**
   * Closes the dialog
   * @return {Promise}
   */
  const gameOver =(state) => {
    // Mark it as animating, FOREVER!!!!
    markStartAnimation(state);
    return Promise.all([
      animateCloseDialog(),
    ]);
  };

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
    goal: [],
    isAnimating: false,
    islands: [],
    storyIndex: 0,
    level: 2,
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
    // Updates the state and triggers a change aka re-render.
    set(newState) {
      // Merge in the new state.
      Object.assign(this, newState);
      // Trigger change, we don't need to check if it really changed because lighterhtml is awesome!
      this.onChange(this);
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
        return bubbleIsland(state, bottomIndex);
      case ACTIONS.NEXT_STORY:
        return nextStoryDialog(state);
      case ACTIONS.NEXT_LEVEL:
        return nextLevel(state);
      case ACTIONS.GAME_OVER:
        return gameOver(state);
      default:
        // console.warn('unknown action', nextAction);
    }

    return state;
  }


  //
  // Main
  // Update the CSS vars to match the JS CONSTS
  document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
  document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

  // Re-render on state change
  gameState.onChange = renderGame;
  // Load and start the level
  loadLevel(gameState, LEVELS[gameState.level]);
  renderGame(gameState);
  startGame(gameState);

}(lighterhtml));
