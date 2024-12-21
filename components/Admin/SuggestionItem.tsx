"use client";

import { Link } from "@/i18n/routing";
import { Suggestion } from "@/types";
import { Badge, Flex, Group, Paper, PaperProps, Text } from "@mantine/core";
import { IconPhoto, IconUsersGroup } from "@tabler/icons-react";

type Props = Partial<PaperProps> & {
  suggestion: Suggestion;
};

export const SuggestionItem = ({ suggestion, ...props }: Props) => {
  return (
    <Link
      href={`/admin/suggestion/${suggestion.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Paper py="xs" px="lg" withBorder {...props}>
        <Flex justify="space-between" align="center">
          <Text>{suggestion.user.name}</Text>
          <Group gap="xs" wrap="nowrap">
            <Badge
              variant="light"
              size="xl"
              leftSection={<IconPhoto size={20} />}
              color="indigo"
            >
              {Array.isArray(suggestion.images) && suggestion.images.length}
            </Badge>
            <Badge
              variant="light"
              size="xl"
              leftSection={<IconUsersGroup size={20} />}
              color="indigo"
            >
              {Array.isArray(suggestion.emails) && suggestion.emails.length}
            </Badge>
          </Group>
        </Flex>
      </Paper>
    </Link>
  );
};
