"use client";

import { signupParticipants } from "@/actions/admin";
import { createImageEntries, createNewSurvey } from "@/actions/survey";
import { Registrations } from "@/types";
import { resizeImage } from "@/utils/resizeImage";
import { showNotification } from "@/utils/showNotification";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  Box,
  BoxProps,
  Button,
  Center,
  FileButton,
  Flex,
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
};

export const CreateSurveyForm = ({ possibleParticipants, ...props }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<string>("");

  const form = useForm({
    initialValues: {
      participants: possibleParticipants.map((participant) => participant.id),
    },
    validate: {
      participants: isNotEmpty("Wählen Sie mindestens einen Teilnehmer aus"),
    },
  });

  const getFinalParticipants = (participants: string[]): Registrations[] => {
    return participants.map(
      (id) => possibleParticipants.find((participant) => participant.id === id)!
    );
  };

  const handleSubmit = async (values: { participants: string[] }) => {
    if (form.isValid() && files.length > 0) {
      // 1. create new survey
      setUploading(true);
      setUploadingStatus("Creating survey");
      const { data: survey, error } = await createNewSurvey({
        participant_count: values.participants.length,
        image_count: files.length,
      });
      if (error) {
        showNotification("Error creating survey", error.message, "error");
        return;
      }

      // 2. resizing images
      setUploadingStatus("Resizing images");
      const resizedFiles = await Promise.all(
        files.map((file) =>
          resizeImage(file, { maxSize: 1920, type: "image/webp", quality: 0.9 })
        )
      );

      // 3. upload images
      setUploadingStatus("Uploading images");
      const filenames: string[] = [];
      const uploadedFiles = await Promise.all(
        resizedFiles.map((file, index) => {
          const ext = file.name.split(".").pop();
          const filename = `scene${survey.id}/${
            index + 1
          }.${ext?.toLowerCase()}`;
          filenames.push(filename);
          return supabase.storage.from("group-images").upload(filename, file);
        })
      );
      if (uploadedFiles.some((file) => file.error)) {
        showNotification(
          "Error uploading files",
          "Something went wrong while uploading your files",
          "error"
        );
        return;
      }

      // 4. signup all participants as users
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

      // 5. create image entries
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
        {files.length > 0 && (
          <Flex justify="center">
            <Box w={500}>
              <Carousel
                my="lg"
                withIndicators
                height={250}
                // slideSize="100%"
                // slideGap="md"
              >
                {files.map((file, index) => (
                  <CarouselSlide key={index} w={300}>
                    <Center>
                      <img
                        src={URL.createObjectURL(file)}
                        height={250}
                        alt={`group image ${index}`}
                      />
                    </Center>
                  </CarouselSlide>
                ))}
              </Carousel>
            </Box>
          </Flex>
        )}

        {uploading && (
          <Center my="lg">
            <Stack align="center">
              <Loader type="bars" />
              <Text>{uploadingStatus}</Text>
            </Stack>
          </Center>
        )}

        <Group justify="center" mt="md">
          {files.length <= 0 ? (
            <FileButton
              onChange={(files) => setFiles(files)}
              accept="image/png,image/jpeg"
              multiple
            >
              {(props) => <Button {...props}>Add group images</Button>}
            </FileButton>
          ) : (
            <Button type="submit" px="xl" disabled={uploading}>
              Create survey
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
};
