import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Container, Flex, Text } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export default function Confirmed() {
  return (
    <>
      <Header />
      <Container size="md" style={{ height: "calc(100vh - 110px - 210px)" }}>
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap={10}
          h="100%"
        >
          <IconMail size={50} color="gray" />
          <Text>Email erfolgreich bestätigt.</Text>
        </Flex>
      </Container>

      <Footer />
    </>
  );
}
