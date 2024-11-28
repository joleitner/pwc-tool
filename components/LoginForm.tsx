"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Box,
  rem,
} from "@mantine/core";
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
    console.log(values);
  };

  return (
    <Box w={rem(300)}>
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
        <Group justify="apart" mt="md">
          <Button type="submit">Login</Button>
          <Text component="a" size="sm">
            Forgot password?
          </Text>
        </Group>
      </form>
    </Box>
  );
};
