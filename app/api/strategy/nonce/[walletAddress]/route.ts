import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const walletAddress = decodeURIComponent(params.walletAddress);
    console.log('[API] /api/strategy/nonce request:', { walletAddress });
    const nonce = await StrategyApiService.getUserNonce(walletAddress);

    return NextResponse.json({
      success: true,
      data: nonce,
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