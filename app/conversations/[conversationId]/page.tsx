import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import React, { Suspense } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getCurrentUser from "@/app/actions/getCurrentUser";
import type { Metadata } from "next";
import LoadingModal from "@/app/components/LoadingModal.txs";

interface IParams {
  conversationId: string;
}

export async function generateMetadata({
  params,
}: {
  params: IParams;
}): Promise<Metadata> {
  const conversation = await getConversationById(params.conversationId);
  return {
    title: conversation?.isGroup
      ? `${conversation?.name} / Conversation / Messenger`
      : "Conversation / Messenger",
  };
}

const Conversation = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const currentUser = await getCurrentUser();

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <Suspense fallback={<LoadingModal />}>
        <div className="h-full flex flex-col">
          <Header conversation={conversation} />
          <Body
            initialMessages={messages}
            currentUser={currentUser && currentUser}
          />
          <Form />
        </div>
      </Suspense>
    </div>
  );
};

export default Conversation;
