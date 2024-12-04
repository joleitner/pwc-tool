"use client";

import { deleteParticipant, getParticipants } from "@/actions/survey";
import { Participant } from "@/types";
import { createClientSupabase } from "@/utils/supabase/supabase.client";
import {
  ActionIcon,
  Badge,
  Box,
  BoxProps,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  ScrollAreaAutosize,
  Stack,
  StackProps,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash, IconUsersGroup, IconX } from "@tabler/icons-react";
import { useState } from "react";

type Props = Partial<BoxProps> & {
  initial?: Participant[];
};

export const ParticipantOverview = ({ initial, ...props }: Props) => {
  const [participants, setParticipants] = useState<Participant[]>(
    initial || []
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Participant | null>(
    null
  );
  const supabase = createClientSupabase();

  const onUpdate = async () => {
    const { data, error } = await getParticipants();
    if (!error) {
      setParticipants(data);
    }
  };

  supabase
    .channel("participants")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "participants" },
      onUpdate
    )
    .subscribe();

  return (
    <>
      <Box {...props}>
        <Flex justify="space-between" mr="md" align="center" mb="md">
          <Title order={2}>Teilnehmer</Title>
          <Badge
            variant="light"
            size="xl"
            leftSection={<IconUsersGroup size={20} />}
          >
            {participants.length}
          </Badge>
        </Flex>
        <ScrollAreaAutosize mah={450} offsetScrollbars>
          <Stack gap="md">
            {participants.map((participant) => (
              <Paper py="xs" px="lg" withBorder key={participant.id}>
                <Flex justify="space-between" align="center">
                  <Text>{participant.email}</Text>
                  <Group gap={20}>
                    <Badge color={participant.verified ? "green" : "blue"}>
                      {participant.verified ? "Verified" : "Pending"}
                    </Badge>
                    <ActionIcon
                      size="lg"
                      variant="subtle"
                      color="var(--mantine-color-red-8)"
                      onClick={() => {
                        setDeleteCandidate(participant);
                        open();
                      }}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                </Flex>
              </Paper>
            ))}
          </Stack>
        </ScrollAreaAutosize>
      </Box>

      <DeleteModal
        opened={opened}
        onClose={() => {
          close();
          setDeleteCandidate(null);
        }}
        onDelete={() => {
          // remove from list
          setParticipants((prev) =>
            prev.filter((p) => p.id !== deleteCandidate?.id)
          );
          deleteParticipant(deleteCandidate?.id!);
          close();
          setDeleteCandidate(null);
        }}
        participant={deleteCandidate}
      />
    </>
  );
};

const DeleteModal = ({
  opened,
  onClose,
  onDelete,
  participant,
}: {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
  participant: Participant | null;
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Teilnehmer löschen">
      <Box p="md">
        <Text>Soll "{participant?.email}" wirklich entfernt werden?</Text>
        <Group justify="space-between" mt="md">
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<IconX size={18} />}
            onClick={onClose}
          >
            Nein, abbrechen
          </Button>
          <Button
            color="red"
            size="sm"
            leftSection={<IconTrash size={18} />}
            onClick={onDelete}
          >
            Ja, löschen
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
