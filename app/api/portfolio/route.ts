import { NextRequest, NextResponse } from 'next/server';
import { Mobula } from "mobula-sdk";

const mobula = new Mobula({ apiKeyAuth: process.env.NEXT_PUBLIC_MOBULAR_API_KEY });

const cache: Record<string, any> = {}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json("bad request", { status: 400 });
  }

  try {
    const response = await mobula.fetchWalletHoldings({
      wallet,
      cache: true,
      stale: 300
    }).then(res => res.object?.data)

    if (!response) {
      throw new Error("no response")
    }

    const tokens = await Promise.all(response.assets!.map(asset => {
      const chainName = Object.keys(asset.crossChainBalances!)[0]
      const addr = asset.crossChainBalances![chainName].address!

      if (!(addr in cache)) {
        return fetch(`https://api.coingecko.com/api/v3/coins/1/contract/${addr}`)
          .then(res => res.json()).then(res => {
            cache[addr] = [chainName, res.image?.small]
            return cache[addr]
          })
      } else {
        return cache[addr]
      }
    }))

    return NextResponse.json({
      ...response,
      assets: response.assets!.map((item, key) => ({ ...item, name: tokens[key][0], image: tokens[key][1] }))
    });

  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
