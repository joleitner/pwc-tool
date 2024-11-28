"use client";

import { addParticipant } from "@/actions/survey";
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
import { redirect } from "next/navigation";
import { DataPrivacyModal } from "./DataPrivacyModal";

export const ParticapteForm = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: "",
      consent: false,
      dataPrivacy: false,
    },
    validate: {
      email: isEmail("Bitte geben Sie eine gültige Email-Adresse ein."),
      consent: (value) =>
        value ? null : "Bitte stimmen Sie den Teilnahmebedinungen zu.",
      dataPrivacy: (value) =>
        value
          ? null
          : "Bitte nehmen Sie die Datenschutzerklärung zur Kenntnis.",
    },
  });

  const handleSubmit = async (values: {
    email: string;
    consent: boolean;
    dataPrivacy: boolean;
  }) => {
    if (form.isValid()) {
      const { data, error } = await addParticipant(values.email);
      if (error) {
        alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
      } else {
        redirect("/");
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
            label="Ich habe die Bedingungen der Nutzerstudie gelesen und stimme den Teilnahmebedinungen zu."
            key={form.key("consent")}
            {...form.getInputProps("consent", { type: "checkbox" })}
          />
          <Checkbox
            mt="md"
            label={
              <Text size="sm">
                Ich habe die{" "}
                <Anchor onClick={open} c="blue">
                  Datenschutzerklärung
                </Anchor>{" "}
                zur Kenntnis genommen.
              </Text>
            }
            key={form.key("dataPrivacy")}
            {...form.getInputProps("dataPrivacy", { type: "checkbox" })}
          />

          <Flex justify="center" mt="md">
            <Button type="submit" disabled={!form.isValid()}>
              Teilnehmen
            </Button>
          </Flex>
        </form>
      </Box>
      <DataPrivacyModal opened={opened} onClose={close} />
    </>
  );
};
