import { notifications } from "@mantine/notifications";

export const showNotification = (title: string, message: string, type: "success" | "error") => {

    notifications.show({
        title,
        message,
        color: type === "success" ? "green" : "red",
        autoClose: type === "success" ? undefined : 8000,
        position: "top-center",
    })
};