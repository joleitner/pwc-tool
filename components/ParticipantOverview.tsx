"use client";

import { deleteParticipant, getParticipants } from "@/actions/survey";
import { Participant } from "@/types";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  StackProps,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const ParticipantOverview = ({ ...props }: Partial<StackProps>) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Participant | null>(
    null
  );
  const supabase = createClient();

  useEffect(() => {
    const loadParticipants = async () => {
      const { data, error } = await getParticipants();
      if (!error) {
        setParticipants(data);
      }
    };
    loadParticipants();
  }, []);

  const onUpdate = async (payload: any) => {
    setParticipants((prev) => [payload.new, ...prev]);
  };

  supabase
    .channel("participants")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "participants" },
      onUpdate
    )
    .subscribe();

  return (
    <>
      <Stack gap="md" {...props}>
        {participants.map((participant) => (
          <Paper py="xs" px="lg" withBorder key={participant.id}>
            <Flex justify="space-between" align="center">
              <Text>{participant.email}</Text>
              <ActionIcon
                size="lg"
                color="var(--mantine-color-red-8)"
                onClick={() => {
                  setDeleteCandidate(participant);
                  open();
                }}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Flex>
          </Paper>
        ))}
      </Stack>
      <DeleteModal
        opened={opened}
        onClose={() => {
          close();
          // remove from list
          setParticipants((prev) =>
            prev.filter((p) => p.id !== deleteCandidate?.id)
          );
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
  participant,
}: {
  opened: boolean;
  onClose: () => void;
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
            onClick={() => {
              deleteParticipant(participant?.id!);
              onClose();
            }}
          >
            Ja, löschen
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
