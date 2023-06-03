"use client";

import { FC } from "react";
import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: FC<MobileItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "group flex gap-x-3 text-sm leading-sm font-semibold w-full justify-center p-4 text-gray-500 hover:bg-gray-100 hover:text-black",
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="w-6 h-6" />
    </Link>
  );
};

export default MobileItem;
