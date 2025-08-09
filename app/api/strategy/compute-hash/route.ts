import { NextRequest, NextResponse } from 'next/server';
import { StrategyApiService } from '@/lib/account/strategy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, params, symbol, nonce, deadline } = body;

    if (!walletAddress || !params || !symbol || nonce === undefined || !deadline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 调用后端服务计算哈希
    const result = await StrategyApiService.computeHash({
      walletAddress,
      params,
      symbol,
      nonce,
      deadline
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to compute hash' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Compute hash error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 