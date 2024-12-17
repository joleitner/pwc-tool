import { getAuthUser } from "@/actions/auth";
import { getRegistrations, getSurveys } from "@/actions/survey";
import { Header } from "@/components/Header/Header";
import { RegistrationOverview } from "@/components/Admin/RegistrationOverview";
import { SurveyOverview } from "@/components/Admin/SurveyOverview";
import { Link } from "@/i18n/routing";
import { Button, Container, Divider, Flex, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function AdminPanel() {
  const user = await getAuthUser();

  if (!user || user?.admin === undefined || user.admin === false) {
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
          <Link href="/admin/createSurvey">
            <Button>Neue Umfrage erstellen</Button>
          </Link>
        </Flex>

        <Divider my={50} />
        <SurveyOverview initial={surveys!} />
      </Container>
    </>
  );
}
