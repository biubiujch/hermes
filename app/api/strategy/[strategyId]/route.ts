import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function GET(
  request: NextRequest,
  { params }: { params: { strategyId: string } }
) {
  try {
    const strategyId = parseInt(params.strategyId);
    const strategy = await StrategyApiService.getStrategyDetails(strategyId);

    return NextResponse.json({
      success: true,
      data: strategy,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { strategyId: string } }
) {
  try {
    const strategyId = parseInt(params.strategyId);
    const body = await request.json();
    const { walletAddress, params: strategyParams, nonce, deadline, signature } = body;

    if (!walletAddress || !strategyParams || nonce === undefined || !deadline || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, params, nonce, deadline, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const result = await StrategyApiService.updateStrategy(strategyId, {
      walletAddress,
      params: strategyParams,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { strategyId: string } }
) {
  try {
    const strategyId = parseInt(params.strategyId);
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

    const result = await StrategyApiService.deleteStrategy(strategyId, {
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