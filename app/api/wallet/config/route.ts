import { NextRequest, NextResponse } from 'next/server';
import { WalletApiService } from '@/lib/account/wallet';

export async function GET(request: NextRequest) {
  try {
    const config = await WalletApiService.getAppConfig();

    return NextResponse.json({
      success: true,
      data: { config },
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
