import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { PwcExample } from "@/components/PwcExample/PwcExample";
import { Link } from "@/i18n/routing";
import { Button, Container, Flex, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <>
      <Header />
      <Container size="lg">
        <Container size="md">
          <Title order={2} size="h3" mb="md">
            {t("title")}
          </Title>
          <Text my={5}>{t("text1")}</Text>
          <Text my={5}>{t("text2")}</Text>
        </Container>
        <PwcExample />
        <Container size="md">
          <Text my={5}>{t("text3")}</Text>
          <Flex justify="center" my={30}>
            <Link href="/participate">
              <Button>{t("participate")}</Button>
            </Link>
          </Flex>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
