import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string; address: string }> }
) {
  try {
    const { network, address } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '0x0000000000000000000000000000000000000000';

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { success: false, error: '缺少用户地址参数' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const balance = await assetsPool.getUserBalance(network, address, token);

    return NextResponse.json({
      success: true,
      data: balance
    });
  } catch (error) {
    console.error('获取用户余额错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '获取用户余额失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 