import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(
  request: NextRequest,
  { params }: { params: { poolId: string } }
) {
  try {
    const poolId = parseInt(params.poolId);
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('networkId') || '31337';
    
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

    const pool = await VaultApiService.getPoolDetails(poolId, parseInt(networkId));

    return NextResponse.json({
      success: true,
      data: pool,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Get pool details error:', error.message);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { poolId: string } }
) {
  try {
    const poolId = parseInt(params.poolId);
    const body = await request.json();
    const { walletAddress, networkId = 31337 } = body;

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

    const transactionData = await VaultApiService.prepareDeletePool(poolId, walletAddress, networkId);

    return NextResponse.json({
      success: true,
      data: transactionData,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Prepare delete pool error:', error.message);

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