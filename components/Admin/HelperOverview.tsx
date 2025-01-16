"use client";

import { addHelper } from "@/actions/admin";
import { getHelper, removeHelper } from "@/actions/helper";
import { User } from "@/types";
import { showNotification } from "@/utils/showNotification";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Flex,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

type Props = Partial<BoxProps> & {
  initial?: User[];
};

export const HelperOverview = ({ initial, ...props }: Partial<Props>) => {
  const [helper, setHelper] = useState(initial || []);
  const supabase = createClientSupabase();

  const onUpdate = async () => {
    const { data, error } = await getHelper();
    if (!error) {
      setHelper(data);
    }
  };

  supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      onUpdate
    )
    .subscribe();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Please enter a valid email address"),
    },
  });

  const handleSubmit = async () => {
    if (form.isValid()) {
      const link = await addHelper(form.values.email);
      if (link) {
        navigator.clipboard.writeText(link);
        showNotification("Helper added", "Link copied to clipboard", "success");
      } else {
        showNotification("Error", "Could not add helper", "error");
      }
    }
  };

  return (
    <>
      <Box {...props}>
        <Flex justify="space-between" mr="md" align="center" mb="md">
          <Title order={2}>Helper</Title>
        </Flex>
        <ScrollAreaAutosize mah={450} offsetScrollbars>
          <Stack gap="md">
            {helper.map((user) => (
              <Paper py="xs" px="lg" withBorder key={user.id}>
                <Flex justify="space-between" align="center">
                  <Text>{user.name}</Text>
                  <ActionIcon
                    size="lg"
                    variant="subtle"
                    color="var(--mantine-color-red-8)"
                    onClick={() => {
                      removeHelper(user.id);
                    }}
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </Flex>
              </Paper>
            ))}
          </Stack>
        </ScrollAreaAutosize>
        <TextInput
          label="Email"
          withAsterisk
          placeholder="example@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <Flex justify="center" my="md">
          <Button onClick={handleSubmit}>Add Helper</Button>
        </Flex>
      </Box>
    </>
  );
};
