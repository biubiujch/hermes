import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, message, signature } = body;

    if (!walletAddress || !message || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, message, signature',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const verificationResult = await VaultApiService.verifySignature({
      walletAddress,
      message,
      signature
    });

    return NextResponse.json({
      success: true,
      data: verificationResult,
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