import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function DELETE(request: NextRequest, { params }: { params: { id: string, layoutWidgetId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)
  const layoutWidgetId = Number(params.layoutWidgetId)

  const { layoutConfig } = await request.json()

  const layout = await prisma.layout.update({
    where: {
      id
    },
    data: {
      layoutConfig
    }
  })

  await prisma.layoutWidgets.delete({
    where: {
      id: layoutWidgetId
    }
  })

  const updatedLayout = await prisma.layout.findUnique({
    where: {
      id: layout.id
    },
    include: {
      widgets: true
    }
  })

  return NextResponse.json(updatedLayout, { status: 202 })
}