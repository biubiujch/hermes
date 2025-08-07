import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const networkId = searchParams.get('networkId') || '31337';

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const pools = await VaultApiService.getUserPools(walletAddress, parseInt(networkId));

    return NextResponse.json({
      success: true,
      data: { 
        walletAddress,
        networkId: parseInt(networkId),
        poolCount: pools.length,
        pools 
      },
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Get user pools error:', error.message);

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, initialAmount, tokenAddress, networkId = 31337 } = body;

    if (!walletAddress || !initialAmount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address and initial amount are required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const transactionData = await VaultApiService.prepareCreatePool(walletAddress, initialAmount, tokenAddress, networkId);

    return NextResponse.json({
      success: true,
      data: transactionData,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Prepare create pool error:', error.message);
    console.log(error)
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