import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const tokenAddress = searchParams.get('tokenAddress');
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

    const status = await VaultApiService.getApprovalStatus(walletAddress, tokenAddress || undefined, parseInt(networkId));

    return NextResponse.json({
      success: true,
      data: status,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Get approval status error:', error.message);

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