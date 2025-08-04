import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string; strategy: string }> }
) {
  try {
    const { network, strategy } = await params;

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: '缺少策略地址参数' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const authorized = await assetsPool.isStrategyAuthorized(network, strategy);

    return NextResponse.json({
      success: true,
      data: {
        strategy,
        authorized
      }
    });
  } catch (error) {
    console.error('检查策略授权状态错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '检查策略授权状态失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 