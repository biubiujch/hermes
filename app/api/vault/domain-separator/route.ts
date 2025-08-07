import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(request: NextRequest) {
  try {
    const domainSeparator = await VaultApiService.getDomainSeparator();

    return NextResponse.json({
      success: true,
      data: domainSeparator,
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