import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)

  const { id: widgetId, layoutConfig } = await request.json()

  const layout = await prisma.layout.update({
    where: {
      id
    },
    data: {
      layoutConfig,
      widgets: {
        connect: [{ id: widgetId }]
      }
    },
    include: {
      widgets: true
    }
  })

  return NextResponse.json(layout, { status: 201 })
}