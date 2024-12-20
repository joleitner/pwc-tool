"use client";

import { Container, List, ListItem, Title, Text, Flex } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ParticapteForm } from "./ParticipateForm";
import { useState } from "react";
import { IconMoodSmile } from "@tabler/icons-react";

export const ParticipateContent = () => {
  const t = useTranslations("Participate");
  const [registered, setRegistered] = useState(false);

  if (registered) {
    return (
      <Container size="md" style={{ height: "calc(100vh - 110px - 210px)" }}>
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap={10}
          h="100%"
        >
          <IconMoodSmile
            size={50}
            style={{ color: "var(--mantine-primary-color-6)" }}
          />
          <Text fw="bold">{t("successTitle")}</Text>
          <Text ta="center">{t("successText")}</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="md" style={{ minHeight: "calc(100vh - 110px - 210px)" }}>
      <Container mb="lg">
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
        </List>
        <Text fw="bold" mt={15} mb={5}>
          {t("notice")}
        </Text>
        <Text>{t("noticeText1")}</Text>
        <Text>{t("noticeText2")}</Text>
        <Text fw="bold" mt={15} mb={5}>
          {t("consent")}
        </Text>
        <Text>{t("consentText")}</Text>
      </Container>

      <Container size="sm">
        <ParticapteForm setRegistered={setRegistered} />
      </Container>
    </Container>
  );
};
