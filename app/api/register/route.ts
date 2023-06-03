import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/app/libs/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return new NextResponse("User already exists", { status: 401 });
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "REGISTERATION_ERROR");
    return new NextResponse(error, { status: 500 });
  }
}
