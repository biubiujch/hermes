import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    const { network } = await params;

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const config = await assetsPool.getPoolConfig(network);

    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('获取资金池配置错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '获取资金池配置失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 