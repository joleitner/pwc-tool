import { getAuthUser } from "@/actions/auth";
import {
  getAvailableUsers,
  getResponselessParticipants,
} from "@/actions/refinement";
import { RefinementForm } from "@/components/Admin/RefinementForm";
import { ReminderForm } from "@/components/Admin/ReminderForm";
import { Header } from "@/components/Header/Header";
import { Container, Divider, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function AdminRefinement() {
  const user = await getAuthUser();

  if (user?.role !== "admin") {
    redirect("/admin/login");
  }

  const users = await getAvailableUsers();
  const participants = await getResponselessParticipants();

  return (
    <>
      <Header admin />
      <Container size="md">
        <Title order={2} size="h3" mb="lg">
          Send Refinement Emails
        </Title>
        <RefinementForm users={users!} />
        <Divider my={50} />
        <Title order={2} size="h3" mb="lg">
          Send Reminders
        </Title>
        <ReminderForm participants={participants!} />
      </Container>
    </>
  );
}
