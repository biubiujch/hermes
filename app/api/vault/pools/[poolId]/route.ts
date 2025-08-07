import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const { poolId } = await params;
    const poolIdNum = parseInt(poolId, 10);

    if (isNaN(poolIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pool ID',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const poolDetails = await VaultApiService.getPoolDetails(poolIdNum);

    return NextResponse.json({
      success: true,
      data: poolDetails,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Backend service error:', error.message);

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
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const { poolId } = await params;
    const poolIdNum = parseInt(poolId, 10);

    if (isNaN(poolIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pool ID',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { walletAddress, nonce, deadline, signature } = body;

    if (!walletAddress || nonce === undefined || !deadline || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, nonce, deadline, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const result = await VaultApiService.deletePool(poolIdNum, {
      walletAddress,
      nonce,
      deadline,
      signature
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Backend service error:', error.message);

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