import { getAuthUser } from "@/actions/auth";
import {
  getImages,
  getPairwiseComparisons,
  getSurveyByPublicId,
  getUserParticipantOfSurvey,
} from "@/actions/survey";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Survey } from "@/components/Survey/Survey";
import { SurveyWrapper } from "@/components/Survey/SurveyWrapper";
import { NextPageProps } from "@/types";
import { Container, Flex, Text } from "@mantine/core";
import { IconMoodSad, IconMoodSmile } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SurveyPage({ searchParams }: NextPageProps) {
  const { id } = await searchParams;

  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  let noValidId = true;
  let surveyId = 0;
  let surveyFinished = false;

  if (id) {
    const { data: survey } = await getSurveyByPublicId(id);
    if (survey) {
      const { isParticipant, finished } = await getUserParticipantOfSurvey(
        survey.id,
        user.id
      );
      if (isParticipant && finished !== undefined) {
        noValidId = false;
        surveyId = survey.id;
        surveyFinished = finished;
      }
    }
  }

  if (noValidId || surveyFinished) {
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
            {surveyFinished ? (
              <>
                <IconMoodSmile size={50} color="gray" />
                <Text fw="bold">Umfrage abgeschlossen</Text>
                <Text>Vielen Dank für deine Teilnahme.</Text>
              </>
            ) : (
              <>
                <IconMoodSad size={50} color="gray" />
                <Text fw="bold">Ungültige Umfrage ID</Text>
                <Text>Bitte klicke auf den Link in deiner Email.</Text>
              </>
            )}
          </Flex>
        </Container>
        <Footer />
      </>
    );
  }

  const { data: comparisons } = await getPairwiseComparisons(surveyId);
  const { data: images } = await getImages(surveyId);

  if (!comparisons || !images) {
    redirect("/error");
  }

  return (
    <>
      <Header survey />
      <SurveyWrapper
        comparisons={comparisons}
        images={images}
        surveyId={surveyId}
      />
    </>
  );
}
