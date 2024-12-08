"use client";

import { deleteRegistration, getRegistrations } from "@/actions/survey";
import { Registrations } from "@/types";
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
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash, IconUsersGroup, IconX } from "@tabler/icons-react";
import { useState } from "react";

type Props = Partial<BoxProps> & {
  initial?: Registrations[];
};

export const RegistrationOverview = ({ initial, ...props }: Props) => {
  const [registrations, setRegistrations] = useState<Registrations[]>(
    initial || []
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Registrations | null>(
    null
  );
  const supabase = createClientSupabase();

  const onUpdate = async () => {
    const { data, error } = await getRegistrations();
    if (!error) {
      setRegistrations(data);
    }
  };

  supabase
    .channel("registrations")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "registrations" },
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
            {registrations.length}
          </Badge>
        </Flex>
        <ScrollAreaAutosize mah={450} offsetScrollbars>
          <Stack gap="md">
            {registrations.map((registrant) => (
              <Paper py="xs" px="lg" withBorder key={registrant.id}>
                <Flex justify="space-between" align="center">
                  <Text>{registrant.email}</Text>
                  <Group gap={20}>
                    <Badge color={registrant.verified ? "green" : "blue"}>
                      {registrant.verified ? "Verified" : "Pending"}
                    </Badge>
                    <ActionIcon
                      size="lg"
                      variant="subtle"
                      color="var(--mantine-color-red-8)"
                      onClick={() => {
                        setDeleteCandidate(registrant);
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
          setRegistrations((prev) =>
            prev.filter((p) => p.id !== deleteCandidate?.id)
          );
          deleteRegistration(deleteCandidate?.id!);
          close();
          setDeleteCandidate(null);
        }}
        registrant={deleteCandidate}
      />
    </>
  );
};

const DeleteModal = ({
  opened,
  onClose,
  onDelete,
  registrant,
}: {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
  registrant: Registrations | null;
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Teilnehmer löschen">
      <Box p="md">
        <Text>Soll "{registrant?.email}" wirklich entfernt werden?</Text>
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
