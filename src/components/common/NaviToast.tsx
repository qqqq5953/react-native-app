import React from 'react';

export type ToastProps = {
  variant: "desc" | "info" | "success" | "warning" | "error";
  id: string | number;
  title: string;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
};

export function toastify(props: Omit<ToastProps, "id">) {
  return (
    <div>toastify</div>
  )
}

export function toastifyUnexpectedError(description: string) {
  return (
    <div>toastifyUnexpectedError</div>
  )
}

export default function NaviToast() {
  return (
    <div>NaviToast</div>
  )
}
