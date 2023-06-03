import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  messageId?: string;
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = await request.json();
    const { messageId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const message = await prisma.message.findFirst({
      where: {
        AND: [
          { id: messageId },
          { conversationId },
          { senderId: currentUser?.id },
        ],
      },
    });

    const deletedMessage = await prisma.message.delete({
      where: {
        id: message?.id,
      },
    });

    await pusherServer.trigger(
      conversationId,
      "messages:remove",
      deletedMessage
    );

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: {},
      },
      include: {
        users: true,
        messages: { include: { seen: true } },
      },
    });

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map(async (user) => {
      await pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return new NextResponse("Message deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
