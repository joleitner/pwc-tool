"use client";

import { createNewSuggestion, updateSuggestion } from "@/actions/helper";
import { resizeImage } from "@/utils/resizeImage";
import { showNotification } from "@/utils/showNotification";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  FileButton,
  Flex,
  Group,
  Loader,
  Paper,
  ScrollAreaAutosize,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const HelperForm = () => {
  const t = useTranslations("Helper");
  const [files, setFiles] = useState<File[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<string>("");

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const handleSubmit = async () => {
    if (emails.length > 0 && files.length > 0) {
      // 1. create new suggestion
      setUploading(true);
      setUploadingStatus("Creating new survey suggestion");
      const { data: suggestion, error } = await createNewSuggestion({
        emails,
      });
      if (error) {
        showNotification("Error creating suggestion", error.message, "error");
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
          const filename = `suggestion${suggestion.id}/${
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

      // Add image paths
      setUploadingStatus("Add image paths to suggestion");
      const { error: updateError } = await updateSuggestion(suggestion.id, {
        images: filenames,
      });

      if (updateError) {
        showNotification(
          "Error adding images to suggestion",
          updateError.message,
          "error"
        );
        return;
      }

      setUploading(false);
      setUploadingStatus("");
      showNotification("Survey suggestion created", "Thank you!", "success");

      setFiles([]);
      setEmails([]);
    }
  };

  return (
    <Container size="md" style={{ minHeight: "calc(100vh - 110px - 210px)" }}>
      <Container mb="md">
        <Title order={3} mb="md" ta="center">
          {t("title")}
        </Title>
        <Text>{t("text")}</Text>
        <ScrollAreaAutosize mah={450} offsetScrollbars>
          <Stack gap={5} py="xs">
            {emails.map((mail) => (
              <Paper py={3} px="md" withBorder key={mail}>
                <Flex justify="space-between" align="center">
                  <Text>{mail}</Text>
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    color="var(--mantine-color-red-8)"
                    onClick={() => {
                      setEmails((prev) => {
                        return prev.filter((email) => email !== mail);
                      });
                    }}
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
              </Paper>
            ))}
          </Stack>
        </ScrollAreaAutosize>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="example@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <Flex justify="center" my="lg">
            <Button
              onClick={() => {
                setEmails((prev) => {
                  return [...prev, form.values.email];
                });
                form.reset();
              }}
              px="xl"
            >
              {t("add")}
            </Button>
          </Flex>

          {files.length > 0 ? (
            <Flex justify="center">
              <Box w={500}>
                <Carousel my="lg" withIndicators height={250}>
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
          ) : (
            <Space h="md" />
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
                {(props) => <Button {...props}>{t("upload")}</Button>}
              </FileButton>
            ) : (
              <Button
                type="submit"
                px="xl"
                disabled={uploading || emails.length <= 1}
              >
                {t("submit")}
              </Button>
            )}
          </Group>
        </form>
      </Container>
    </Container>
  );
};
