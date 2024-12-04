import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import {
  Box,
  Center,
  Container,
  Flex,
  Overlay,
  Paper,
  Title,
  Text,
  List,
  ListItem,
  Button,
} from "@mantine/core";
import { IconCircleDashedCheck, IconMail } from "@tabler/icons-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <Container size="md" style={{ height: "calc(100vh - 150px - 210px)" }}>
        <Flex
          align="center"
          mih="60vh"
          justify="center"
          direction="column"
          gap={10}
        >
          <IconMail size={50} color="gray" />
          <Text>Email erfolgreich bestätigt.</Text>
        </Flex>
      </Container>

      <Footer />
    </>
  );
}
