"use client";

import { FC, useState } from "react";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import ImageModal from "./ImageModal";
import { User } from "@prisma/client";
import dynamic from "next/dynamic";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { useParams } from "next/navigation";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

const Sigma = dynamic(() => import("@/app/components/Sigma"));

interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
  currentUser: User | null;
}

const MessageBox: FC<MessageBoxProps> = ({ isLast, data, currentUser }) => {
  const [imageModal, setImageModal] = useState(false);
  const [popover, setPopover] = useState(false);
  const [unsendLoading, setUnsendLoading] = useState(false);

  const params = useParams();

  const isOwn = currentUser?.email === data?.sender?.email;
  const seenList = (data?.seen || [])
    .filter((user) => user?.email !== data?.sender?.email)
    .map((user) => user?.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4 group", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden rounded-md",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data?.image ? "p-0" : "py-2 px-3"
  );

  const handleUnsend = () => {
    setUnsendLoading(true);

    axios
      .put(`/api/messages/${data?.id}`, {
        conversationId: params?.conversationId,
      })
      .then(() => setPopover(false))
      .catch((error) => toast.error(error?.response?.data))
      .finally(() => {
        setUnsendLoading(false);
      });
  };

  const downloadFile = async (url: string | any) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      saveAs(blob);

      setPopover(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data?.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 font-medium">
            {data?.sender?.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data?.createdAt), "p")}
          </div>
        </div>

        <div
          className={clsx(
            "flex items-center gap-1",
            isOwn ? "flex-row" : data?.image && "flex-row-reverse"
          )}
        >
          <div
            className={clsx(
              "relative",
              isOwn ? "block" : !isOwn && data?.image ? "block" : "hidden"
            )}
          >
            <button
              onClick={() => setPopover(!popover)}
              className={clsx(
                popover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              <BsThreeDotsVertical />
            </button>

            {popover && (
              <div
                className={clsx(
                  "flex items-center gap-2 bg-black absolute z-40 py-1 px-2 rounded-md text-white font-medium text-sm top-0 bottom-0 disabled:pointer-events-none",
                  isOwn ? "right-5" : data?.image && "left-5"
                )}
              >
                {isOwn && (
                  <button onClick={handleUnsend} disabled={unsendLoading}>
                    Unsend
                  </button>
                )}

                {data?.image && (
                  <button onClick={() => downloadFile(data?.image)}>
                    Download
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={message}>
            <ImageModal
              src={data?.image}
              isOpen={imageModal}
              onClose={() => setImageModal(false)}
            />

            {data?.image ? (
              <div className="w-[288px] h-[288px] relative">
                <Sigma
                  url={data?.image}
                  alt={data?.body || "image_not_working"}
                  onClick={() => setImageModal(true)}
                  play={false}
                  className="object-cover cursor-pointer hover:scale-110 transition-all duration-300 translate w-full h-full"
                />
              </div>
            ) : (
              <div>{data?.body}</div>
            )}
          </div>
        </div>

        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
