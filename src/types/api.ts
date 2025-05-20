import { DetailType } from "../lib/helper/error";

export type ApiErrorResponse = {
  detail:
    | string
    | {
        type: DetailType;
        msg: string;
      };
};

export type ApiResponse<T> = {
  data: T;
};
