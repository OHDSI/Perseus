export function addSemicolon(str: string) {
  return str.slice(-1) === ';' ? str : `${str};`
}
