import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { MagicLinkForm } from "@/components/MagicLinkForm";
import { Container, Flex, Text } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import { Suspense } from "react";

export default async function Login() {
  return (
    <>
      <Header />
      <Container size="md" style={{ height: "calc(100vh - 110px - 210px)" }}>
        <Flex
          mih="100%"
          align="center"
          justify="center"
          direction="column"
          gap={10}
        >
          <IconLogin size={50} color="gray" />

          <Text fw="bold">Neuen Loginlink anfordern</Text>
          <Text ta="center">
            Du hast dich erfolgreich registriert aber dein Loginlink ist
            abgelaufen?
          </Text>
          <Suspense>
            <MagicLinkForm w={250} />
          </Suspense>
        </Flex>
      </Container>
      <Footer />
    </>
  );
}
