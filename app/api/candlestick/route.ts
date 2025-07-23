import { NextRequest, NextResponse } from 'next/server';
import { getCandlestickData, type Network, type Period } from '@/lib/market';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 获取查询参数
    const tokenSymbol = searchParams.get('tokenSymbol');
    const period = searchParams.get('period') as Period;
    const network = searchParams.get('network') || 'arbitrum'; // 默认使用 arbitrum

    // 验证必需参数
    if (!tokenSymbol) {
      return NextResponse.json({ error: '缺少必需参数: tokenSymbol' }, { status: 400 });
    }

    if (!period) {
      return NextResponse.json({ error: '缺少必需参数: period' }, { status: 400 });
    }

    // 获取K线数据
    const candlestickData = await getCandlestickData(tokenSymbol, period, network as Network);

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        tokenSymbol: tokenSymbol.toUpperCase(),
        period,
        network,
        candlesticks: candlestickData,
        count: candlestickData.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('K线数据API错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: '获取K线数据失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
