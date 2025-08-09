import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, params, symbol, nonce, deadline, signature } = body;

    if (!walletAddress || !params || !symbol || nonce === undefined || !deadline || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, params, symbol, nonce, deadline, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const result = await StrategyApiService.verifySignature({
      walletAddress,
      params,
      symbol,
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