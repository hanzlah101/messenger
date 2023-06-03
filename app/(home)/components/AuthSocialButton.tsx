"use client";

import { FC } from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
}

const AuthSocialButton: FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full inline-flex justify-center rounded-md disabled:cursor-default bg-white px-4 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
      disabled={disabled}
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
