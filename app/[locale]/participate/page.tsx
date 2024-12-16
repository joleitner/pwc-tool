import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ParticapteForm } from "@/components/ParticipateForm";
import { Container, List, ListItem, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function ParticipatePage() {
  const t = useTranslations("ParticipatePage");

  return (
    <>
      <Header />
      <Container size="md" mih="70vh">
        <Container>
          <Title order={2} mb="md">
            {t("title")}
          </Title>
          <Text>{t("text1")}</Text>
          <Text fw="bold" mt={15} mb={5}>
            {t("process")}
          </Text>
          <List mb={20}>
            <ListItem>{t("point1")}</ListItem>
            <ListItem>{t("point2")}</ListItem>
            <ListItem>{t("point3")}</ListItem>
            <ListItem>{t("point4")}</ListItem>
            <ListItem>{t("point5")}</ListItem>
            <ListItem>{t("point6")}</ListItem>
          </List>
        </Container>

        <Container size="sm">
          <ParticapteForm />
        </Container>
      </Container>
      <Footer />
    </>
  );
}
