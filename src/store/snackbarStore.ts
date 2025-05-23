import { create } from "zustand";

export type SnackbarState = {
  snackbar: {
    visible: boolean;
    title: string;
    message?: string;
    variant: "desc" | "info" | "success" | "warning" | "error";
  };
  setSnackbar: (snackbar: SnackbarState["snackbar"]) => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => {
  return {
    snackbar: {
      visible: false,
      title: "",
      message: "",
      variant: "success",
    },
    setSnackbar: (snackbar) => {
      set(() => ({ snackbar }));
    },
  };
});
