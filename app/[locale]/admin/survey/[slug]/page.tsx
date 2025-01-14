import { getAuthUser } from "@/actions/auth";
import { getSurveyInfo } from "@/actions/survey";
import { ImageRanking } from "@/components/Admin/ImageRanking";
import { Header } from "@/components/Header/Header";
import { NextPageProps } from "@/types";
import {
  Badge,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollAreaAutosize,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAB,
  IconMoodSad,
  IconPhoto,
  IconUsersGroup,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SurveyDetailPage({ params }: NextPageProps) {
  const user = await getAuthUser();

  if (user?.role !== "admin") {
    redirect("/admin/login");
  }
  const surveyId = (await params).slug;

  const survey = await getSurveyInfo(parseInt(surveyId));

  const initialParticipations = survey?.participations.filter((p) => p.initial);
  const refinementParticipations = survey?.participations.filter(
    (p) => !p.initial
  );

  return (
    <>
      <Header admin />
      {survey ? (
        <>
          <Container size="md">
            <Title order={2} ta="center">
              Umfrage: {survey.id}
            </Title>
            <Divider my="lg" />
            <Flex justify="space-between" align="center" mb="lg">
              <Group gap="xs" wrap="nowrap" visibleFrom="xs">
                <Text inline fw="bold">
                  Public Id:{" "}
                </Text>
                <Text inline>{survey.public_id}</Text>
              </Group>
              <Group gap="xs" wrap="nowrap">
                <Badge
                  variant="light"
                  size="xl"
                  leftSection={<IconAB size={20} />}
                  color="primary"
                >
                  {survey.comparison_count}
                </Badge>
                <Badge
                  variant="light"
                  size="xl"
                  leftSection={<IconPhoto size={20} />}
                  color="indigo"
                >
                  {survey.image_count}
                </Badge>
                <Badge
                  variant="light"
                  size="xl"
                  leftSection={<IconUsersGroup size={20} />}
                  color="indigo"
                >
                  {survey.participant_count}
                </Badge>
              </Group>
            </Flex>
            <Title order={3}>Teilnehmer</Title>
            <Stack my="lg" mb="xl">
              {initialParticipations?.map((participation, index) => (
                <ParticipantItem key={index} participation={participation} />
              ))}
            </Stack>
            <Title order={4}>Refinements</Title>
            <ScrollAreaAutosize mah={450} offsetScrollbars>
              <Stack my="lg" mb="xl">
                {refinementParticipations?.map((participation, index) => (
                  <ParticipantItem key={index} participation={participation} />
                ))}
              </Stack>
            </ScrollAreaAutosize>
            <Title order={3}>Bild Scores</Title>
            <ImageRanking surveyId={survey.id} images={survey.images} />
          </Container>
          <Space h="100px" />
        </>
      ) : (
        <Container size="md" style={{ height: "calc(100vh - 110px - 210px)" }}>
          <Flex
            align="center"
            mih="100%"
            justify="center"
            direction="column"
            gap={10}
          >
            <IconMoodSad size={50} color="gray" />
            <Text fw="bold">Ungültige Umfrage ID</Text>
          </Flex>
        </Container>
      )}
    </>
  );
}

const ParticipantItem = ({ participation }: { participation: any }) => (
  <Paper p="md" withBorder shadow="xs">
    <Flex justify="space-between" align="center">
      <Text>{participation.user.name}</Text>
      <Group>
        {participation.started && (
          <Badge
            variant="light"
            size="xl"
            leftSection={<IconAB size={20} />}
            color="indigo"
          >
            {participation.comparison_count}
          </Badge>
        )}
        <Badge
          color={
            participation.finished
              ? "green"
              : participation.started
              ? "indigo"
              : "red"
          }
        >
          {participation.finished
            ? new Date(participation.finished).toLocaleString("de-DE")
            : participation.started
            ? new Date(participation.started).toLocaleString("de-DE")
            : "Not started"}
        </Badge>
      </Group>
    </Flex>
  </Paper>
);
