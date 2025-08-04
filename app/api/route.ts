import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Hermes Service API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        assetPool: '/api/asset-pool',
        networks: '/api/asset-pool/networks',
        candlestick: '/api/candlestick'
      }
    });
  } catch (error) {
    console.error('API信息错误:', error);

    return NextResponse.json(
      {
        message: 'Hermes Service API',
        version: '1.0.0',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 