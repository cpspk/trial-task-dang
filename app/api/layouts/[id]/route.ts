import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()

  const layout = await prisma.layout.delete({
    where: {
      id
    }
  })

  return NextResponse.json({ status: 202 })
}