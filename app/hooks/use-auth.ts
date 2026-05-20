import { patchData, postData } from "@/lib/fetch-util";
import type { SignupFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignupFormData) =>
      postData("/auth/register", data),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      patchData("/auth/verifyEmail", data),
  });
};

export const useResendVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      patchData("/auth/resend-confirm-email", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password", data),
  });
};

export const useVerifyForgotPasswordCodeMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
    }) =>
      patchData(
        "/auth/verify-forgot-password-code",
        data
      ),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      patchData(
        "/auth/reset-forgot-password-code",
        data
      ),
  });
};