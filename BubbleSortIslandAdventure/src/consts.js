export const FLOOR_SIZE = 5;
export const ANIMATION_DURATION = 2000;
export const ACTIONS = {
  PREVIEW_ISLAND: 'PREVIEW_ISLAND',
  DESTROY_ISLAND: 'DESTROY_ISLAND',
  SWAP_ISLANDS: 'SWAP_ISLANDS',
  NEXT_STORY: 'NEXT_STORY',
  NEXT_LEVEL: 'NEXT_LEVEL',
  GAME_OVER: 'GAME_OVER',
};

//
// Island sectors and offsets used in the explode/restore animations
export const SELECTOR_ISLANDS = [{x:200, y:108}, {x:154, y:31}, {x:108, y:-46}, {x:62, y:-123}, {x:16, y:-200}].map((start, index) => {
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
export const STORY = [
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
export const LEVELS = [{
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
    {x: 1, y: 0, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 0, spritesheet: 'img-visitor', sprite: 0},
    {x: 3, y: 0, spritesheet: 'img-water', sprite: 5},
    {x: 4, y: 0, spritesheet: 'img-water', sprite: 3},

    {x: 0, y: 1, spritesheet: 'img-water', sprite: 1},
    {x: 1, y: 1, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 1, spritesheet: 'img-visitor', sprite: 0},
    {x: 3, y: 1, spritesheet: 'img-water', sprite: 0},
    {x: 4, y: 1, spritesheet: 'img-water', sprite: 1},

    {x: 0, y: 2, spritesheet: 'img-water', sprite: 4},
    {x: 1, y: 2, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 2, spritesheet: 'img-visitor', sprite: 0},
    {x: 3, y: 2, spritesheet: 'img-water', sprite: 2},
    {x: 4, y: 2, spritesheet: 'img-water', sprite: 4},

    {x: 0, y: 3, spritesheet: 'img-visitor', sprite: 0},
    {x: 1, y: 3, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 3, spritesheet: 'img-visitor', sprite: 0},
    {x: 3, y: 3, spritesheet: 'img-visitor', sprite: 0},
    {x: 4, y: 3, spritesheet: 'img-visitor', sprite: 0},

    {x: 0, y: 4, spritesheet: 'img-visitor', sprite: 0},
    {x: 1, y: 4, spritesheet: 'img-visitor', sprite: 0},
    {x: 2, y: 4, spritesheet: 'img-visitor', sprite: 0},
    {x: 3, y: 4, spritesheet: 'img-visitor', sprite: 0},
    {x: 4, y: 4, spritesheet: 'img-visitor', sprite: 0},
  ],
}];
