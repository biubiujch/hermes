export type StrategyManagerStatus = 'idle' | 'running' | 'paused';

export interface Strategy {
  id: string;
  execute: () => Promise<void>;
}
