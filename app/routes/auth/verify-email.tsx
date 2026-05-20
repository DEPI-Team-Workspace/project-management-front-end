import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
} from "@/hooks/use-auth";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const { mutate, isPending } = useVerifyEmailMutation();

  const {
    mutate: resendOtp,
    isPending: isResending,
  } = useResendVerifyEmailMutation();

  const handleVerify = () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Email verified successfully");

          navigate("/sign-in");
        },

        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Verification failed"
          );
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!email) return;

    resendOtp(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP sent successfully");
        },

        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to resend OTP"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Verify your email
          </CardTitle>

          <CardDescription>
            Enter the OTP sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify Email"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </Button>

          <div className="text-center">
            <Link
              to="/sign-in"
              className="text-sm text-blue-500"
            >
              Back to Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;