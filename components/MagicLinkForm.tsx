"use client";

import { resendOTPLink } from "@/actions/admin";
import { showNotification } from "@/utils/showNotification";
import { Box, BoxProps, Button, Flex, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const MagicLinkForm = ({ ...props }: Partial<BoxProps>) => {
  const t = useTranslations("Login");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Bitte gib eine gültige Email-Adresse ein."),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    if (form.isValid() && !loading) {
      setLoading(true);
      const { error } = await resendOTPLink(values.email, next || "/", locale);

      if (error) {
        showNotification(t("errorTitle"), t("errorText"), "error");
        return;
      } else {
        showNotification(t("successTitle"), t("successText"), "success");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    showNotification(
      t("initialErrorTitle"),
      t("initialErrorText"),
      "error",
      10000
    );
  }, []);

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
            <Button
              type="submit"
              disabled={!form.isValid() || loading}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};
