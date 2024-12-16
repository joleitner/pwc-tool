"use client";

import { Flex, Text } from "@mantine/core";
import { IconMoodSad, IconMoodSmile } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export const SurveyNotification = ({ finished }: { finished: boolean }) => {
  const t = useTranslations("SurveyNotification");
  return (
    <Flex
      align="center"
      mih="100%"
      justify="center"
      direction="column"
      gap={10}
    >
      {finished ? (
        <>
          <IconMoodSmile size={50} color="gray" />
          <Text fw="bold">{t("successTitle")}</Text>
          <Text>{t("successText")}</Text>
        </>
      ) : (
        <>
          <IconMoodSad size={50} color="gray" />
          <Text fw="bold">{t("errorTitle")}</Text>
          <Text>{t("errorText")}</Text>
        </>
      )}
    </Flex>
  );
};
