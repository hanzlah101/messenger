"use client";

import { FC, useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import { filter, find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
  currentUser: User | null;
}

const Body: FC<BodyProps> = ({ initialMessages, currentUser }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message?.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef.current?.scrollIntoView();
    };

    const deleteMessageHandler = (message: FullMessageType) => {
      // axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        return current.filter((msg) => {
          return msg?.id !== message?.id;
        });
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage?.id === newMessage?.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messages:remove", deleteMessageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:remove", deleteMessageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, index) => (
        <MessageBox
          key={index}
          isLast={index === messages.length - 1}
          data={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
