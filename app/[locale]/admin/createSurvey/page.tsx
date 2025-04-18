import { getAuthUser } from "@/actions/auth";
import { getRegistrations } from "@/actions/survey";
import { CreateSurveyForm } from "@/components/Admin/CreateSurveyForm";
import { Header } from "@/components/Header/Header";
import { Container, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function CreateSurvey() {
  const user = await getAuthUser();

  if (user?.role !== "admin") {
    redirect("/admin/login");
  }

  const { data: participants } = await getRegistrations();

  return (
    <>
      <Header admin />
      <Container size="md">
        <Title order={2} size="h3">
          Create a new survey
        </Title>
        <CreateSurveyForm possibleParticipants={participants || []} my="md" />
      </Container>
    </>
  );
}
