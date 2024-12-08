import { getAuthUser } from "@/actions/auth";
import { getRegistrations, getSurveys } from "@/actions/survey";
import { Header } from "@/components/Header/Header";
import { RegistrationOverview } from "@/components/RegistrationOverview";
import { SurveyOverview } from "@/components/SurveyOverview";
import { Button, Container, Divider, Flex, Title } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPanel() {
  const user = await getAuthUser();

  if (user?.admin === false) {
    redirect("/admin/login");
  }

  const { data: participants } = await getRegistrations();
  const { data: surveys } = await getSurveys();

  return (
    <>
      <Header admin />
      <Container size="md">
        <Title order={2} ta="center">
          Admin Panel
        </Title>
        <Divider my="lg" />
        <RegistrationOverview my={50} initial={participants!} />
        <Flex justify="center" mb="lg">
          <Button component={Link} href="/admin/createSurvey">
            Neue Umfrage erstellen
          </Button>
        </Flex>

        <Divider my={50} />
        <SurveyOverview initial={surveys!} />
      </Container>
    </>
  );
}
