"use client";

import { addRegistrations } from "@/actions/admin";
import { showNotification } from "@/utils/showNotification";
import { Box, BoxProps, Button, Flex, MultiSelect } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { User } from "@supabase/supabase-js";
import { IconUsersGroup } from "@tabler/icons-react";
import { redirect } from "next/navigation";

type Props = Partial<BoxProps> & {
  users: User[];
};

export const AddRegistrationForm = ({ users, ...props }: Props) => {
  const form = useForm({
    initialValues: {
      users: [],
    },
    validate: {
      users: isNotEmpty("Select a user"),
    },
  });

  const getUsers = (ids: string[]): { id: string; email: string }[] => {
    return ids.map((id) => {
      const user = users.find((user) => user.id === id)!;
      return { id: user.id, email: user.email! };
    });
  };

  const handleSubmit = async (values: { users: string[] }) => {
    if (form.isValid()) {
      const finalUsers = getUsers(values.users);
      console.log("users", finalUsers);
      const { error } = await addRegistrations(finalUsers);

      if (error) {
        showNotification("Failed to add registrations", "Failed", "error");
      } else {
        showNotification("Registrations added", "Success", "success");
        redirect("/admin");
      }
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MultiSelect
          label="Select all users to for new survey"
          data={users.map((user) => ({
            value: user.id.toString(),
            label: user.email!,
          }))}
          checkIconPosition="right"
          leftSection={<IconUsersGroup size={18} />}
          key={form.key("users")}
          {...form.getInputProps("users")}
        />
        <Flex justify="center" mt="md">
          <Button type="submit" px="xl">
            Add registrations
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
