import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function POST(
  request: NextRequest,
  { params }: { params: { poolId: string } }
) {
  try {
    const poolId = parseInt(params.poolId);
    const body = await request.json();
    const { walletAddress, amount, tokenAddress, networkId = 31337 } = body;

    if (isNaN(poolId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pool ID',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    if (!walletAddress || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address and amount are required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const transactionData = await VaultApiService.prepareWithdrawTransaction(poolId, walletAddress, amount, tokenAddress, networkId);

    return NextResponse.json({
      success: true,
      data: transactionData,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Prepare withdraw transaction error:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Service temporarily unavailable',
        timestamp: Date.now()
      },
      { status: 200 }
    );
  }
} 