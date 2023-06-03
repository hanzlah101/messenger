"use client";

import { useCallback, useEffect, useState, FC } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

type Variant = "LOGIN" | "REGISTER";

interface AuthFormProps {
  currentUser: User | null;
}

const AuthForm: FC<AuthFormProps> = ({ currentUser }) => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (currentUser?.email && currentUser?.id && currentUser !== null) {
      router.push("/conversations");
    }
  }, [currentUser, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    }

    if (variant === "REGISTER") {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      try {
        await axios.post("/api/register", data);
        toast.success("Registered Successfully");
        signIn("credentials", data);
        router.push("/conversations");
      } catch (error: any) {
        toast.error(error.response.data);
      } finally {
        setIsLoading(false);
      }
    }

    if (variant === "LOGIN") {
      signIn("credentials", { ...data, redirect: false })
        .then((cb) => {
          if (cb?.error) {
            router.push("/conversations");
            toast.error(cb?.error);
          }

          if (cb?.ok && !cb?.error) {
            toast.success("Logged In Successfully");
            router.push("/conversations");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = async (action: string) => {
    setIsLoading(true);

    try {
      await signIn(action, { redirect: false }).then((cb) => {
        if (cb?.error) {
          toast.error(cb?.error);
        }

        if (cb?.ok && !cb?.error) {
          toast.success("Logged In Successfully");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:mx-auto mt-8 sm:w-full sm:max-w-md">
      <div className="py-8 px-4 sm:shadow sm:rounded-lg sm:px-10 sm:bg-white">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              type="text"
              disabled={isLoading}
              required
            />
          )}

          <Input
            id="email"
            label="Email Address"
            register={register}
            errors={errors}
            type="email"
            disabled={isLoading}
            required
          />

          <Input
            id="password"
            label="Password"
            register={register}
            errors={errors}
            type="password"
            disabled={isLoading}
            required
          />

          <div className="">
            <Button fullWidth disabled={isLoading} type="submit">
              {variant === "LOGIN" ? "Sign in" : "Create"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-3 sm:bg-white bg-gray-100 text-gray-500">
                OR
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={FcGoogle}
              onClick={() => socialAction("google")}
              disabled={isLoading}
            />

            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-1 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
              {variant === "LOGIN"
                ? "New to messenger?"
                : "Already have an account?"}
            </div>

            <div
              onClick={() => !isLoading && toggleVariant()}
              className="font-bold cursor-pointer text-gray-600 hover:underline"
            >
              {variant === "LOGIN" ? "Signup" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
