import { Suspense } from "react";
import type { Metadata } from "next";
import ConversationsClient from "./ConversationsClient";
import LoadingModal from "../components/LoadingModal.txs";
import getCurrentUser from "../actions/getCurrentUser";

export const metadata: Metadata = {
  title: "Conversations / Messenger",
};

const Conversations = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Suspense fallback={<LoadingModal />}>
      <ConversationsClient />;
    </Suspense>
  );
};

export default Conversations;
