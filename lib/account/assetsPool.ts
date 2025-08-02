export class AssetsPool {
  private pool: Map<string, number> = new Map();

  get totalAssets() {
    return this.totalAssets;
  }

  set totalAssets(value: number) {
    this.totalAssets = value;
  }

  assignAsset(amount: number) {
    // 调用合约，分配资产
  }

  getPool() {
    return this.pool;
  }
}
