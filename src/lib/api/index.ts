import { ApiErrorResponse } from "@/types/api";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import api from "./axios";

export { api };

export const fetcher = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get(url, config);
    return response.data;
  },
  post: async <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post(url, data, config);
    return response.data;
  },
  put: async <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.put(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete(url, config);
    return response.data;
  },
};

// React Query hooks
type UseGetOptions<T> = Omit<
  UseQueryOptions<T, AxiosError<ApiErrorResponse>, T, readonly unknown[]>,
  "queryKey" | "queryFn" | "enabled"
> & {
  enabled?: boolean;
};

type UseGetParams<T> = {
  url: string;
  queryKey: readonly unknown[];
  config?: AxiosRequestConfig;
  options?: UseGetOptions<T>;
};

export const useGet = <T>({
  url,
  queryKey,
  config,
  options,
}: UseGetParams<T>) => {
  return useQuery<T, AxiosError<ApiErrorResponse>>({
    queryKey,
    queryFn: () => fetcher.get<T>(url, config),
    enabled: options?.enabled ?? true,
    ...options,
  });
};

// Enhanced mutation types with invalidation options
type InvalidateQueryOptions = {
  invalidateQueries?: readonly unknown[];
  exactMatch?: boolean;
};

export const usePost = <T, D>(invalidateOptions?: InvalidateQueryOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    T,
    AxiosError<ApiErrorResponse>,
    { url: string; data?: D; config?: AxiosRequestConfig }
  >({
    mutationFn: ({ url, data, config }) =>
      fetcher.post<T, D>(url, data, config),
    onSuccess: () => {
      if (invalidateOptions?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: invalidateOptions.invalidateQueries,
          exact: invalidateOptions.exactMatch,
        });
      }
    },
  });
};

export const usePut = <T, D>(invalidateOptions?: InvalidateQueryOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    T,
    AxiosError<ApiErrorResponse>,
    { url: string; data?: D; config?: AxiosRequestConfig }
  >({
    mutationFn: ({ url, data, config }) => fetcher.put<T, D>(url, data, config),
    onSuccess: () => {
      if (invalidateOptions?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: invalidateOptions.invalidateQueries,
          exact: invalidateOptions.exactMatch,
        });
      }
    },
  });
};

export const useDelete = <T>(invalidateOptions?: InvalidateQueryOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    T,
    AxiosError<ApiErrorResponse>,
    { url: string; config?: AxiosRequestConfig }
  >({
    mutationFn: ({ url, config }) => fetcher.delete<T>(url, config),
    onSuccess: () => {
      if (invalidateOptions?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: invalidateOptions.invalidateQueries,
          exact: invalidateOptions.exactMatch,
        });
      }
    },
  });
};
