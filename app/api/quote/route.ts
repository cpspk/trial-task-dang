import { NextRequest, NextResponse } from 'next/server'
import { getRandomInt } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const response = await fetch('https://type.fit/api/quotes')
      .then(res => res.json())

    const res = response[getRandomInt(response.length)]
    return NextResponse.json({ ...res, author: res.author.split(',')[0] });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
