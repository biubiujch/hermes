import { Strategy, StrategyManagerStatus } from './type';

export class StrategyManager {
  static strategies: Map<string, Strategy> = new Map();
  static status: StrategyManagerStatus = 'idle';

  static addStrategy(strategy: Strategy) {
    this.strategies.set(strategy.id, strategy);
  }

  static getStrategy(id: string) {
    return this.strategies.get(id);
  }

  static getAllStrategies() {
    return Array.from(this.strategies.values());
  }
}
