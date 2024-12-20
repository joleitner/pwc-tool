import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Container, Flex, Text } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Confirmed() {
  const t = useTranslations("Confirmed");

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
          <IconMail
            size={50}
            style={{ color: "var(--mantine-primary-color-6)" }}
          />
          <Text>{t("text")}</Text>
        </Flex>
      </Container>

      <Footer />
    </>
  );
}
