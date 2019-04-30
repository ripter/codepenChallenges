export const FLOOR_SIZE = 5;
export const ANIMATION_DURATION = 2000;
export const ACTIONS = {
  HIDE_UNTIL_CLICK: 'HIDE_UNTIL_CLICK',
  START_GAME: 'START_GAME',
  SWAP_ISLANDS: 'SWAP_ISLANDS',
  WAIT: 'WAIT',
  NEXT_PAGE: 'NEXT_PAGE',
  GAME_OVER: 'GAME_OVER',
};

//
// Story Phases!
export const STORY = [
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
      action:  ACTIONS.HIDE_UNTIL_CLICK,
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
