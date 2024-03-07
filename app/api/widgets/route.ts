import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json([], { status: 401 })
  }

  try {
    const widgets = await prisma.widget.findMany()
  
    return NextResponse.json(widgets)
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
