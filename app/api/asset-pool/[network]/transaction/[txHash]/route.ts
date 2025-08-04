import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ network: string; txHash: string }> }
) {
  try {
    const { network, txHash } = await params;

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    if (!txHash) {
      return NextResponse.json(
        { success: false, error: '缺少交易哈希参数' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const transaction = await assetsPool.getTransactionInfo(network, txHash);

    return NextResponse.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('获取交易详情错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '获取交易详情失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 