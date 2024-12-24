import { getUsers } from "@/actions/admin";
import { getAuthUser } from "@/actions/auth";
import { AddRegistrationForm } from "@/components/Admin/AddRegistrationForm";
import { Header } from "@/components/Header/Header";
import { Container, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function AddRegistration() {
  const user = await getAuthUser();

  if (user?.role !== "admin") {
    redirect("/admin/login");
  }

  const users = await getUsers();

  return (
    <>
      <Header admin />
      <Container size="md">
        <Title order={2} size="h3">
          Add registration
        </Title>
        <AddRegistrationForm users={users!} />
      </Container>
    </>
  );
}
