# Hermes 资金池管理功能

## 概述

Hermes 资金池管理功能提供了完整的资金池管理解决方案，包括网络管理、余额查询、存款提款等核心功能。该功能基于 Next.js 构建，通过调用本地9999端口提供的服务来实现所有功能。

## 功能特性

### 🏦 资金池管理
- **多网络支持**: 支持 Arbitrum、Arbitrum Sepolia 等网络
- **余额查询**: 实时查询资金池和用户余额
- **存款提款**: 安全的存款和提款操作
- **配置管理**: 灵活的资金池参数配置

### 🔗 网络管理
- **网络状态监控**: 实时监控网络连接状态
- **区块信息**: 显示当前区块高度
- **服务连接**: 通过9999端口服务获取数据

### 💰 资产操作
- **最小存款限制**: 防止小额无效交易
- **手续费管理**: 透明的提款手续费
- **安全验证**: 私钥验证和交易签名

## 快速开始

### 1. 启动后端服务

确保9999端口的后端服务正在运行。如果没有运行，请先启动后端服务。

### 2. 启动前端项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 3. 访问资金池管理页面

打开浏览器访问: `http://localhost:3000/asset-pool`

### 4. 配置网络

在页面中选择要操作的网络:
- **Arbitrum Sepolia**: 测试网络，适合开发和测试
- **Arbitrum**: 主网络，用于生产环境

## API 文档

### 基础信息
- **前端URL**: `http://localhost:3000`
- **后端服务URL**: `http://localhost:9999`
- **数据格式**: JSON
- **认证方式**: 暂无（后续可添加JWT认证）

### 网络管理 API

#### 获取支持的网络列表
```http
GET /api/asset-pool/networks
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "name": "arbitrumTestnet",
      "chainId": 421614,
      "rpcUrl": "https://sepolia-rollup.arbitrum.io/rpc",
      "explorerUrl": "https://sepolia.arbiscan.io"
    }
  ]
}
```

#### 获取网络状态
```http
GET /api/asset-pool/{network}/status
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "networkName": "arbitrumTestnet",
    "chainId": "421614",
    "blockNumber": "12345678",
    "connected": true
  }
}
```

### 资金池配置 API

#### 获取资金池配置
```http
GET /api/asset-pool/{network}/config
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "feeCollector": "0x1234567890123456789012345678901234567890",
    "minDeposit": "0.01",
    "maxPoolSize": "1000.0",
    "feeRate": "50",
    "feeRatePercent": "0.50%",
    "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "network": "arbitrumTestnet"
  }
}
```

### 余额查询 API

#### 获取资金池余额
```http
GET /api/asset-pool/{network}/balance?token={token}
```

#### 获取用户余额
```http
GET /api/asset-pool/{network}/user/{address}/balance?token={token}
```

#### 获取账户ETH余额
```http
GET /api/asset-pool/{network}/balance/{address}
```

### 资金操作 API

#### 用户存款
```http
POST /api/asset-pool/{network}/deposit
Content-Type: application/json

{
  "user": "0x1234567890123456789012345678901234567890",
  "token": "0x0000000000000000000000000000000000000000",
  "amount": "1.5",
  "privateKey": "your_private_key_here"
}
```

#### 用户提款
```http
POST /api/asset-pool/{network}/withdraw
Content-Type: application/json

{
  "user": "0x1234567890123456789012345678901234567890",
  "token": "0x0000000000000000000000000000000000000000",
  "amount": "0.5",
  "privateKey": "your_private_key_here"
}
```

### 代币管理 API

#### 检查代币支持状态
```http
GET /api/asset-pool/{network}/token/{token}/supported
```

### 策略管理 API

#### 检查策略授权状态
```http
GET /api/asset-pool/{network}/strategy/{strategy}/authorized
```

### 交易管理 API

#### 获取交易详情
```http
GET /api/asset-pool/{network}/transaction/{txHash}
```

### 系统状态 API

#### 健康检查
```http
GET /api/health
```

#### API信息
```http
GET /api
```

## 前端组件

### 主要组件

#### AssetPoolPage
资金池管理主页面，包含所有核心功能。

**功能:**
- 网络选择和状态显示
- 资金池配置信息
- 用户信息管理
- 存款提款操作
- 余额实时显示

#### useAssetPool Hook
自定义 React Hook，管理资金池相关状态和操作。

**特性:**
- 状态管理
- API 调用封装
- 错误处理
- 数据刷新

### 使用示例

```tsx
import { useAssetPool } from '@/hooks/useAssetPool';

function MyComponent() {
  const {
    networks,
    selectedNetwork,
    poolBalance,
    userAddress,
    deposit,
    withdraw,
    loading,
    error
  } = useAssetPool();

  const handleDeposit = async () => {
    const result = await deposit(selectedNetwork, userAddress, "1.0", privateKey);
    if (result) {
      console.log('存款成功:', result.txHash);
    }
  };

  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
}
```

## 配置说明

### 服务配置

在 `lib/account/assetsPool.ts` 中配置后端服务URL:

```typescript
const assetsPool = new AssetsPool({
  localServiceUrl: 'http://localhost:9999'
});
```

### 网络配置

网络配置由9999端口的后端服务提供，包括:
- 支持的区块链网络
- 网络状态信息
- 资金池配置参数

### 资金池配置

资金池配置也由后端服务提供，包括:
- 手续费收集地址
- 最小存款金额
- 最大资金池规模
- 手续费率
- 合约地址

## 安全注意事项

### ⚠️ 重要提醒

1. **私钥安全**: 
   - 在生产环境中，私钥应该通过安全的方式传递
   - 不要在客户端代码中硬编码私钥
   - 考虑使用钱包连接或硬件钱包

2. **网络配置**:
   - 确保在调用API前，目标网络的合约已经正确部署
   - 验证RPC端点的可用性和安全性

3. **Gas费用**:
   - 所有链上操作都需要支付gas费用
   - 确保账户有足够的ETH支付gas费用

4. **手续费**:
   - 提款操作会收取0.5%的手续费
   - 最小存款金额为0.01 ETH
   - 单个代币的最大资金池规模为1000 ETH

## 开发指南

### 添加新网络

1. 在9999端口的后端服务中添加新网络配置
2. 确保后端服务支持新网络的API端点
3. 前端会自动获取新网络信息

### 扩展功能

1. **添加新代币支持**:
   - 在后端服务中添加新代币支持
   - 更新代币相关的API端点

2. **实现实际合约交互**:
   - 在后端服务中实现真实的合约调用
   - 前端通过API调用后端服务

3. **添加更多安全特性**:
   - 实现JWT认证
   - 添加请求频率限制
   - 实现交易签名验证

## 故障排除

### 常见问题

1. **网络连接失败**:
   - 检查RPC端点是否可用
   - 验证网络配置是否正确
   - 确认网络是否支持

2. **交易失败**:
   - 检查账户余额是否充足
   - 验证私钥是否正确
   - 确认gas费用设置

3. **API调用错误**:
   - 检查API端点路径
   - 验证请求参数格式
   - 查看服务器日志

### 调试模式

启用调试模式查看详细日志:

```typescript
// 在开发环境中启用详细日志
if (process.env.NODE_ENV === 'development') {
  console.log('Debug mode enabled');
}
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，请通过以下方式联系:

- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**注意**: 这是一个演示项目，生产环境使用前请进行充分的安全审计和测试。 