"use client";

import { adminLogin } from "@/actions/auth";
import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

export const LoginForm = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Ungültige Email"),
      password: isNotEmpty("Bitte gib dein Passwort ein"),
    },
  });

  const handleSubmit = (values: { email: string; password: string }) => {
    if (form.isValid()) {
      adminLogin(values.email, values.password);
    }
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          withAsterisk
          placeholder="example@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
        />
        <Group justify="center" mt="md">
          <Button type="submit" px="xl">
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
};
