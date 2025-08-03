import { Strategy } from './type';

export class BaseStrategy implements Strategy {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  async execute() {}
}
