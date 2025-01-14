"use client";

import { enterRefinementForNewSurvey } from "@/actions/refinement";
import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconHeart, IconTargetArrow } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useState } from "react";

export const RefineContent = ({
  surveysAvailable,
}: {
  surveysAvailable: boolean;
}) => {
  const t = useTranslations("Refine");

  const [finished, setFinished] = useState(!surveysAvailable);
  const [started, setStarted] = useLocalStorage({
    key: "refinementStarted",
    defaultValue: false,
  });
  const [loading, setLoading] = useState(false);

  const handleNewSurvey = async () => {
    const surveyId = await enterRefinementForNewSurvey();
    if (!started) setStarted(true);
    if (surveyId) {
      setLoading(true);
      redirect(`/survey?id=${surveyId}&refinement=true`);
    }
  };

  return (
    <Container size="sm" style={{ height: "calc(100vh - 110px - 210px)" }}>
      <Flex
        align="center"
        mih="100%"
        justify="center"
        direction="column"
        gap={10}
      >
        {loading ? (
          <Flex
            align="center"
            mih="60vh"
            justify="center"
            direction="column"
            gap={10}
          >
            <Loader type="dots" />
            <Text size="sm" c="gray.7">
              {t("loading")}
            </Text>
          </Flex>
        ) : finished ? (
          <>
            <IconHeart
              size={50}
              style={{ color: "var(--mantine-primary-color-6)" }}
            />
            <Text fw="bold">{t("thankyouText")}</Text>
            <Text>{t("thankyouText2")}</Text>
          </>
        ) : (
          <Container mb="lg">
            <Stack gap="xl">
              {started && (
                <Flex
                  align="center"
                  mih="100%"
                  justify="center"
                  direction="column"
                  gap={10}
                >
                  <Paper radius="xl" p="sm" shadow="xs" bg="primary.1">
                    <Center>
                      <IconHeart
                        size={35}
                        style={{ color: "var(--mantine-primary-color-6)" }}
                      />
                    </Center>
                  </Paper>

                  <Text ta="center">{t("textRefine")}</Text>
                </Flex>
              )}
              <Flex
                align="center"
                mih="100%"
                justify="center"
                direction="column"
                gap={8}
              >
                <Paper radius="xl" p="sm" shadow="xs" bg="primary.1">
                  <Center>
                    <IconTargetArrow
                      strokeWidth={1.5}
                      size={35}
                      style={{ color: "var(--mantine-primary-color-6)" }}
                    />
                  </Center>
                </Paper>

                <Text ta="center">{t("text1")}</Text>
                <Text ta="center">{t("text2")}</Text>
              </Flex>
            </Stack>

            <Flex mt="xl" justify="center" gap="lg">
              {started && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFinished(true);
                  }}
                >
                  {t("stop")}
                </Button>
              )}
              <Button onClick={handleNewSurvey}>{t("nextSurvey")}</Button>
            </Flex>
          </Container>
        )}
      </Flex>
    </Container>
  );
};
