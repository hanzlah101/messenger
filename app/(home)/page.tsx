import Image from "next/image";
import AuthForm from "./components/AuthForm";
import getCurrentUser from "../actions/getCurrentUser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication / Messenger",
};

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src={"/images/logo.png"}
          alt="logo_image"
          height={"48"}
          width={"48"}
          className="w-auto mx-auto"
          priority
        />

        <h2 className="mt-6 text-center sm:text-3xl text-[1.5rem] font-bold tracking-tight">
          Sign in or create your account
        </h2>
      </div>

      <AuthForm currentUser={currentUser} />
    </div>
  );
}
