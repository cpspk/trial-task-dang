import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending')
      .then(res => res.json()) as { coins: any[] }

    const res = response.coins.map(coin => ({
      name: coin.item.name,
      avatar: coin.item.small,
      price: Number(coin.item.data.price.slice(1)),
      price_change_percentage_24h: coin.item.data.price_change_percentage_24h.usd
    })).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
