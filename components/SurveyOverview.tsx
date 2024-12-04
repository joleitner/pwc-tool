"use client";

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
import { useState } from "react";

type Props = Partial<BoxProps> & {
  initial?: Survey[];
};

export const SurveyOverview = ({ initial, ...props }: Props) => {
  const [surveys, setSurveys] = useState(initial || []);
  const supabase = createClientSupabase();

  const onUpdate = async (payload: any) => {
    setSurveys((prev) => [payload.new, ...prev]);
  };

  supabase
    .channel("surveys")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "surveys" },
      onUpdate
    )
    .subscribe();

  return (
    <>
      <Box {...props}>
        <Flex justify="space-between" mr="md" align="center" mb="md">
          <Title order={2}>Laufende Umfragen</Title>
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
              <Paper py="xs" px="lg" withBorder key={survey.id}>
                <Flex justify="space-between" align="center">
                  <Text>{survey.public_id}</Text>
                  <Group gap="xs">
                    <Badge
                      variant="light"
                      size="xl"
                      leftSection={<IconPhoto size={20} />}
                      color="blue"
                    >
                      {survey.image_count}
                    </Badge>
                    <Badge
                      variant="light"
                      size="xl"
                      leftSection={<IconUsersGroup size={20} />}
                      color="blue"
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
