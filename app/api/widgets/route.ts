import prisma from "@/prisma"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { authOptions } from "@/utils/authOption"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json([], { status: 401 })
  }

  const widgets = await prisma.widget.findMany({
    include: {
      layouts: true
    },
  })

  return NextResponse.json(widgets)
}

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions)

//   if (!session) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
//   }
// }
