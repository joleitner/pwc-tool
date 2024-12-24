"use client";

import { signupParticipants } from "@/actions/admin";
import { deleteSuggestion } from "@/actions/helper";
import { createImageEntries, createNewSurvey } from "@/actions/survey";
import { Registrations, Suggestion } from "@/types";
import { showNotification } from "@/utils/showNotification";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import {
  Box,
  BoxProps,
  Button,
  Center,
  Group,
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
  possibleParticipants: Registrations[];
  suggestion: Suggestion;
};

export const CreateSuggestionForm = ({
  possibleParticipants,
  suggestion,
  ...props
}: Props) => {
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<string>("");

  const emailsLowercase = suggestion.emails.map((email: string) =>
    email.toLowerCase()
  );

  const form = useForm({
    initialValues: {
      participants: possibleParticipants
        .filter((participant) =>
          emailsLowercase.includes(participant.email.toLowerCase())
        )
        .map((participant) => participant.id),
    },
    validate: {
      participants: isNotEmpty("Choose at least one participant"),
    },
  });

  const getFinalParticipants = (participants: string[]): Registrations[] => {
    return participants.map(
      (id) => possibleParticipants.find((participant) => participant.id === id)!
    );
  };

  const handleSubmit = async (values: { participants: string[] }) => {
    if (form.isValid()) {
      // 1. create new survey
      setUploading(true);
      setUploadingStatus("Creating survey");
      const { data: survey, error } = await createNewSurvey({
        participant_count: values.participants.length,
        image_count: suggestion.images!.length,
      });
      if (error) {
        showNotification("Error creating survey", error.message, "error");
        return;
      }

      // 2. move images
      setUploadingStatus("Moving images");
      const filenames: string[] = [];
      const movedFiles = await Promise.all(
        suggestion.images!.map((path, index) => {
          const ext = path.split(".").pop();
          const newPath = `scene${survey.id}/${
            index + 1
          }.${ext?.toLowerCase()}`;
          filenames.push(newPath);
          return supabase.storage.from("group-images").move(path, newPath);
        })
      );
      if (movedFiles.some((file) => file.error)) {
        showNotification(
          "Error moving files",
          "Something went wrong while moving your files",
          "error"
        );
        return;
      }

      // 3. signup all participants as users
      setUploadingStatus("Signing up participants and sending emails");
      const finalParticipants = getFinalParticipants(values.participants);
      const { error: signUpError } = await signupParticipants(
        finalParticipants,
        survey!.id
      );
      if (signUpError) {
        showNotification(
          "Error signing up participants",
          "Something went wrong while signing up participants",
          "error"
        );
        return;
      }

      // 4. create image entries
      setUploadingStatus("Creating image entries");
      const metadata = {
        participants: finalParticipants.map((user) => user.id),
      };
      const { error: imageError } = await createImageEntries(
        survey!.id,
        filenames,
        metadata
      );
      if (imageError) {
        showNotification(
          "Error creating image entries",
          imageError.message,
          "error"
        );
        return;
      }

      // 5. delete suggestion
      setUploadingStatus("Remove suggestion");
      const { error: deleteError } = await deleteSuggestion(suggestion.id);
      if (deleteError) {
        showNotification(
          "Error deleting suggestion",
          deleteError.message,
          "error"
        );
        return;
      }

      setUploading(false);
      setUploadingStatus("");
      showNotification(
        "Survey created",
        "Survey was successfully created",
        "success"
      );
      redirect("/admin");
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MultiSelect
          label="Select all participants"
          data={possibleParticipants.map((participant) => ({
            value: participant.id.toString(),
            label: participant.email,
          }))}
          checkIconPosition="right"
          leftSection={<IconUsersGroup size={18} />}
          key={form.key("participants")}
          {...form.getInputProps("participants")}
        />

        {uploading && (
          <Center my="lg">
            <Stack align="center">
              <Loader type="bars" />
              <Text>{uploadingStatus}</Text>
            </Stack>
          </Center>
        )}

        <Group justify="center" mt="md">
          <Button type="submit" px="xl" disabled={uploading}>
            Create survey
          </Button>
        </Group>
      </form>
    </Box>
  );
};
