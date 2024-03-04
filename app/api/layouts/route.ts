import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json([], { status: 401 })
  }

  const layouts = await prisma.layout.findMany({
    where: {
      user: {
        id: session.user.id,
      },
    },
    include: {
      widgets: true
    },
  })

  return NextResponse.json(layouts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { dashboardname, widgets } = await request.json()

  const layoutConfig: number[][] = [
    [],
    [],
    [],
    [],
  ]

  widgets.forEach((widget: { id: number }, index: number) => {
    layoutConfig[index % 4].push(widget.id)
  });

  const layout = await prisma.layout.create({
    data: {
      userId: session.user.id,
      layoutName: dashboardname,
      layoutConfig: layoutConfig,
      widgets: {
        connect: widgets
      }
    },
    include: {
      widgets: true
    }
  })

  return NextResponse.json(layout, { status: 201 })
}
