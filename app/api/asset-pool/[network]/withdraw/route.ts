import { NextRequest, NextResponse } from 'next/server';
import { AssetsPool } from '@/lib/account/assetsPool';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ network: string }> }
) {
  try {
    const { network } = await params;
    const body = await request.json();
    const { user, token = '0x0000000000000000000000000000000000000000', amount, privateKey } = body;

    if (!network) {
      return NextResponse.json(
        { success: false, error: '缺少网络参数' },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: '缺少用户地址' },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { success: false, error: '缺少提款金额' },
        { status: 400 }
      );
    }

    if (!privateKey) {
      return NextResponse.json(
        { success: false, error: '缺少私钥' },
        { status: 400 }
      );
    }

    const assetsPool = new AssetsPool();
    const result = await assetsPool.withdraw(network, user, amount, privateKey, token);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('提款操作错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '提款操作失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 