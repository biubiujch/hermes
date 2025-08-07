import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, initialAmount, tokenAddress, nonce, deadline, signature } = body;

    if (!walletAddress || !initialAmount || nonce === undefined || !deadline || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, initialAmount, nonce, deadline, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const result = await VaultApiService.createPool({
      walletAddress,
      initialAmount,
      tokenAddress,
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