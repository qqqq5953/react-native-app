import { getDetail, getErrorMessage, isErrorDetail, isFetchError } from '@/lib/helper/error';
import { ApiErrorResponse, FetchErrorResponse } from '@/types/api';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { Text } from 'react-native';
import Alert from './Alert';

type Props = {
  useAlert?: boolean;
  mutation: UseMutationResult<
    null,
    AxiosError<ApiErrorResponse, unknown> | FetchErrorResponse,
    {
      data?: any;
      url: string;
      config?: AxiosRequestConfig;
    }
  >
}

export default function ErrorMessage(props: Props) {
  const errorDetail = isAxiosError(props.mutation.error) || isFetchError(props.mutation.error)
    ? getDetail(props.mutation.error)
    : '';

  return <>
    {props.mutation.isError
      && errorDetail
      && isErrorDetail(errorDetail)
      && (
        props.useAlert
          ? <Alert
            type='error'
            className='mb-6 w-full'
            message={getErrorMessage(props.mutation.error) ?? 'An error occurred'}
          />
          : <Text className='text-red-500 text-sm'>{errorDetail.msg ?? 'An error occurred'}</Text>
      )
    }
  </>
}
