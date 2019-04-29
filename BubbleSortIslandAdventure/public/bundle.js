(function (lighterhtml) {
  'use strict';

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _templateObject5() {
    var data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    var data = _taggedTemplateLiteral(["<div class=", ">\n    <form method=\"dialog\" ontransitionend=", ">\n      <p class=\"title\">", "</p>\n      ", "\n      <menu class=\"dialog-menu\">\n        <button onclick=", " action=", " class=\"btn nes-btn is-primary\">", "</button>\n      </menu>\n    </form>\n  </div>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    var data = _taggedTemplateLiteral(["<div>\n  ", "</div>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["<div class=\"visitor\"\n  spritesheet=", "\n  sprite=", ">\n</div>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["<div\n  class=\"island\"\n  data-idx=", "\n  sprite=", "\n  onclick=", "\n  action=", "\n  style=", "\n  >\n  ", "\n</div>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }
  var FLOOR_SIZE = 5;
  var ANIMATION_DURATION = 2000;
  var ACTIONS = {
    HIDE_UNTIL_CLICK: 'HIDE_UNTIL_CLICK',
    START_GAME: 'START_GAME',
    SWAP_ISLANDS: 'SWAP_ISLANDS',
    WAIT: 'WAIT',
    NEXT_PAGE: 'NEXT_PAGE',
    GAME_OVER: 'GAME_OVER'
  };
  var elCanvas = window.canvas;
  var elDialog = window.elDialog; //
  // Game State

  var state = window.state = {
    isDialogOpen: false,
    didWin: true,
    storyIndex: 0,
    swapIndexes: [],
    islands: [],
    goal: [],
    visitors: [],
    //
    // Handle's events, updates state, and triggers re-render
    handleEvent: function handleEvent(event) {
      if (event.preventDefault) {
        event.preventDefault();
      } // console.log('event', event.type, event);


      initLevel(this, event);
      handleClick(this, event);
      updateIslandPositions(this, event);
      updateDidWin(this, event); // Render the new state
      // console.log('rendering state');

      renderLevel(elCanvas, this);
      renderDialog(elDialog, this);
    },
    //
    // Returns the the index for the island above.
    // User clicks the bottom and the island swaps with the one above it.
    getPairedIndex: function getPairedIndex(index) {
      var _indexToPoint = indexToPoint(index),
          x = _indexToPoint.x,
          y = _indexToPoint.y;

      return pointToIndex({
        x: x,
        y: y - 1
      });
    },
    //
    // Returns the visitor on island at index.
    // or null if no visitor is on that island.
    getVisitorAt: function getVisitorAt(index) {
      var _indexToPoint2 = indexToPoint(index),
          x = _indexToPoint2.x,
          y = _indexToPoint2.y;

      return this.visitors.find(function (visitor) {
        return visitor.x === x && visitor.y === y;
      });
    },
    //
    // Helper to trigger a re-render.
    triggerRender: function triggerRender() {
      this.handleEvent({
        type: 'render'
      });
    }
  }; //
  // Story Phases!

  var story = window.story = [{
    title: 'Islander:',
    side: 'good',
    paragraphs: ['Oh! Hi there! I was just putting together my first island. 😁', 'It\'s not much now, but I think it has potental 🥰', 'Please, take a look around, but be careful not to poke it too hard, the dirt is still soft.'],
    next: {
      label: 'Let me take a better look',
      action: ACTIONS.HIDE_UNTIL_CLICK
    }
  }, {
    title: 'Trouble Maker:',
    side: 'evil',
    paragraphs: ['You poked me!', 'You look smart, so I\'ll poke your brain!', 'Watch as I destroy this pitiful island!', 'Bubble sort everything back into place, if you can!'],
    next: {
      label: 'I\'m on it!',
      action: ACTIONS.START_GAME
    }
  }, {
    title: 'Islander:',
    side: 'good',
    paragraphs: ['You did it! 🤩🥳', 'I knew you could do it!'],
    next: {
      label: 'Thank you!',
      action: ACTIONS.GAME_OVER
    }
  }]; //
  // Views/Render functions
  //
  //
  // An island is a sprite with optional child sprite.

  var renderIsland = function renderIsland(_ref, visitor, key) {
    var sprite = _ref.sprite;
    return lighterhtml.html(_templateObject(), key, sprite, state, ACTIONS.SWAP_ISLANDS, '', !visitor ? '' : renderVisitor(visitor));
  }; //
  // Visitor is just a sprite.


  var renderVisitor = function renderVisitor(_ref2) {
    var sprite = _ref2.sprite,
        spritesheet = _ref2.spritesheet;
    return lighterhtml.html(_templateObject2(), spritesheet, sprite);
  }; //
  // Render the level


  function renderLevel(elm, state) {
    var islands = state.islands,
        didWin = state.didWin,
        visitors = state.visitors; // Render the islands

    lighterhtml.render(elm, function () {
      return lighterhtml.html(_templateObject3(), islands.map(function (island, idx) {
        var visitor = state.getVisitorAt(idx);
        return renderIsland(island, visitor, idx);
      }));
    });
  } //
  // Dialog Box


  function renderDialog(elm, state) {
    var _this = this;

    var storyIndex = state.storyIndex;
    var _story$storyIndex = story[storyIndex],
        title = _story$storyIndex.title,
        paragraphs = _story$storyIndex.paragraphs,
        next = _story$storyIndex.next,
        side = _story$storyIndex.side;
    var classList = ['nes-dialog', 'is-rounded'];

    if ('evil' === side) {
      classList.push('is-dark');
    } else {
      classList.push('is-light');
    }

    lighterhtml.render(elm, function () {
      return lighterhtml.html(_templateObject4(), classList.join(' '), _this, title, paragraphs.map(function (txt) {
        return lighterhtml.html(_templateObject5(), txt);
      }), state, next.action, next.label);
    });
  } //
  // Actions/Game Logic
  //
  //
  // updates the position of islands in the state.islands array.
  // Swaps the two islands in state.swapIndexes.


  function updateIslandPositions(state, event) {
    var type = event.type;
    var swapIndexes = state.swapIndexes,
        islands = state.islands;

    if (swapIndexes.length !== 2) {
      return state;
    }

    var bottomIsland = islands[swapIndexes[0]];
    var topIsland = islands[swapIndexes[1]]; // Swap the islands!

    islands.splice(swapIndexes[1], 1, bottomIsland);
    islands.splice(swapIndexes[0], 1, topIsland); // Swap the Visitors x,y positions

    var bottomVisitor = state.getVisitorAt(swapIndexes[0]);
    var topVisitor = state.getVisitorAt(swapIndexes[1]);

    if (bottomVisitor) {
      Object.assign(bottomVisitor, indexToPoint(swapIndexes[1]));
    }

    if (topVisitor) {
      Object.assign(topVisitor, indexToPoint(swapIndexes[0]));
    } // clear the indexes


    swapIndexes.length = 0;
    return state;
  } //
  // Check if the user won!


  function updateDidWin(state, event) {
    var islands = state.islands,
        goal = state.goal,
        visitors = state.visitors,
        didWin = state.didWin;
    state.didWin = goal.every(function (_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          spritesheet = _ref3.spritesheet,
          sprite = _ref3.sprite;
      return visitors.find(function (visitor) {
        return visitor.x === x && visitor.y === y && visitor.spritesheet === spritesheet && visitor.sprite === sprite;
      });
    }); // If we are switching to win for the first time.

    if (!didWin && state.didWin) {
      // ugly hack, we need to wait until after render to trigger the animation.
      setTimeout(function () {
        animationWin(state);
      });
    }

    return state;
  } //
  // Loads a new level


  function initLevel(state, event) {
    var type = event.type,
        level = event.level;

    if ('initLevel' !== type) {
      return state;
    }

    var mobs = level.mobs; // Mob original position is the solution to the puzzle.

    state.goal = JSON.parse(JSON.stringify(mobs)); // Mobs become visitors that are shuffled on the y-axis

    state.visitors = JSON.parse(JSON.stringify(mobs)); // Islands use random sprites.

    state.islands = Array(FLOOR_SIZE * FLOOR_SIZE).fill().map(function () {
      return {
        spritesheet: 'island',
        sprite: 0 | Math.random() * 6
      };
    });
    return state;
  }

  function handleClick(state, event) {
    var lastAction = state.lastAction,
        visitors = state.visitors,
        isDialogOpen = state.isDialogOpen,
        isAnimating = state.isAnimating;
    var currentTarget = event.currentTarget,
        type = event.type; // Only respond to clicks when not animating.

    if ('click' !== type || isAnimating) {
      return state;
    }

    var nextAction = currentTarget.getAttribute('action'); // If we are hiding until a click happend

    if (lastAction === ACTIONS.HIDE_UNTIL_CLICK && nextAction !== ACTIONS.HIDE_UNTIL_CLICK) {
      // Show the next dialog
      animationShowDialog(state).then(function () {
        state.lastAction = ACTIONS.WAIT; // re-render with the new state.

        state.triggerRender();
      });
      return state;
    } // We switch our action to the new one.


    state.lastAction = nextAction;

    if (nextAction === ACTIONS.HIDE_UNTIL_CLICK) {
      // Animate closed and then update the state.
      animationHideDialog(state).then(function () {
        // re-render with the new state.
        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.START_GAME) {
      Promise.all([animationHideDialog(state), animationExplode(state)]).then(function () {
        state.visitors = randomizeVisitors(visitors); // re-render with the new state.

        state.triggerRender();
      });
    }

    if (nextAction === ACTIONS.GAME_OVER) {
      // just close the dialog so the user can see the island.
      animationHideDialog(state);
    }

    if (nextAction === ACTIONS.SWAP_ISLANDS && !isDialogOpen) {
      var bottomIndex = parseInt(currentTarget.dataset.idx, 10);
      var topIndex = state.getPairedIndex(bottomIndex); // Skip invalid pairs (like the top islands)

      if (topIndex < 0) {
        return state;
      } // Start the animation.


      animationSwap(state, [bottomIndex, topIndex]).then(function () {
        state.swapIndexes = [bottomIndex, topIndex]; // re-render with the new state.

        state.triggerRender();
      });
    }

    return state;
  } //
  // Randomizes the visitors along the y-axis only.


  function randomizeVisitors(visitors) {
    // Create a random list of indexes for each column.
    var randomIndexes = Array(FLOOR_SIZE).fill().map(function () {
      return Array(FLOOR_SIZE).fill().map(function (_, i) {
        return i;
      }).sort(function () {
        return 0 | Math.random() * 3 - 2;
      });
    }); // Give each visitor a new random y position from the random list.

    return visitors.map(function (visitor) {
      visitor.y = randomIndexes[visitor.x].pop();
      return visitor;
    });
  } //
  // Animations
  // Island Swap


  function animationSwap(state, _ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        bottomIndex = _ref5[0],
        topIndex = _ref5[1];

    console.log('animationSwap');
    markStartAnimation(state);
    return Promise.all([anime({
      targets: ".island:nth-child(".concat(topIndex + 1, ")"),
      delay: 0,
      duration: ANIMATION_DURATION,
      easing: 'easeOutExpo',
      keyframes: [{
        translateX: '0%',
        translateY: '0%',
        'z-index': 110
      }, {
        translateX: '50%',
        translateY: '50%'
      }, {
        translateX: '0%',
        translateY: '100%',
        'z-index': 100
      }]
    }).finished, anime({
      targets: ".island:nth-child(".concat(bottomIndex + 1, ")"),
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc',
      delay: 0,
      keyframes: [{
        translateX: '0%',
        translateY: '0%',
        'z-index': 110
      }, {
        translateX: '-50%',
        translateY: '-50%'
      }, {
        translateX: '0%',
        translateY: '-100%',
        'z-index': 100
      }]
    }).finished]).then(function () {
      // remove the styles anime added for the animation. State will have the island in the new position on re-render.
      document.querySelectorAll(".island:nth-child(".concat(topIndex + 1, "), .island:nth-child(").concat(bottomIndex + 1)).forEach(function (elm) {
        return elm.removeAttribute('style');
      });
      markEndAnimation(state);
    });
  } //
  // explode the world into islands!


  function animationExplode(state) {
    markStartAnimation(state);
    var promiseList = [{
      x: 200,
      y: 108
    }, {
      x: 154,
      y: 31
    }, {
      x: 108,
      y: -46
    }, {
      x: 62,
      y: -123
    }, {
      x: 16,
      y: -200
    }].map(function (start, index) {
      var targets = Array(FLOOR_SIZE).fill().map(function (_, i) {
        return index * FLOOR_SIZE + i;
      }).reduce(function (result, num) {
        return "".concat(result, ", .island:nth-child(").concat(num + 1, ")");
      }, '').substring(1);
      return anime({
        targets: targets,
        duration: ANIMATION_DURATION,
        translateX: [anime.stagger('-54%', {
          start: start.x
        }), 0],
        translateY: [anime.stagger('23%', {
          start: start.y
        }), 0],
        easing: 'easeInOutSine'
      }).finished;
    });
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
      document.querySelectorAll('.island').forEach(function (elm) {
        return elm.style.transform = '';
      });
    });
  } //
  // Bring all the islands back together animation


  function animationRestore(state) {
    markStartAnimation(state);
    var promiseList = [{
      x: 200,
      y: 108
    }, {
      x: 154,
      y: 31
    }, {
      x: 108,
      y: -46
    }, {
      x: 62,
      y: -123
    }, {
      x: 16,
      y: -200
    }].map(function (start, index) {
      var targets = Array(FLOOR_SIZE).fill().map(function (_, i) {
        return index * FLOOR_SIZE + i;
      }).reduce(function (result, num) {
        return "".concat(result, ", .island:nth-child(").concat(num + 1, ")");
      }, '').substring(1);
      return anime({
        targets: targets,
        duration: ANIMATION_DURATION,
        translateX: [0, anime.stagger('-54%', {
          start: start.x
        })],
        translateY: [0, anime.stagger('23%', {
          start: start.y
        })],
        easing: 'easeInOutSine'
      }).finished;
    });
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
    });
  }

  function animationWin(state) {
    markStartAnimation(state);
    var promiseList = [animationRestore(state), animationShowDialog(state)];
    return Promise.all(promiseList).then(function () {
      markEndAnimation(state);
    });
  } //
  // Dialog Animations


  function animationHideDialog() {
    markStartAnimation(state);
    console.log('animationHideDialog START');
    return anime({
      targets: '#elDialog',
      easing: 'easeInQuart',
      duration: ANIMATION_DURATION / 2,
      translateX: [0, '-80vw']
    }).finished.then(function () {
      console.log('animationHideDialog END');
      markEndAnimation(state);
      state.isDialogOpen = false;
      state.storyIndex += 1;
    });
  }

  function animationShowDialog() {
    markStartAnimation(state);
    state.isDialogOpen = true;
    return anime({
      targets: '#elDialog',
      duration: ANIMATION_DURATION,
      easing: 'easeInQuart',
      translateX: ['-80vw', 0]
    }).finished.then(function () {
      markEndAnimation(state);
    });
  } //
  // Utils


  function indexToPoint(index) {
    return {
      x: 0 | index % FLOOR_SIZE,
      y: 0 | index / FLOOR_SIZE
    };
  }

  function pointToIndex(_ref6) {
    var x = _ref6.x,
        y = _ref6.y;
    return x + y * FLOOR_SIZE;
  }

  function markStartAnimation(state) {
    state.isAnimating = true;
    document.body.classList.add('is-animating');
  }

  function markEndAnimation(state) {
    state.isAnimating = false;
    document.body.classList.remove('is-animating');
  } //
  // Define some levels


  var levels = [{
    mobs: [{
      x: 4,
      y: 0,
      spritesheet: 'img-water',
      sprite: 3
    }, {
      x: 3,
      y: 0,
      spritesheet: 'img-water',
      sprite: 5
    }, {
      x: 4,
      y: 1,
      spritesheet: 'img-water',
      sprite: 1
    }, {
      x: 3,
      y: 1,
      spritesheet: 'img-water',
      sprite: 0
    }, {
      x: 4,
      y: 2,
      spritesheet: 'img-water',
      sprite: 4
    }, {
      x: 3,
      y: 2,
      spritesheet: 'img-water',
      sprite: 2
    }, {
      x: 0,
      y: 3,
      spritesheet: 'img-visitor',
      sprite: 0
    }, {
      x: 2,
      y: 0,
      spritesheet: 'img-visitor',
      sprite: 1
    }, {
      x: 1,
      y: 2,
      spritesheet: 'img-golem-1',
      sprite: 'forward'
    }]
  }]; //
  // Main
  // Update the CSS vars to match the JS CONSTS

  document.body.style.setProperty('--grid--total-columns', FLOOR_SIZE);
  document.body.style.setProperty('--grid--total-rows', FLOOR_SIZE); // Trigger loading the frist level

  state.handleEvent({
    type: 'initLevel',
    level: levels[0]
  });
  Promise.all([animationRestore(state), animationShowDialog(state)]).then(function () {
    state.triggerRender();
  });

}(lighterhtml));
//# sourceMappingURL=bundle.js.map
