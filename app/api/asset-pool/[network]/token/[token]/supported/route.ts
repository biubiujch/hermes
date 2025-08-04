import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string; token: string }> }
) {
  try {
    const { network, token } = await params;

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: '缺少代币地址参数' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const supported = await assetsPool.isTokenSupported(network, token);

    return NextResponse.json({
      success: true,
      data: {
        token,
        supported
      }
    });
  } catch (error) {
    console.error('检查代币支持状态错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '检查代币支持状态失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 