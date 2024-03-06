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
  const { id: widgetId } = await request.json()

  const beforeLayoutWidgets = (await prisma.layout.findUnique({
    where: {
      id
    },
    include: {
      widgets: true
    }
  }))?.widgets

  const layout = await prisma.layout.update({
    where: {
      id
    },
    data: {
      widgets: {
        create: [{
          widget: {
            connect: { id: widgetId }
          }
        }]
      }
    },
    include: {
      widgets: true
    }
  })

  const newlyAddedLayoutWidgets = layout.widgets.filter(widget => !beforeLayoutWidgets?.map(bWidget => bWidget.id).includes(widget.id))
  const layoutConfig = layout.layoutConfig as number[][]
  layoutConfig?.[0].push(newlyAddedLayoutWidgets[0].id)

  const updatedLayout = await prisma.layout.update({
    where: {
      id
    },
    data: {
      layoutConfig
    },
    include: {
      widgets: true
    }
  })

  return NextResponse.json(updatedLayout, { status: 201 })
}