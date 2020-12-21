// tslint:disable-next-line:max-line-length
const sqlKeyWordsAsString = 'alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit';

export const sqlKeyWords = sqlKeyWordsAsString
  .toLowerCase()
  .split(' ');

export const singleQuote = '\'';
export const doubleQuote = '"';
