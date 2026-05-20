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
import { useResetPasswordMutation } from "@/hooks/use-auth";
import { resetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending } =
    useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!email || !otp) {
      toast.error("Invalid reset session");
      return;
    }

    resetPassword(
      {
        email,
        otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);

          toast.success("Password reset successful");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to reset password";

          toast.error(errorMessage);

          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold">Reset Password</h1>

          <p className="text-muted-foreground">
            Enter your new password
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
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <CheckCircle className="w-12 h-12 text-green-500" />

                <h1 className="text-2xl font-bold text-center">
                  Password reset successful
                </h1>

                <p className="text-sm text-muted-foreground text-center">
                  Your password has been updated successfully.
                </p>

                <Link to="/sign-in">
                  <Button className="mt-4">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm Password
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
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
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;