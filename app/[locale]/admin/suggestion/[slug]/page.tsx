import { getAuthUser } from "@/actions/auth";
import { getSuggestion } from "@/actions/helper";
import { getRegistrations } from "@/actions/survey";
import { CreateSuggestionForm } from "@/components/Admin/CreateSuggestionForm ";
import { SuggestionImages } from "@/components/Admin/SuggestionImages";
import { Header } from "@/components/Header/Header";
import { NextPageProps } from "@/types";
import {
  Container,
  Divider,
  Flex,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SuggestionPage({ params }: NextPageProps) {
  const user = await getAuthUser();

  if (user?.role !== "admin") {
    redirect("/admin/login");
  }
  const suggestionId = (await params).slug;

  const [{ data: suggestion }, { data: participants }] = await Promise.all([
    getSuggestion(parseInt(suggestionId)),
    getRegistrations(),
  ]);

  return (
    <>
      <Header admin />
      {suggestion ? (
        <>
          <Container size="md">
            <Title order={2} ta="center">
              Suggestion: {suggestion.user?.name}
            </Title>
            <Divider my="lg" />

            <Title order={3}>Images</Title>
            <SuggestionImages
              suggestionId={suggestion.id}
              images={suggestion.images!}
              mb={50}
            />
            <Title order={3}>Participants</Title>
            <Stack my="lg" mb="xl" gap={5}>
              {suggestion.emails.map((mail, index) => (
                <Paper px="md" py="xs" withBorder shadow="xs" key={index}>
                  <Flex justify="space-between" align="center">
                    <Text>{mail}</Text>
                  </Flex>
                </Paper>
              ))}
            </Stack>
            <CreateSuggestionForm
              possibleParticipants={participants || []}
              suggestion={suggestion!}
            />
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
            <Text fw="bold">Invalid Suggestion ID</Text>
          </Flex>
        </Container>
      )}
    </>
  );
}
