import { yes, noop } from './utility';

export class ICommandContext<T, K> {
  execute?: (arg?: T) => any;
  canExecute?: (arg?: T) => boolean;
}

export class Command<T, K> {
  execute: (arg?: T) => K = noop as any;
  canExecute: (arg?: T) => any = yes;

  constructor(context: ICommandContext<T, K> = {}) {
    Object.assign(this, context);
  }
}
