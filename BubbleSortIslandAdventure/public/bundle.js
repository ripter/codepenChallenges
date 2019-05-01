(function (lighterhtml) {
  'use strict';

  const FLOOR_SIZE = 5;
  const ANIMATION_DURATION = 2000;
  const ACTIONS = {
    PREVIEW_ISLAND: 'PREVIEW_ISLAND',
    HIDE_UNTIL_CLICK: 'HIDE_UNTIL_CLICK',
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
        action: ACTIONS.START_GAME,
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

  function markStartAnimation$1(state) {
    state.isAnimating = true;
    //TODO: better spot to touching the DOM
    document.body.classList.add('is-animating');
    return state;
  }

  function markEndAnimation$1(state) {
    state.isAnimating = false;
    //TODO: better spot to touching the DOM
    document.body.classList.remove('is-animating');
    return state;
  }

  function animationRestoreIsland() {
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

  function startGame(state) {
    markStartAnimation$1(state);
    return Promise.all([
      animationRestoreIsland(),
      openDialog(),
    ]).then(() => {
      markEndAnimation$1(state);
    });
  }

  function closeDialog() {
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION/2,
      translateX: [0, '-80vw'],
    }).finished;
  }

  function previewIsland(state) {
    markStartAnimation$1(state);
    return Promise.all([
      closeDialog(),
    ]).then(() => {
      // advance to the next story
      // state.storyIndex += 1;
      markEndAnimation$1(state);
    });
  }

  function nextStoryDialog(state) {
    const { storyIndex } = state;

    // Update the state
    state.set({
      storyIndex:  storyIndex + 1,
    });
    // Run the animation
    return Promise.all([
      openDialog(),
    ]);
  }

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
  style=${''}
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

  function indexToPoint(index) {
    return {
      x: 0| index % FLOOR_SIZE,
      y: 0| index / FLOOR_SIZE,
    };
  }

  function pointToIndex({x, y}) {
    return x + (y * FLOOR_SIZE);
  }

  //
  // Game State
  const gameState = window.gameState = {
    isDialogOpen: false,
    didWin: true,
    storyIndex: 0,
    swapIndexes: [],
    islands: [],
    goal: [],
    visitors: [],
    //
    // Handle's events, updates state, and triggers re-render
    handleEvent(event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      // console.log('event', event.type, event);
      handleClick(this, event);
      updateIslandPositions(this, event);
      updateDidWin(this, event);
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
    }
  };


  //
  // updates the position of islands in the state.islands array.
  // Swaps the two islands in state.swapIndexes.
  function updateIslandPositions(state) {
    const { swapIndexes, islands } = state;
    if (swapIndexes.length !== 2) { return state; }
    const bottomIsland = islands[swapIndexes[0]];
    const topIsland = islands[swapIndexes[1]];

    // Swap the islands!
    islands.splice(swapIndexes[1], 1, bottomIsland);
    islands.splice(swapIndexes[0], 1, topIsland);
    // Swap the Visitors x,y positions
    const bottomVisitor = state.getVisitorAt(swapIndexes[0]);
    const topVisitor = state.getVisitorAt(swapIndexes[1]);
    if (bottomVisitor) {
      Object.assign(bottomVisitor, indexToPoint(swapIndexes[1]));
    }
    if (topVisitor) {
      Object.assign(topVisitor, indexToPoint(swapIndexes[0]));
    }
    // clear the indexes
    swapIndexes.length = 0;
    return state;
  }
  //
  // Check if the user won!
  function updateDidWin(state) {
    const { goal, visitors, didWin } = state;
    state.didWin = goal.every(({x, y, spritesheet, sprite}) => {
      return visitors.find((visitor) => {
        return visitor.x === x
          && visitor.y === y
          && visitor.spritesheet === spritesheet
          && visitor.sprite === sprite;
      });
    });

    // If we are switching to win for the first time.
    if (!didWin && state.didWin) {
      // ugly hack, we need to wait until after render to trigger the animation.
      setTimeout(() => {
        animationWin(state);
      });
    }
    return state;
  }

  function handleClick(state, event) {
    const { lastAction, visitors, isDialogOpen, isAnimating } = state;
    const { currentTarget, type } = event;
    // Only respond to clicks when not animating.
    if ('click' !== type || isAnimating) { return state; }
    const nextAction = currentTarget.getAttribute('action');

    state.lastAction = nextAction;

    // If we where previewing the island
    if (lastAction === ACTIONS.PREVIEW_ISLAND) {
      return nextStoryDialog(state).then(() => {
        console.log('nextStoryDialog complete');
      });
    }

    console.log('nextAction', nextAction);
    if (nextAction === ACTIONS.PREVIEW_ISLAND) {
      console.log('show island preview');
      return previewIsland(state).then(() => {
        console.log('previewIsland complete');
      });
    }

    // // If we are hiding until a click happend
    // if (lastAction === ACTIONS.HIDE_UNTIL_CLICK
    //   && nextAction !== ACTIONS.HIDE_UNTIL_CLICK) {
    //   // Show the next dialog
    //   animationShowDialog(state).then(() => {
    //     state.lastAction = ACTIONS.WAIT;
    //     // re-render with the new state.
    //     state.triggerRender();
    //   });
    //   return state;
    // }


    if(nextAction === ACTIONS.HIDE_UNTIL_CLICK) {
      // Animate closed and then update the state.
      animationHideDialog(state).then(() => {
        // re-render with the new state.
        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.START_GAME) {
      Promise.all([
        animationHideDialog(state),
        animationExplode(state),
      ]).then(() => {
        state.visitors = randomizeVisitors(visitors);
        // re-render with the new state.
        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.GAME_OVER) {
      // just close the dialog so the user can see the island.
      animationHideDialog(state);
    }

    if (nextAction === ACTIONS.SWAP_ISLANDS && !isDialogOpen) {
      const bottomIndex = parseInt(currentTarget.dataset.idx, 10);
      const topIndex = state.getPairedIndex(bottomIndex);
      // Skip invalid pairs (like the top islands)
      if (topIndex < 0) { return state; }
      // Start the animation.
      animationSwap(state, [bottomIndex, topIndex]).then(() => {
        state.swapIndexes = [bottomIndex, topIndex];
        // re-render with the new state.
        state.triggerRender();
      });
    }

    return state;
  }


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



  //
  // Animations
  // Island Swap
  function animationSwap(state, [bottomIndex, topIndex]) {
    markStartAnimation(state);
    return Promise.all([
      anime({
        targets: `.island:nth-child(${topIndex+1})`,
        delay: 0,
        duration: ANIMATION_DURATION,
        easing: 'easeOutExpo',
        keyframes: [
          {translateX: '0%', translateY: '0%', 'z-index': 110},
          {translateX: '50%', translateY: '50%'},
          {translateX: '0%', translateY: '100%', 'z-index': 100},
        ],
      }).finished,
      anime({
        targets: `.island:nth-child(${bottomIndex+1})`,
        duration: ANIMATION_DURATION,
        easing: 'easeOutCirc',
        delay: 0,
        keyframes: [
          {translateX: '0%', translateY: '0%', 'z-index': 110},
          {translateX: '-50%', translateY: '-50%'},
          {translateX: '0%', translateY: '-100%', 'z-index': 100},
        ],
      }).finished,
    ]).then(() => {
      // remove the styles anime added for the animation. State will have the island in the new position on re-render.
      document.querySelectorAll(`.island:nth-child(${topIndex+1}), .island:nth-child(${bottomIndex+1}`).forEach(elm => elm.removeAttribute('style'));
      markEndAnimation(state);
    });
  }
  //
  // explode the world into islands!
  function animationExplode(state) {
    markStartAnimation(state);

    const promiseList = [{x:200, y:108}, {x:154, y:31}, {x:108, y:-46}, {x:62, y:-123}, {x:16, y:-200}].map((start, index) => {
      const targets = Array(FLOOR_SIZE)
        .fill()
        .map((_, i) => index*FLOOR_SIZE+i)
        .reduce((result, num) => `${result}, .island:nth-child(${num+1})`, '').substring(1);
      return anime({
        targets,
        duration: ANIMATION_DURATION,
        translateX: [anime.stagger('-54%', { start: start.x }), 0],
        translateY: [anime.stagger('23%', { start: start.y }), 0],
        easing: 'easeInOutSine',
      }).finished;
    });
    return Promise.all(promiseList).then(() => {
      markEndAnimation(state);
      document.querySelectorAll('.island').forEach(resetTransforms);
    });
  }


  function animationWin(state) {
    markStartAnimation(state);
    const promiseList = [
      animationRestore(state),
      animationShowDialog(state),
    ];
    return Promise.all(promiseList).then(() => {
      markEndAnimation(state);
    });
  }



  //
  // Utils
  function resetTransforms(elm) {
    elm.style.transform = '';
    return elm;
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
  }];

  //
  // Main
  // Update the CSS vars to match the JS CONSTS
  document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
  document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE);

  // Re-render on state change
  gameState.onChange = renderGame;
  // Load and start the level
  loadLevel(gameState, levels[0]);
  renderGame(gameState);
  startGame(gameState);

}(lighterhtml));
