"use client";

import { FC } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: FC<MessageInputProps> = ({
  id,
  type,
  register,
  errors,
  required,
  placeholder,
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        autoComplete="off"
        type={type || "text"}
        {...register(id, { required })}
        placeholder={placeholder}
        className="py-3 outline-none font-thin px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
        name={id}
      />
    </div>
  );
};

export default MessageInput;
