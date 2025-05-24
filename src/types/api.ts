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

export type FetchErrorResponse = {
  body: {
    detail:
      | string
      | {
          type: DetailType;
          msg: string;
        }
      | undefined;
  };
  message: string;
  status: number;
};
