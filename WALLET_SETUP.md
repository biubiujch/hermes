# 钱包连接功能设置指南

## 功能概述

Hermes交易机器人已集成完整的钱包连接功能，支持以下功能：

- 🔗 多钱包连接（MetaMask、WalletConnect、Coinbase Wallet等）
- 💰 实时余额显示
- 🌐 多网络支持（Arbitrum、Ethereum Mainnet、Sepolia）
- 🔄 网络切换功能
- 📋 地址复制功能
- 📊 钱包状态指示器

## 设置步骤

### 1. 安装依赖

项目已包含所需的依赖包：
- `wagmi` - Web3 React hooks
- `@wagmi/connectors` - 钱包连接器
- `viem` - 以太坊客户端

### 2. 配置WalletConnect（可选）

如果要使用WalletConnect功能，需要：

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 复制项目ID
4. 在项目根目录创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. 运行项目

```bash
pnpm dev
```

## 组件说明

### WalletConnect
- 位置：`components/layout/WalletConnect.tsx`
- 功能：主要的钱包连接/断开连接组件
- 特性：下拉菜单选择钱包，连接状态显示

### WalletInfo
- 位置：`components/layout/WalletInfo.tsx`
- 功能：显示详细的钱包信息
- 特性：地址、余额、网络信息、网络切换

### WalletStatus
- 位置：`components/layout/WalletStatus.tsx`
- 功能：钱包连接状态指示器
- 特性：连接状态、网络状态显示

### useWallet Hook
- 位置：`hooks/useWallet.ts`
- 功能：提供钱包状态和操作的自定义Hook
- 特性：地址、余额、网络、连接状态等

## 支持的网络

- **Arbitrum One** (ID: 42161) - 推荐用于交易
- **Ethereum Mainnet** (ID: 1) - 主网
- **Sepolia Testnet** (ID: 11155111) - 测试网

## 支持的钱包

- MetaMask
- WalletConnect
- Coinbase Wallet
- 其他注入式钱包（如Brave Wallet、Trust Wallet等）

## 使用方法

1. 点击导航栏的"连接钱包"按钮
2. 选择你的钱包
3. 授权连接
4. 连接成功后可以看到钱包状态和详细信息

## 注意事项

- 确保浏览器支持Web3功能
- 某些钱包可能需要手动安装浏览器扩展
- 建议在Arbitrum网络上进行交易以获得更好的性能和更低的费用 