import { getAuthUser } from "@/actions/auth";
import { getRegistrations } from "@/actions/survey";
import { CreateSurveyForm } from "@/components/CreateSurveyForm";
import { Header } from "@/components/Header/Header";
import { Container, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function CreateSurvey() {
  const user = await getAuthUser();

  if (user?.admin === false) {
    redirect("/admin/login");
  }

  const { data: participants } = await getRegistrations();

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
