import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(request: NextRequest) {
  try {
    const config = await VaultApiService.getVaultConfig();

    return NextResponse.json({
      success: true,
      data: config,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Vault config error:', error.message);

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