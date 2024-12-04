"use client";

import { resendOTPLink } from "@/actions/auth";
import { showNotification } from "@/utils/showNotification";
import { Box, BoxProps, Button, Flex, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useSearchParams } from "next/navigation";

export const MagicLinkForm = ({ ...props }: Partial<BoxProps>) => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const survey_id = searchParams.get("id");

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Bitte gib eine gültige Email-Adresse ein."),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    if (form.isValid()) {
      const { error } = await resendOTPLink(
        values.email,
        next ? next : `/survey?id=${survey_id}`
      );

      showNotification(
        "Email wurde erfolgreich versendet",
        "itte überprüfe deine Email.",
        "success"
      );
    }
  };

  return (
    <>
      <Box {...props}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            withAsterisk
            placeholder="example@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <Flex justify="center" mt="md">
            <Button type="submit" disabled={!form.isValid()}>
              Teilnehmen
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};
