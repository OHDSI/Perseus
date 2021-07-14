export interface IComment {
  id: number;
  text: string;

  newValue(value: string): void;
}

export class Comment implements IComment {
  id: number;
  text: string;

  constructor(
    text: string
  ) {
    this.id = Math.floor(Math.random() * 1000000);
    this.text = text;
  }

  newValue(value: string) {
    this.text = value;
  }
}
