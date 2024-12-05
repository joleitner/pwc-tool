import { getAuthUser } from "@/actions/auth";
import {
  getImages,
  getPairwiseComparisons,
  getSurveyByPublicId,
  isUserParticipantOfSurvey,
} from "@/actions/survey";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Survey } from "@/components/Survey/Survey";
import { SurveyWrapper } from "@/components/Survey/SurveyWrapper";
import { NextPageProps } from "@/types";
import { Container, Flex, Text } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SurveyPage({ searchParams }: NextPageProps) {
  const { id } = await searchParams;

  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  let noValidId = true;
  let survey_id = 0;

  if (id) {
    const { data: survey } = await getSurveyByPublicId(id);
    if (survey) {
      noValidId = !(await isUserParticipantOfSurvey(survey.id, user.id));
      survey_id = survey.id;
    }
  }

  if (noValidId) {
    return (
      <>
        <Header />
        <Container size="md" style={{ height: "calc(100vh - 150px - 210px)" }}>
          <Flex
            align="center"
            mih="60vh"
            justify="center"
            direction="column"
            gap={10}
          >
            <IconMoodSad size={50} color="gray" />
            <Text fw="bold">Ungültige Umfrage ID</Text>
            <Text>Bitte klicke auf den Link in deiner Email.</Text>
          </Flex>
        </Container>
        <Footer />
      </>
    );
  }

  const { data: comparisons } = await getPairwiseComparisons(survey_id);
  const { data: images } = await getImages(survey_id);

  if (!comparisons || !images) {
    redirect("/error");
  }

  return (
    <>
      <Header survey />
      <SurveyWrapper comparisons={comparisons} images={images} />
    </>
  );
}
