"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/shared/redux";
import { loginUser, selectAuthLoading, selectAuthError } from "@/shared/redux/slices/authSlice";
import { loginSchema, type LoginFormData } from "@/shared/schemas/auth";

import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Typography } from "../../shared/components/ui/typography";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <div className="text-center">
        <Typography className="text-gray-800" tag="h1" variant="headline-1">
          Sign In
        </Typography>
        <Typography className="text-gray-600 mt-2" variant="body-m-regular">
          Please enter your credentials
        </Typography>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            {...register("email")}
            disabled={isLoading}
            error={isSubmitted ? errors.email?.message : undefined}
            placeholder="Email"
            type="email"
          />
        </div>

        <div>
          <Input
            {...register("password")}
            disabled={isLoading}
            error={isSubmitted ? errors.password?.message : undefined}
            placeholder="Password"
            type="password"
          />
        </div>

        {serverError && (
          <Typography className="text-red-500 text-center" variant="body-m-regular">
            {serverError}
          </Typography>
        )}

        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
