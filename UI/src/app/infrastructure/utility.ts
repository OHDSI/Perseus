function generateString(len: number): string {
  const length = len ? len : 10;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let token = "";
  let character = "";
  const crunch = true;
  while (token.length < length) {
    const entity1 = Math.ceil(letters.length * Math.random() * Math.random());
    const entity2 = Math.ceil(numbers.length * Math.random() * Math.random());
    let hold = letters.charAt(entity1);
    hold = entity1 % 2 === 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numbers.charAt(entity2);
    token = character;
  }

  return token;
}

export {
  generateString
}
