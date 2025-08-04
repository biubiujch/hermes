'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Chip } from '@heroui/react';
import { 
  BanknotesIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  GlobeAltIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAssetPool } from '@/hooks/useAssetPool';

export default function AssetPoolPage() {
  const {
    networks,
    selectedNetwork,
    networkStatus,
    poolConfig,
    poolBalance,
    userAddress,
    userBalance,
    accountBalance,
    loading,
    error,
    setSelectedNetwork,
    setUserAddress,
    deposit,
    withdraw,
    clearError
  } = useAssetPool();

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);



  // 存款操作
  const handleDeposit = async () => {
    if (!userAddress || !depositAmount || !privateKey) {
      setMessage({ type: 'error', text: '请填写所有必需字段' });
      return;
    }

    const result = await deposit(selectedNetwork, userAddress, depositAmount, privateKey);
    if (result) {
      setMessage({ type: 'success', text: `存款成功！交易哈希: ${result.txHash}` });
      setDepositAmount('');
    } else {
      setMessage({ type: 'error', text: error || '存款失败' });
    }
  };

  // 提款操作
  const handleWithdraw = async () => {
    if (!userAddress || !withdrawAmount || !privateKey) {
      setMessage({ type: 'error', text: '请填写所有必需字段' });
      return;
    }

    const result = await withdraw(selectedNetwork, userAddress, withdrawAmount, privateKey);
    if (result) {
      setMessage({ type: 'success', text: `提款成功！交易哈希: ${result.txHash}` });
      setWithdrawAmount('');
    } else {
      setMessage({ type: 'error', text: error || '提款失败' });
    }
  };



  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">资金池管理</h1>
        <p className="text-gray-600">管理您的资金池资产，进行存款和提款操作</p>
      </div>

      {/* 消息提示 */}
      {(message || error) && (
        <div className={`mb-6 p-4 rounded-lg ${
          (message?.type === 'success' || !error) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message?.text || error}
          {error && (
            <button 
              onClick={clearError}
              className="ml-2 text-sm underline hover:no-underline"
            >
              清除
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧面板 */}
        <div className="space-y-6">
          {/* 网络选择 */}
          <Card>
            <CardHeader className="flex gap-3">
              <GlobeAltIcon className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-md">网络选择</p>
                <p className="text-small text-default-500">选择要操作的区块链网络</p>
              </div>
            </CardHeader>
            <CardBody>
              <Select
                selectedKeys={[selectedNetwork]}
                onSelectionChange={(keys) => setSelectedNetwork(Array.from(keys)[0] as string)}
                label="选择网络"
              >
                {networks.map((network) => (
                  <SelectItem key={network.name}>
                    {network.name} (Chain ID: {network.chainId})
                  </SelectItem>
                ))}
              </Select>
              
              {networkStatus && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">连接状态:</span>
                    <Chip
                      color={networkStatus.connected ? 'success' : 'danger'}
                      size="sm"
                    >
                      {networkStatus.connected ? '已连接' : '未连接'}
                    </Chip>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">区块高度:</span>
                    <span className="text-sm font-mono">{networkStatus.blockNumber}</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 资金池配置 */}
          {poolConfig && (
            <Card>
              <CardHeader className="flex gap-3">
                <BanknotesIcon className="w-6 h-6" />
                <div className="flex flex-col">
                  <p className="text-md">资金池配置</p>
                  <p className="text-small text-default-500">当前网络的资金池参数</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">最小存款:</span>
                    <span className="text-sm font-medium">{poolConfig.minDeposit} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">最大资金池规模:</span>
                    <span className="text-sm font-medium">{poolConfig.maxPoolSize} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">手续费率:</span>
                    <span className="text-sm font-medium">{poolConfig.feeRatePercent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">合约地址:</span>
                    <span className="text-sm font-mono text-blue-600">
                      {poolConfig.contractAddress.slice(0, 10)}...{poolConfig.contractAddress.slice(-8)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* 用户信息 */}
          <Card>
            <CardHeader className="flex gap-3">
              <UserIcon className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-md">用户信息</p>
                <p className="text-small text-default-500">输入您的钱包地址</p>
              </div>
            </CardHeader>
            <CardBody>
              <Input
                type="text"
                label="钱包地址"
                placeholder="0x..."
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="mb-4"
              />
              
              {accountBalance && (
                <div className="mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">账户ETH余额:</span>
                    <span className="text-sm font-medium">{accountBalance} ETH</span>
                  </div>
                </div>
              )}

              {userBalance && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">资金池余额:</span>
                    <span className="text-sm font-medium">{userBalance.balance} ETH</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* 资金池余额 */}
          {poolBalance && (
            <Card>
              <CardHeader className="flex gap-3">
                <CurrencyDollarIcon className="w-6 h-6" />
                <div className="flex flex-col">
                  <p className="text-md">资金池总余额</p>
                  <p className="text-small text-default-500">当前网络资金池的总资产</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {poolBalance.balance} ETH
                  </div>
                  <p className="text-sm text-gray-500">
                    代币地址: {poolBalance.token.slice(0, 10)}...{poolBalance.token.slice(-8)}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* 存款操作 */}
          <Card>
            <CardHeader className="flex gap-3">
              <ArrowUpIcon className="w-6 h-6 text-green-600" />
              <div className="flex flex-col">
                <p className="text-md">存款</p>
                <p className="text-small text-default-500">向资金池存入资产</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input
                  type="number"
                  label="存款金额 (ETH)"
                  placeholder="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
                <Input
                  type="password"
                  label="私钥"
                  placeholder="输入您的私钥"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Button
                  color="success"
                  variant="solid"
                  onPress={handleDeposit}
                  isLoading={loading}
                  className="w-full"
                >
                  确认存款
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 提款操作 */}
          <Card>
            <CardHeader className="flex gap-3">
              <ArrowDownIcon className="w-6 h-6 text-red-600" />
              <div className="flex flex-col">
                <p className="text-md">提款</p>
                <p className="text-small text-default-500">从资金池提取资产</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input
                  type="number"
                  label="提款金额 (ETH)"
                  placeholder="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
                <Input
                  type="password"
                  label="私钥"
                  placeholder="输入您的私钥"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Button
                  color="danger"
                  variant="solid"
                  onPress={handleWithdraw}
                  isLoading={loading}
                  className="w-full"
                >
                  确认提款
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
} 