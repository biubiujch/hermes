import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function PUT(
  request: NextRequest,
  { params }: { params: { strategyId: string } }
) {
  try {
    const strategyId = parseInt(params.strategyId);
    const body = await request.json();
    const { walletAddress, active, nonce, deadline, signature } = body;

    if (!walletAddress || active === undefined || nonce === undefined || !deadline || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, active, nonce, deadline, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const result = await StrategyApiService.setStrategyActive(strategyId, {
      walletAddress,
      active,
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