import { ethers } from 'ethers';

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface StrategyParams {
  symbol: string;
  leverage: number;
  takeProfit: number;
  stopLoss: number;
  amountLimit: string;
  maxDrawdown: number;
  freq: string;
  riskLevel: string;
}

export interface StrategySignatureData {
  walletAddress: string;
  params: StrategyParams;
  symbol: string;
  nonce: number;
  deadline: number;
}

export interface SetActiveSignatureData {
  walletAddress: string;
  active: boolean;
  nonce: number;
  deadline: number;
}

export interface DeleteSignatureData {
  walletAddress: string;
  nonce: number;
  deadline: number;
}

export class SignatureUtils {
  /**
   * Generate EIP-712 signature for strategy registration
   */
  static async signStrategyRegistration(
    signer: ethers.Signer,
    domain: EIP712Domain,
    data: StrategySignatureData
  ): Promise<string> {
    const types = {
      StrategyRegistration: [
        { name: 'walletAddress', type: 'address' },
        { name: 'params', type: 'StrategyParams' },
        { name: 'symbol', type: 'string' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ],
      StrategyParams: [
        { name: 'symbol', type: 'string' },
        { name: 'leverage', type: 'uint256' },
        { name: 'takeProfit', type: 'uint256' },
        { name: 'stopLoss', type: 'uint256' },
        { name: 'amountLimit', type: 'string' },
        { name: 'maxDrawdown', type: 'uint256' },
        { name: 'freq', type: 'string' },
        { name: 'riskLevel', type: 'string' }
      ]
    };

    const value = {
      walletAddress: data.walletAddress,
      params: {
        symbol: data.params.symbol,
        leverage: ethers.parseUnits(data.params.leverage.toString(), 0),
        takeProfit: ethers.parseUnits((data.params.takeProfit * 10000).toString(), 0), // Convert to basis points
        stopLoss: ethers.parseUnits((data.params.stopLoss * 10000).toString(), 0), // Convert to basis points
        amountLimit: data.params.amountLimit,
        maxDrawdown: ethers.parseUnits((data.params.maxDrawdown * 10000).toString(), 0), // Convert to basis points
        freq: data.params.freq,
        riskLevel: data.params.riskLevel
      },
      symbol: data.symbol,
      nonce: data.nonce,
      deadline: data.deadline
    };

    const signature = await signer.signTypedData(domain, types, value);
    return signature;
  }

  /**
   * Generate EIP-712 signature for strategy update
   */
  static async signStrategyUpdate(
    signer: ethers.Signer,
    domain: EIP712Domain,
    data: StrategySignatureData
  ): Promise<string> {
    const types = {
      StrategyUpdate: [
        { name: 'walletAddress', type: 'address' },
        { name: 'params', type: 'StrategyParams' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ],
      StrategyParams: [
        { name: 'symbol', type: 'string' },
        { name: 'leverage', type: 'uint256' },
        { name: 'takeProfit', type: 'uint256' },
        { name: 'stopLoss', type: 'uint256' },
        { name: 'amountLimit', type: 'string' },
        { name: 'maxDrawdown', type: 'uint256' },
        { name: 'freq', type: 'string' },
        { name: 'riskLevel', type: 'string' }
      ]
    };

    const value = {
      walletAddress: data.walletAddress,
      params: {
        symbol: data.params.symbol,
        leverage: ethers.parseUnits(data.params.leverage.toString(), 0),
        takeProfit: ethers.parseUnits((data.params.takeProfit * 10000).toString(), 0),
        stopLoss: ethers.parseUnits((data.params.stopLoss * 10000).toString(), 0),
        amountLimit: data.params.amountLimit,
        maxDrawdown: ethers.parseUnits((data.params.maxDrawdown * 10000).toString(), 0),
        freq: data.params.freq,
        riskLevel: data.params.riskLevel
      },
      nonce: data.nonce,
      deadline: data.deadline
    };

    const signature = await signer.signTypedData(domain, types, value);
    return signature;
  }

  /**
   * Generate EIP-712 signature for setting strategy active status
   */
  static async signSetStrategyActive(
    signer: ethers.Signer,
    domain: EIP712Domain,
    data: SetActiveSignatureData
  ): Promise<string> {
    const types = {
      SetStrategyActive: [
        { name: 'walletAddress', type: 'address' },
        { name: 'active', type: 'bool' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    const value = {
      walletAddress: data.walletAddress,
      active: data.active,
      nonce: data.nonce,
      deadline: data.deadline
    };

    const signature = await signer.signTypedData(domain, types, value);
    return signature;
  }

  /**
   * Generate EIP-712 signature for deleting strategy
   */
  static async signDeleteStrategy(
    signer: ethers.Signer,
    domain: EIP712Domain,
    data: DeleteSignatureData
  ): Promise<string> {
    const types = {
      DeleteStrategy: [
        { name: 'walletAddress', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    const value = {
      walletAddress: data.walletAddress,
      nonce: data.nonce,
      deadline: data.deadline
    };

    const signature = await signer.signTypedData(domain, types, value);
    return signature;
  }

  /**
   * Verify EIP-712 signature
   */
  static verifySignature(
    domain: EIP712Domain,
    types: any,
    value: any,
    signature: string
  ): string {
    try {
      const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
      return recoveredAddress;
    } catch (error) {
      throw new Error('Invalid signature');
    }
  }
} 