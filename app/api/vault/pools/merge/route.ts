import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, targetPoolId, sourcePoolId, networkId = 31337 } = body;

    if (!walletAddress || !targetPoolId || !sourcePoolId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address, target pool ID, and source pool ID are required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const transactionData = await VaultApiService.prepareMergePools(walletAddress, targetPoolId, sourcePoolId, networkId);

    return NextResponse.json({
      success: true,
      data: transactionData,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Prepare merge pools error:', error.message);

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