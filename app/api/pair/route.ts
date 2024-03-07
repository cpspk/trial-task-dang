import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${symbol}`)
      .then(res => res.json()) as { pairs: { chainId: string, pairAddress: string, quoteToken: { symbol: string }}[]};

    for (const pair of response.pairs) {
      if (["USDC", "USDT", "DAI", "WETH"].includes(pair.quoteToken.symbol) && pair.chainId === "ethereum") {
        return NextResponse.json({
          pair: pair.pairAddress,
          quoteToken: pair.quoteToken.symbol
        });
      }
    }
    
    throw new Error("Pair not found")

  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
