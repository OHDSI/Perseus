export const ON_BOARDING_META = [
  {
    key: 'tour-toolbar',
    title: 'Repeat',
    content: 'training anytime by clicking on question mark',
    action: {
      key: 'close',
      title: 'Got it!'
    },
    bullets: [1, 2, 3] // TODO: pass links to other on-boarding steps
  },
  {
    key: 'sql-editor',
    title: 'Ctrl + space',
    content: 'Press hot key to open autocomplete in SQL editor',
    action: {
      title: 'Got it!',
      key: 'close'
    },
    bullets: []
  }
];
