import { getAuthUser } from "@/actions/auth";
import {
  getImages,
  getComparisonBatch,
  getParticipation,
} from "@/actions/survey";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { SurveyWrapper } from "@/components/Survey/SurveyWrapper";
import { NextPageProps } from "@/types";
import { Container, Flex, Text } from "@mantine/core";
import { IconMoodSad, IconMoodSmile } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SurveyPage({ searchParams }: NextPageProps) {
  const { id } = await searchParams;

  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?next=/survey?id=${id}`);
  }
  const { data: participation } = await getParticipation(id!, user.id);

  if (!participation || participation.finished) {
    return (
      <>
        <Header />
        <Container size="md" style={{ height: "calc(100vh - 110px - 210px)" }}>
          <Flex
            align="center"
            mih="100%"
            justify="center"
            direction="column"
            gap={10}
          >
            {participation?.finished ? (
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

  const surveyId = participation.survey.id;
  const { data: comparisons } = await getComparisonBatch(surveyId);
  const { data: images } = await getImages(surveyId);

  if (!comparisons || !images) {
    redirect("/error");
  }

  return (
    <>
      <Header survey />
      <SurveyWrapper
        participation={participation}
        comparisons={comparisons}
        images={images}
      />
    </>
  );
}
