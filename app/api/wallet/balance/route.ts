import { NextRequest, NextResponse } from 'next/server';
import { WalletApiService } from '@/lib/account/wallet';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

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

    const balance = await WalletApiService.getWalletBalance(walletAddress);

    return NextResponse.json({
      success: true,
      data: { balances: balance },
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Backend service error:', error.message);

    // Return 200 status with error information instead of 503
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
