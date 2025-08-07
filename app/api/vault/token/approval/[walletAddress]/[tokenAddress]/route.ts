import { NextRequest, NextResponse } from 'next/server';
import { VaultApiService } from '@/lib/account/vault';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string; tokenAddress: string }> }
) {
  try {
    const { walletAddress, tokenAddress } = await params;

    if (!walletAddress || !tokenAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address and token address are required',
          timestamp: Date.now()
        },
        { status: 400 }
      );
    }

    const approvalStatus = await VaultApiService.getTokenApprovalStatus(walletAddress, tokenAddress);

    return NextResponse.json({
      success: true,
      data: approvalStatus,
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