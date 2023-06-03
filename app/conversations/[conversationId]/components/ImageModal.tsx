"use client";

import { FC } from "react";
import Modal from "@/app/components/Modal";
import dynamic from "next/dynamic";

const Sigma = dynamic(() => import("@/app/components/Sigma"));

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!src) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-auto h-auto min-w-[320px] min-h-[320px]">
        <Sigma
          url={src}
          alt="sent_image"
          className="object-cover w-full h-full"
          play
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
