export const FLOOR_SIZE = 5;
export const ANIMATION_DURATION = 2000;
export const ACTIONS = {
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
