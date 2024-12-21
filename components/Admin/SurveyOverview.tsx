"use client";

import { getSurveys } from "@/actions/survey";
import { Survey } from "@/types";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import {
  Badge,
  Box,
  BoxProps,
  Flex,
  Group,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconListCheck, IconPhoto, IconUsersGroup } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = Partial<BoxProps> & {
  initial?: Survey[];
};

export const SurveyOverview = ({ initial, ...props }: Props) => {
  const [surveys, setSurveys] = useState(initial || []);
  const supabase = createClientSupabase();

  const onUpdate = async () => {
    const { data, error } = await getSurveys();
    if (!error) {
      setSurveys(data);
    }
  };

  supabase
    .channel("surveys")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "surveys" },
      onUpdate
    )
    .subscribe();

  return (
    <>
      <Box {...props}>
        <Flex justify="space-between" mr="md" align="center" mb="md">
          <Title order={2}>Running surveys</Title>
          <Badge
            variant="light"
            size="xl"
            leftSection={<IconListCheck size={20} />}
          >
            {surveys.length}
          </Badge>
        </Flex>
        <ScrollAreaAutosize mah={450} offsetScrollbars>
          <Stack gap="md">
            {surveys.map((survey) => (
              <Paper
                py="xs"
                px="lg"
                withBorder
                key={survey.id}
                onClick={() => redirect(`/admin/survey/${survey.id}`)}
              >
                <Flex justify="space-between" align="center">
                  <Text>Survey {survey.id}</Text>
                  <Group gap="xs" wrap="nowrap">
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
              </Paper>
            ))}
          </Stack>
        </ScrollAreaAutosize>
      </Box>
    </>
  );
};
