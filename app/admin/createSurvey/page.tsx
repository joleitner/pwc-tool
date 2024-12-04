import { getAuthUser } from "@/actions/auth";
import { getParticipants } from "@/actions/survey";
import { CreateSurveyForm } from "@/components/CreateSurveyForm";
import { Header } from "@/components/Header/Header";
import { ParticipantOverview } from "@/components/ParticipantOverview";
import { Button, Container, Flex, Title } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateSurvey() {
  const user = await getAuthUser();

  if (user?.admin === false) {
    redirect("/admin/login");
  }

  const { data: participants } = await getParticipants();

  return (
    <>
      <Header />
      <Container size="md">
        <Title order={2} size="h3">
          Erstelle eine neue Umfrage
        </Title>
        <CreateSurveyForm possibleParticipants={participants || []} my="md" />
      </Container>
    </>
  );
}
