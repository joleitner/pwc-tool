"use client";

import { showNotification } from "@/utils/showNotification";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
  TextInput,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { DataPrivacyModal } from "../DataPrivacy/DataPrivacyModal";
import { inviteParticipant } from "@/actions/auth";

export const ParticapteForm = ({
  setRegistered,
}: {
  setRegistered: (value: boolean) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations("ParticipateForm");

  const form = useForm({
    initialValues: {
      email: "",
      consent: false,
      dataPrivacy: false,
    },
    validate: {
      email: isEmail(t("emailValidation")),
      consent: (value) => (value ? null : t("consentValidation")),
      dataPrivacy: (value) => (value ? null : t("dataPrivacyValidation")),
    },
  });

  const handleSubmit = async (values: {
    email: string;
    consent: boolean;
    dataPrivacy: boolean;
  }) => {
    if (form.isValid()) {
      const { error } = await inviteParticipant(values.email);
      if (error) {
        showNotification(t("errorTitle"), t("errorText"), "error");
      } else {
        setRegistered(true);
      }
    }
  };

  return (
    <>
      <Box>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            withAsterisk
            placeholder="example@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <Checkbox
            mt="md"
            label={t("consent")}
            key={form.key("consent")}
            {...form.getInputProps("consent", { type: "checkbox" })}
          />
          <Checkbox
            mt="md"
            label={
              <Text size="sm">
                {t("dataPrivacy1")}
                <Anchor
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  c="indigo"
                >
                  {t("dataPrivacy2")}
                </Anchor>{" "}
                {t("dataPrivacy3")}
              </Text>
            }
            key={form.key("dataPrivacy")}
            {...form.getInputProps("dataPrivacy", { type: "checkbox" })}
          />

          <Flex justify="center" mt="md">
            <Button type="submit" disabled={!form.isValid()}>
              {t("submit")}
            </Button>
          </Flex>
        </form>
      </Box>
      <DataPrivacyModal opened={opened} onClose={close} />
    </>
  );
};
