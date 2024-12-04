import { Container, Modal, Text, Title } from "@mantine/core";
import { DataPrivacy } from "./DataPrivacy";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const DataPrivacyModal = ({ opened, onClose }: Props) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Datenschutzerklärung"
      size="xl"
    >
      <Container p={30}>
        <DataPrivacy />
      </Container>
    </Modal>
  );
};
