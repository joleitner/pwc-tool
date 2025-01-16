"use client";

import { sendRefinementEmail } from "@/actions/refinement";
import { User } from "@/types";
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
  users: User[];
};

export const RefinementForm = ({ users, ...props }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      users: [] as string[],
    },
    validate: {
      users: isNotEmpty("Select a user"),
    },
  });

  const getUsers = (ids: string[]) => {
    return ids.map((id) => {
      const user = users.find((user) => user.id === id)!;
      return { email: user.name!, locale: user.locale };
    });
  };

  const handleSubmit = async (values: { users: string[] }) => {
    if (form.isValid()) {
      const refinementUsers = getUsers(values.users);
      setLoading(true);
      await sendRefinementEmail(refinementUsers);
      setLoading(false);
      showNotification("Refinement Emails sent", "Success", "success");
      redirect("/admin");
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MultiSelect
          label="Select users to send refinement emails"
          data={users.map((user) => ({
            value: user.id.toString(),
            label: user.name!,
          }))}
          checkIconPosition="right"
          leftSection={<IconUsersGroup size={18} />}
          searchable
          key={form.key("users")}
          {...form.getInputProps("users")}
        />
        <Flex justify="center" mt="md" gap="lg">
          {form.getValues().users.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => {
                form.setFieldValue("users", []);
              }}
            >
              Remove all
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                form.setFieldValue(
                  "users",
                  users.map((user) => user.id.toString())
                );
              }}
            >
              Add all
            </Button>
          )}

          <Button type="submit" px="xl">
            Send refinement emails
          </Button>
        </Flex>
      </form>
      {loading && (
        <Center my="lg">
          <Stack align="center">
            <Loader type="bars" />
            <Text>Sending refinement emails</Text>
          </Stack>
        </Center>
      )}
    </Box>
  );
};
