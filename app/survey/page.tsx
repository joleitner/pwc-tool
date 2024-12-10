import { getAuthUser } from "@/actions/auth";
import {
  getImages,
  getUnansweredComparisons,
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
    redirect("/login");
  }
  const { data: participation } = await getParticipation(id!, user.id);

  if (!participation || participation.finished) {
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
  const { data: comparisons } = await getUnansweredComparisons(surveyId);
  const { data: images } = await getImages(surveyId);

  if (!comparisons || !images) {
    redirect("/error");
  }

  // go through comparisons and only keep images that are part of the comparisons
  const imageIds = comparisons.flatMap((comparison) => [
    comparison.image_1,
    comparison.image_2,
  ]);
  const uniqueImageIds = Array.from(new Set(imageIds));
  const filteredImages = images.filter((image) =>
    uniqueImageIds.includes(image.id)
  );

  return (
    <>
      <Header survey />
      <SurveyWrapper
        participation={participation}
        comparisons={comparisons}
        images={filteredImages}
      />
    </>
  );
}
