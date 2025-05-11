import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { createContext } from "react";
import { ApiErrorResponse } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  oauthSource: string | null;
  isRequiredPasswordChange?: boolean;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    newPassword: string,
    confirmedPassword: string
  ) => Promise<void>;
  loginMutation: UseMutationResult<
    { token: string },
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string; password: string };
      config?: AxiosRequestConfig;
    }
  >;
  logoutMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      config?: AxiosRequestConfig;
    }
  >;
  requestPasswordResetMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string };
      config?: AxiosRequestConfig;
    }
  >;
  resetPasswordMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { newPassword: string; confirmedPassword: string };
      config?: AxiosRequestConfig;
    }
  >;
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  loginMutation: {} as UseMutationResult<
    { token: string },
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string; password: string };
      config?: AxiosRequestConfig;
    }
  >,
  logoutMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      config?: AxiosRequestConfig;
    }
  >,
  requestPasswordResetMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string };
      config?: AxiosRequestConfig;
    }
  >,
  resetPasswordMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { newPassword: string; confirmedPassword: string };
      config?: AxiosRequestConfig;
    }
  >,
});
