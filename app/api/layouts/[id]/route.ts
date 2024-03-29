import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)
  const { layoutConfig } = await request.json()

  const layout = await prisma.layout.update({
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

  return NextResponse.json(layout, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const id = Number(params.id)

  await prisma.layout.delete({
    where: {
      id
    }
  })

  return NextResponse.json({ status: 202 })
}