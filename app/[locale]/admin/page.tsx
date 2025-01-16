import { getAuthUser } from "@/actions/auth";
import { getRegistrations, getSurveys } from "@/actions/survey";
import { Header } from "@/components/Header/Header";
import { RegistrationOverview } from "@/components/Admin/RegistrationOverview";
import { SurveyOverview } from "@/components/Admin/SurveyOverview";
import { Link } from "@/i18n/routing";
import { Button, Container, Divider, Flex, Space, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { HelperOverview } from "@/components/Admin/HelperOverview";
import { getHelper } from "@/actions/helper";

export default async function AdminPanel() {
  const user = await getAuthUser();

  if (user?.role === "admin") {
    const [{ data: participants }, { data: surveys }, { data: helper }] =
      await Promise.all([getRegistrations(), getSurveys(), getHelper()]);

    return (
      <>
        <Header admin />
        <Container size="md">
          <Title order={2} ta="center">
            Admin Panel
          </Title>
          <Divider my="lg" />
          <RegistrationOverview my={50} initial={participants!} />
          <Flex justify="center" mb="lg" gap="lg">
            <Link href="/admin/addRegistration">
              <Button variant="outline">Add registration</Button>
            </Link>
            <Link href="/admin/createSurvey">
              <Button>Create new survey</Button>
            </Link>
          </Flex>

          <Divider my={50} />
          <SurveyOverview initial={surveys!} />
          <Divider my={50} />
          <HelperOverview initial={helper!} />
          <Divider my={50} />
          <Title order={2}>Refinement</Title>
          <Flex my={20} justify="center">
            <Link href="/admin/refinement">
              <Button>Start refinement</Button>
            </Link>
          </Flex>
          <Space h={100} />
        </Container>
      </>
    );
  } else {
    redirect("/admin/login");
  }
}
