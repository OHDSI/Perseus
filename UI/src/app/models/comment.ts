export interface IComment {
  id: number;
  date: Date;
  hasBeenEdited: boolean;
  active: boolean;
  text: string;

  updateDate(): void;
  setAsEdited(): void;
  newValue(value: string): void;
}

export class Comment implements IComment {
  id: number;
  date: Date;
  hasBeenEdited: boolean;
  active: boolean;
  text: string;

  constructor(
    text: string
  ) {
    this.id = Math.floor(Math.random() * 1000000);
    this.date = new Date(Date.now());
    this.hasBeenEdited = false;
    this.active = false;
    this.text = text;
  }

  updateDate() {
    this.date = new Date(Date.now());
  }

  setAsEdited() {
    this.hasBeenEdited = true;
  }

  newValue(value: string) {
    this.text = value;
  }

}
