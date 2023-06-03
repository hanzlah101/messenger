"use client";

import React from "react";
import useConversation from "@/app/hooks/useConversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { FiPaperclip } from "react-icons/fi";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    setValue("image", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="hqjmg4tn"
      >
        <div className="p-2 cursor-pointer hover:bg-neutral-100 rounded-full">
          <FiPaperclip size={24} className="text-sky-500" />
        </div>
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />

        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 cursor-pointer transition"
        >
          <HiPaperAirplane size={18} color="white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
