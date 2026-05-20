import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyForgotPasswordCodeMutation,
} from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";

type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [showOtpForm, setShowOtpForm] =
    useState(false);

  const [isOtpVerified, setIsOtpVerified] =
    useState(false);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const {
    mutate: forgotPassword,
    isPending,
  } = useForgotPasswordMutation();

  const {
    mutate: verifyOtp,
    isPending: isVerifyPending,
  } = useVerifyForgotPasswordCodeMutation();

  const {
    mutate: resetPassword,
    isPending: isResetPending,
  } = useResetPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (
    data: ForgotPasswordFormData
  ) => {
    forgotPassword(data, {
      onSuccess: () => {
        setEmail(data.email);
        setShowOtpForm(true);

        toast.success("OTP sent successfully");
      },

      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message;

        toast.error(errorMessage);
      },
    });
  };

  const handleOtpChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;

      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    verifyOtp(
      {
        email,
        otp: finalOtp,
      },
      {
        onSuccess: () => {
          toast.success(
            "OTP verified successfully"
          );

          setIsOtpVerified(true);
        },

        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message;

          toast.error(errorMessage);
        },
      }
    );
  };

  const handleResetPassword = () => {
    const finalOtp = otp.join("");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword(
      {
        email,
        otp: finalOtp,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success(
            "Password changed successfully"
          );

          navigate("/sign-in");
        },

        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message;

          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold">
            Forgot Password
          </h1>

          <p className="text-muted-foreground text-center">
            {!showOtpForm
              ? "Enter your email to reset your password"
              : !isOtpVerified
              ? `Enter the OTP sent to ${email}`
              : "Enter your new password"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <Link
              to="/sign-in"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />

              <span>Back to sign in</span>
            </Link>
          </CardHeader>

          <CardContent>
            {!showOtpForm ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    onSubmit
                  )}
                  className="space-y-4"
                >
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your email"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </Form>
            ) : !isOtpVerified ? (
              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index
                        )
                      }
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg"
                    />
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyPending}
                >
                  {isVerifyPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <Button
                  className="w-full"
                  onClick={handleResetPassword}
                  disabled={isResetPending}
                >
                  {isResetPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;