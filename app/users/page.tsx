import React from "react";
import EmptyState from "../components/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users / Messenger",
};

const Users = () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Users;
