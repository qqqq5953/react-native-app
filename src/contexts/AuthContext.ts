import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { createContext } from "react";
import { ApiErrorResponse } from "../types/api";

export type User = {
  id: string;
  name: string;
  email: string;
  oauthSource: string | null;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAzure: (code: string, state: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  superLinkLogin: (token: string) => Promise<void>;
  resetPassword: (
    newPassword: string,
    confirmedPassword: string
  ) => Promise<void>;
  loginMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string; password: string };
      config?: AxiosRequestConfig;
    }
  >;
  loginWithAzureMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { code: string; state: string };
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
  superLinkLoginMutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { token: string };
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
  loginWithAzure: async () => {},
  logout: async () => {},
  requestPasswordReset: async () => {},
  superLinkLogin: async () => {},
  resetPassword: async () => {},
  loginMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { email: string; password: string };
      config?: AxiosRequestConfig;
    }
  >,
  loginWithAzureMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { code: string; state: string };
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
  superLinkLoginMutation: {} as UseMutationResult<
    null,
    AxiosError<ApiErrorResponse>,
    {
      url: string;
      data?: { token: string };
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
