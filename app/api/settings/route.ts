import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await request.json();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser?.id },
      data: { name, image },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
