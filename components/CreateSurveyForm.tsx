"use client";

import { signupParticipants } from "@/actions/admin";
import {
  createImageEntries,
  createNewSurvey,
  createPairwiseComparisonEntries,
} from "@/actions/survey";
import { Registrations } from "@/types";
import { showNotification } from "@/utils/showNotification";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  Box,
  BoxProps,
  Button,
  Center,
  Container,
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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);

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
      const { data: survey, error } = await createNewSurvey({
        participant_count: values.participants.length,
        image_count: files.length,
      });
      if (error) {
        showNotification("Error creating survey", error.message, "error");
        return;
      }

      // 2. upload images
      setUploading(true);
      const filenames: string[] = [];
      const uploadedFiles = await Promise.all(
        files.map((file, index) => {
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

      // 3. signup all participants as users
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
      const metadata = {
        participants: finalParticipants.map((user) => user.id),
      };
      const { data: images, error: imageError } = await createImageEntries(
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

      // 5. create pairwise comparison entries
      const { error: pwcError } = await createPairwiseComparisonEntries(
        survey!.id,
        images.map((image) => image.id)
      );
      if (pwcError) {
        showNotification(
          "Error creating pairwise comparisions",
          pwcError.message,
          "error"
        );
        return;
      }

      // 6. invite participants to survey

      setUploading(false);
      showNotification(
        "Survey created",
        "Survey was successfully created",
        "success"
      );
      redirect("/admin/");
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MultiSelect
          label="Wähle alle Teilnehmer aus"
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
                      <img src={URL.createObjectURL(file)} height={250} />
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
              <Text>Uploading images</Text>
            </Stack>
          </Center>
        )}

        <Group justify="center" mt="md">
          {files.length <= 0 ? (
            <FileButton
              onChange={(files) => {
                setFiles(files);
                // setPreviewImages(
                //   files.map((file) => URL.createObjectURL(file))
                // );
              }}
              accept="image/png,image/jpeg"
              multiple
            >
              {(props) => <Button {...props}>Gruppenbilder auswählen</Button>}
            </FileButton>
          ) : (
            <Button type="submit" px="xl" disabled={uploading}>
              Umfrage erstellen
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
};
