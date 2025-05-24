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

export class FetchError extends Error {
  body: any;
  status: number;
  constructor(message: string, body: any, status: number) {
    super(message);
    this.body = body;
    this.status = status;
  }
}

async function handleFetchError(res: Response) {
  let errorBody;
  try {
    errorBody = await res.json();
  } catch {
    errorBody = null;
  }
  const error = new FetchError(
    `Fetch failed: ${res.status} ${res.statusText}`,
    errorBody,
    res.status
  );
  return error;
}

function normalizeHeaders(headers?: any): HeadersInit | undefined {
  if (!headers) return undefined;
  return Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k, String(v)])
  );
}

function isAbortSignal(value: unknown): value is AbortSignal {
  return (
    typeof value === "object" &&
    value !== null &&
    "aborted" in value &&
    typeof (value as AbortSignal).aborted === "boolean" &&
    typeof (value as AbortSignal).addEventListener === "function"
  );
}

export const fetcher = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    if (process.env.USE_FETCH === "true") {
      const { headers, signal, ...rest } = config || {};
      const res = await fetch(`http://localhost${url}`, {
        method: "GET",
        headers: normalizeHeaders(headers),
        signal: isAbortSignal(signal) ? signal : undefined,
        ...rest,
      });
      if (!res.ok) {
        const error = await handleFetchError(res);
        throw error;
      }
      return res.json();
    } else {
      const response = await api.get(url, config);
      return response.data;
    }
  },
  post: async <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    if (process.env.USE_FETCH === "true") {
      const { headers, signal, ...rest } = config || {};
      const res = await fetch(`http://localhost${url}`, {
        method: "POST",
        headers: normalizeHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
        signal: isAbortSignal(signal) ? signal : undefined,
        ...rest,
      });
      if (!res.ok) {
        const error = await handleFetchError(res);
        throw error;
      }
      return res.json();
    } else {
      const response = await api.post(url, data, config);
      return response.data;
    }
  },
  put: async <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    if (process.env.USE_FETCH === "true") {
      const { headers, signal, ...rest } = config || {};
      const res = await fetch(`http://localhost${url}`, {
        method: "PUT",
        headers: normalizeHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
        signal: isAbortSignal(signal) ? signal : undefined,
        ...rest,
      });
      if (!res.ok) {
        const error = await handleFetchError(res);
        throw error;
      }
      return res.json();
    } else {
      const response = await api.put(url, data, config);
      return response.data;
    }
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    if (process.env.USE_FETCH === "true") {
      const { headers, signal, ...rest } = config || {};
      const res = await fetch(`http://localhost${url}`, {
        method: "DELETE",
        headers: normalizeHeaders(headers),
        signal: isAbortSignal(signal) ? signal : undefined,
        ...rest,
      });
      if (!res.ok) {
        const error = await handleFetchError(res);
        throw error;
      }
      return res.json();
    } else {
      const response = await api.delete(url, config);
      return response.data;
    }
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
