export const ON_BOARDING_META = [
  {
    key: 'tour-toolbar',
    title: 'Repeat',
    content: 'training anytime by clicking on question mark',
    action: {
      key: 'close',
      title: 'Got it!'
    },
    bullets: [1, 2, 3] // TODO: pass links to other onboarding steps
  },
  {
    key: 'create-view',
    title: 'Ctrl + space',
    content: 'Press hotkey to open autocomplete',
    action: {
      title: 'Got it!',
      key: 'close'
    },
    bullets: []
  }
];
