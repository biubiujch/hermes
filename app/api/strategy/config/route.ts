import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function GET(request: NextRequest) {
  try {
    const config = await StrategyApiService.getStrategyConfig();

    return NextResponse.json({
      success: true,
      data: config,
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