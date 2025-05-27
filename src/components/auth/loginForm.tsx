import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { loginSchema, type LoginFormData } from "@/shared/schemas/auth";
import { authService } from "@/shared/services/auth";

import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Typography } from "../../shared/components/ui/typography";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await authService.login(data);

      if (response.success) {
        onSuccess();
      } else {
        setServerError(response.error || "An error occurred");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred. Please try again.";
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
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
        <div className="space-y-2">
          <Input
            {...register("email")}
            disabled={isLoading}
            error={errors.email?.message}
            placeholder="Email"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register("password")}
            disabled={isLoading}
            error={errors.password?.message}
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

        <div className="text-center">
          <Typography className="text-gray-600" variant="body-m-regular">
            Test credentials:
          </Typography>
          <Typography className="text-gray-600" variant="body-m-regular">
            Email: test@example.com
          </Typography>
          <Typography className="text-gray-600" variant="body-m-regular">
            Password: 123456
          </Typography>
        </div>
      </form>
    </div>
  );
}
