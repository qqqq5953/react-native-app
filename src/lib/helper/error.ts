import { AxiosError } from "axios";
import {
  toastify,
  toastifyUnexpectedError,
} from "../../components/common/NaviToast";
import { ApiErrorResponse } from "../../types/api";

export type DetailErrorHandler = (
  detail: { type: string; msg: string },
  error: AxiosError<ApiErrorResponse>
) => void;

// Flattened structure - use detail type directly as key
export type DetailErrorHandlers = {
  [detailType: string]: DetailErrorHandler;
};

export type NonAxiosErrorHandler = (error: unknown) => void;
export type NonDetailErrorHandler = (
  error: AxiosError<ApiErrorResponse>
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
  if (!isError) return;

  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 422) {
      toastifyUnexpectedError(`${status}: ${error.message}`);
      return;
    }

    handleAxiosError({
      error,
      allDetailTypes,
      alreadyHandledDetailTypes,
      detailHandlers,
      nonDetail,
    });
  } else if (nonAxios) {
    if ("handler" in nonAxios && nonAxios.handler) {
      nonAxios.handler(error);
    } else if ("message" in nonAxios && nonAxios.message) {
      toastifyUnexpectedError(nonAxios.message);
    }
  } else {
    // For non-Axios errors with no specific handler
    toastifyUnexpectedError(getErrorMessage(error));
  }
}

function handleAxiosError({
  error,
  allDetailTypes,
  alreadyHandledDetailTypes = [],
  detailHandlers,
  nonDetail,
}: {
  error: AxiosError<ApiErrorResponse>;
  allDetailTypes: DetailType[];
  alreadyHandledDetailTypes?: DetailType[];
  detailHandlers?: DetailErrorHandlers;
  nonDetail?: NonDetailOption;
}) {
  const detail = error.response?.data.detail;

  if (isErrorDetail(detail)) {
    const detailType = detail.type;

    if (allDetailTypes.includes(detailType)) {
      if (detailHandlers?.[detailType]) {
        detailHandlers[detailType](detail, error);
      } else if (!alreadyHandledDetailTypes.includes(detailType)) {
        toastify({
          variant: "error",
          title: detail.msg,
        });
      }
    } else {
      toastify({
        variant: "error",
        title: detail.msg,
      });
    }
  } else if (nonDetail) {
    // Handle unhandled primitive error with {detail:XXX} thrown by python
    if ("handler" in nonDetail && nonDetail.handler) {
      nonDetail.handler(error);
    } else if ("message" in nonDetail && nonDetail.message) {
      toastifyUnexpectedError(nonDetail.message);
    }
  } else {
    toastifyUnexpectedError(error.message);
  }
}

export function isAxiosError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return error instanceof AxiosError;
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

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
