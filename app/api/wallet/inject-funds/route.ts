import { NextRequest, NextResponse } from 'next/server';
import { WalletApiService } from '../../../../lib/api/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount } = body;

    if (!walletAddress || !amount) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Wallet address and amount are required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const success = await WalletApiService.injectFunds(walletAddress, amount);
    
    return NextResponse.json({
      success: true,
      data: { success },
      message: 'Funds injected successfully',
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Inject funds error:', error.message);
    
    // Return the actual error message from backend
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Service temporarily unavailable',
        timestamp: Date.now()
      },
      { status: 200 }
    );
  }
} 