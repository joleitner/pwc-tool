import { notifications } from "@mantine/notifications";

export const showNotification = (
  title: string,
  message: string,
  type: "success" | "error",
  close?: number
) => {
  notifications.show({
    title,
    message,
    color: type === "success" ? "green" : "red",
    autoClose: close || type === "success" ? undefined : 8000,
    position: "top-center",
  });
};
