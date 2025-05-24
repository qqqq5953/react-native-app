import { useSnackbarStore } from "@/store/snackbarStore";
import { AxiosError } from "axios";
import { ApiErrorResponse, FetchErrorResponse } from "../../types/api";
import { FetchError } from "../api";

export type DetailErrorHandler = (
  detail: { type: string; msg: string },
  error: AxiosError<ApiErrorResponse> | FetchErrorResponse
) => void;

// Flattened structure - use detail type directly as key
export type DetailErrorHandlers = {
  [detailType: string]: DetailErrorHandler;
};

export type NonAxiosErrorHandler = (error: unknown) => void;
export type NonDetailErrorHandler = (
  status: number | undefined
  // error: AxiosError<ApiErrorResponse> | FetchErrorResponse
) => void;

// Helper type for creating an exclusive-or type
type XOR<T, U> =
  | (T & { [K in keyof U]?: never })
  | (U & { [K in keyof T]?: never });

// XOR types that ensure only one option can be specified
export type NonDetailOption = XOR<
  { handler: NonDetailErrorHandler },
  { message: string }
>;
export type NonAxiosOption = XOR<
  { handler: NonAxiosErrorHandler },
  { message: string }
>;

export type DetailType = (typeof DETAIL_TYPE)[keyof typeof DETAIL_TYPE][number];

export const ERROR_TYPE = {
  SUPER_LINK_EXPIRED: "super_link_expired",
  SUPER_LINK_NOT_FOUND: "super_link_not_found",
  INVALID_CREDENTIAL: "invalid_credential",
  INVALID_EMAIL: "invalid_email",
  FAILED_TO_DELIVER_EMAIL: "failed_to_deliver_email",
  PASSWORD_RESET_REQUIRED: "password_reset_required",
  PASSWORD_CONFIRM_ERROR: "password_confirm_error",
  USER_ALREADY_LOGGED_IN: "user_already_logged_in",
  USER_ALREADY_LOGGED_OUT: "user_already_logged_out",
} as const;

export const DETAIL_TYPE = {
  400: [
    ERROR_TYPE.INVALID_EMAIL,
    ERROR_TYPE.FAILED_TO_DELIVER_EMAIL,
    ERROR_TYPE.SUPER_LINK_EXPIRED,
    ERROR_TYPE.PASSWORD_CONFIRM_ERROR,
  ],
  403: [
    ERROR_TYPE.INVALID_CREDENTIAL,
    ERROR_TYPE.PASSWORD_RESET_REQUIRED,
    ERROR_TYPE.USER_ALREADY_LOGGED_OUT,
  ],
  404: [ERROR_TYPE.SUPER_LINK_NOT_FOUND],
  409: [ERROR_TYPE.USER_ALREADY_LOGGED_IN],
} as const;

const setSnackbar = useSnackbarStore.getState().setSnackbar;

export function handleError({
  error,
  isError = true,
  allDetailTypes, // list down all detail types
  alreadyHandledDetailTypes = [], // will skip checks for specified detail types
  detailHandlers, // handle documented errors with detail.type as key
  nonDetail, // handle primitive errors
  nonAxios, // handle non-Axios errors
}: {
  error: unknown;
  isError?: boolean;
  allDetailTypes: DetailType[];
  alreadyHandledDetailTypes?: DetailType[];
  detailHandlers?: DetailErrorHandlers;
  nonDetail?: NonDetailOption;
  nonAxios?: NonAxiosOption;
}): void {
  console.log("error", JSON.stringify(error, null, 2));

  if (!isError) return;

  if (isAxiosError(error) || isFetchError(error)) {
    const status = isAxiosError(error) ? error.response?.status : error.status;

    if (status === 422) {
      setSnackbar({
        visible: true,
        variant: "error",
        title: `${status}: ${error.message}`,
      });
      return;
    }

    handleAxiosError({
      error,
      detail: getDetail(error),
      allDetailTypes,
      alreadyHandledDetailTypes,
      detailHandlers,
      nonDetail,
    });
  } else if (nonAxios) {
    if ("handler" in nonAxios && nonAxios.handler) {
      nonAxios.handler(error);
    } else if ("message" in nonAxios && nonAxios.message) {
      setSnackbar({
        visible: true,
        variant: "error",
        title: nonAxios.message,
      });
    }
  } else {
    // For non-Axios errors with no specific handler
    setSnackbar({
      visible: true,
      variant: "error",
      title: getErrorMessage(error),
    });
  }
}

function handleAxiosError({
  error,
  detail,
  allDetailTypes,
  alreadyHandledDetailTypes = [],
  detailHandlers,
  nonDetail,
}: {
  error: AxiosError<ApiErrorResponse> | FetchErrorResponse;
  detail:
    | string
    | {
        type: DetailType;
        msg: string;
      }
    | undefined;
  allDetailTypes: DetailType[];
  alreadyHandledDetailTypes?: DetailType[];
  detailHandlers?: DetailErrorHandlers;
  nonDetail?: NonDetailOption;
}) {
  if (isErrorDetail(detail)) {
    const detailType = detail.type;

    if (allDetailTypes.includes(detailType)) {
      if (detailHandlers?.[detailType]) {
        detailHandlers[detailType](detail, error);
      } else if (!alreadyHandledDetailTypes.includes(detailType)) {
        setSnackbar({
          visible: true,
          variant: "error",
          title: detail.msg,
        });
      }
    } else {
      setSnackbar({
        visible: true,
        variant: "error",
        title: detail.msg,
      });
    }
  } else if (nonDetail) {
    // Handle unhandled primitive error with {detail:XXX} thrown by python
    if ("handler" in nonDetail && nonDetail.handler) {
      const status = isAxiosError(error)
        ? error.response?.status
        : error.status;
      nonDetail.handler(status);
    } else if ("message" in nonDetail && nonDetail.message) {
      setSnackbar({
        visible: true,
        variant: "error",
        title: nonDetail.message,
      });
    }
  } else {
    setSnackbar({
      visible: true,
      variant: "error",
      title: error.message,
    });
  }
}

export function isAxiosError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return error instanceof AxiosError;
}

export function isFetchError(error: any): error is {
  body: FetchErrorResponse["body"];
  status: number;
  message: string;
} {
  return (
    error && typeof error === "object" && "body" in error && "status" in error
  );
}

export function getDetail(
  error:
    | AxiosError<ApiErrorResponse>
    | {
        body: FetchErrorResponse["body"];
        status: number;
        message: string;
      }
) {
  return isAxiosError(error) ? error.response?.data.detail : error.body?.detail;
}

export function isErrorDetail(
  detail: unknown
): detail is { type: string; msg: string } {
  return (
    typeof detail === "object" &&
    detail !== null &&
    "type" in detail &&
    "msg" in detail
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data.detail;
    if (isErrorDetail(detail)) {
      return detail.msg;
    }
    return error.message;
  }

  if (error instanceof FetchError) {
    return error.body.detail.msg;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
