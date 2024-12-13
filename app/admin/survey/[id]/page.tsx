import { getAuthUser } from "@/actions/auth";
// import { getSurveyInfo } from "@/actions/survey";
import { Header } from "@/components/Header/Header";
import { Container, Divider } from "@mantine/core";
import { redirect } from "next/navigation";

// { params }: NextPageProps
export default async function SurveyDetailPage() {
  const user = await getAuthUser();

  if (!user || user?.admin === undefined || user.admin === false) {
    redirect("/admin/login");
  }
  // const surveyId = (await params).slug;

  // const survey = await getSurveyInfo(parseInt(surveyId));

  return (
    <>
      <Header admin />
      <Container size="md">
        {/* <Title order={2} ta="center">
          Umfrage: {survey.id}
        </Title> */}
        <Divider my="lg" />
      </Container>
    </>
  );
}
