import { getAuthUser } from "@/actions/auth";
import {
  getComparisonBatch,
  getImages,
  getParticipation,
} from "@/actions/survey";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { SurveyNotification } from "@/components/Survey/SurveyNotification";
import { SurveyWrapper } from "@/components/Survey/SurveyWrapper";
import { NextPageProps } from "@/types";
import { Container } from "@mantine/core";
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
          <SurveyNotification finished={Boolean(participation?.finished)} />
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
