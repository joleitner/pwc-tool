import { Container, Title, Text } from "@mantine/core";
import { useAppContext } from "../AppProvider";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { Header } from "@/components/Header/Header";
import { ParticipantOverview } from "@/components/ParticipantOverview";

export default async function AdminPanel() {
  const user = await getAuthUser();

  if (user?.admin === false) {
    redirect("/admin/login");
  }

  return (
    <>
      <Header />
      <Container size="md">
        <Title order={2}>Admin Panel</Title>
        <ParticipantOverview my="lg" />
      </Container>
    </>
  );
}
