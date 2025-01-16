"use client";

import { sendReminderEmail } from "@/actions/refinement";
import { showNotification } from "@/utils/showNotification";
import {
  Box,
  BoxProps,
  Button,
  Center,
  Flex,
  Loader,
  MultiSelect,
  Stack,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconUsersGroup } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = Partial<BoxProps> & {
  participants: {
    survey: { id: number; public_id: string };
    user: { id: string; name: string; locale: string };
  }[];
};

export const ReminderForm = ({ participants, ...props }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      participants: [] as string[],
    },
    validate: {
      participants: isNotEmpty("Select a participant"),
    },
  });

  const getParticipants = (ids: string[]) => {
    return ids.map((id) => {
      const participant = participants.find((p) => p.user.id === id)!;
      return {
        survey_id: participant.survey.public_id,
        email: participant.user.name!,
        locale: participant.user.locale,
      };
    });
  };

  const handleSubmit = async (values: { participants: string[] }) => {
    if (form.isValid()) {
      const participantsToRemind = getParticipants(values.participants);
      setLoading(true);
      await sendReminderEmail(participantsToRemind);
      setLoading(false);
      showNotification("Reminder send", "Success", "success");
      redirect("/admin");
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MultiSelect
          label="Select users to send refinement emails"
          data={participants.map((p) => ({
            value: p.user.id.toString(),
            label: p.user.name!,
          }))}
          checkIconPosition="right"
          leftSection={<IconUsersGroup size={18} />}
          searchable
          key={form.key("participants")}
          {...form.getInputProps("participants")}
        />
        <Flex justify="center" mt="md" gap="lg">
          {form.getValues().participants.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => {
                form.setFieldValue("participants", []);
              }}
            >
              Remove all
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                form.setFieldValue(
                  "participants",
                  participants.map((p) => p.user.id.toString())
                );
              }}
            >
              Add all
            </Button>
          )}

          <Button type="submit" px="xl">
            Send reminder emails
          </Button>
        </Flex>
      </form>
      {loading && (
        <Center my="lg">
          <Stack align="center">
            <Loader type="bars" />
            <Text>Sending reminder emails</Text>
          </Stack>
        </Center>
      )}
    </Box>
  );
};
