"use client";

import { FC, useMemo, useState } from "react";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import ProfileDrawer from "./ProfileDrawer";
import GroupAvatar from "@/app/components/GroupAvatar";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation?.users?.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="w-full bg-white flex border-b sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href={"/conversations"}
            className="lg:hidden block text-sky-500 hover:text-sky-600 cursor-pointer transition"
          >
            <HiChevronLeft size={32} />
          </Link>

          {conversation?.isGroup ? (
            <GroupAvatar users={conversation?.users} />
          ) : (
            <Avatar user={otherUser} />
          )}

          <div className="flex flex-col">
            <div className="font-medium">
              {conversation?.name || otherUser?.name}
            </div>

            <div className="text-xs font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-sky-500 hover:text-sky-600 transition cursor-pointer"
        />
      </div>
    </>
  );
};

export default Header;
