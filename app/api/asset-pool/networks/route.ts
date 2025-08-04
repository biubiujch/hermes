import { NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET() {
  try {
    const assetsPool = new AssetsPool();
    const networks = await assetsPool.getNetworks();

    return NextResponse.json({
      success: true,
      data: networks
    });
  } catch (error) {
    console.error('获取网络列表错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '获取网络列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 