"use client";

import {
  Button,
  Container,
  Flex,
  List,
  ListItem,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { PwcExample } from "../PwcExample/PwcExample";
import { ComparisonForm } from "./ComparisonForm/ComparisonForm";
import { Questionnaire } from "./Questionnaire";
import { useSurveyContext } from "./SurveyProvider";
import { getComparisonBatch, sendSurveyStarted } from "@/actions/survey";
import { useTranslations } from "next-intl";

export const Survey = () => {
  const t = useTranslations("Survey");
  const {
    comparisons,
    setComparisons,
    participation: { started, survey },
  } = useSurveyContext();
  const [nextComparison, setNextComparison] = useState<boolean>(false);
  const [loadingBatches, setLoadingBatches] = useState<boolean>(false);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState<
    number | null
  >(comparisons.length > 0 ? 0 : null);

  const [surveyStarted, setSurveyStarted] = useState<boolean>(started !== null);

  useEffect(() => {
    if (nextComparison) {
      if (currentComparisonIndex !== null) {
        if (currentComparisonIndex + 1 < comparisons.length) {
          setCurrentComparisonIndex((prevIndex) => prevIndex! + 1);
        } else {
          // load new batch of comparisons
          const loadBatch = async () => {
            setLoadingBatches(true);
            const { data: comparisons } = await getComparisonBatch(survey.id);
            if (comparisons && comparisons.length > 0) {
              setComparisons(comparisons);
              setCurrentComparisonIndex(0);
            } else {
              // no more comparisons available
              setCurrentComparisonIndex(null);
            }
            setLoadingBatches(false);
          };
          loadBatch();
        }
      }
      setNextComparison(false);
    }
  }, [nextComparison, comparisons.length]);

  return (
    <>
      {surveyStarted ? (
        currentComparisonIndex !== null ? (
          loadingBatches ? (
            <Container
              size="md"
              style={{ height: "calc(100vh - 70px - 210px)" }}
            >
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
            </Container>
          ) : (
            <Container size="xl">
              <ComparisonForm
                comparison={comparisons[currentComparisonIndex]}
                finished={() => setNextComparison(true)}
                key={comparisons[currentComparisonIndex].id}
              />
            </Container>
          )
        ) : (
          <Container size="md" mb={150}>
            <Questionnaire />
          </Container>
        )
      ) : (
        <Container size="md" mb={150} mt={50}>
          <Container>
            <Title order={2} mb="lg">
              {t("title")}
            </Title>
            <Text>{t("text1")}</Text>
            <Text fw="bold" mt={15} mb={5}>
              {t("pairTitle")}
            </Text>
            <Text>{t("pairText")}</Text>
            <PwcExample />
            <Text fw="bold" mt={15} mb={5}>
              {t("noticeTitle")}
            </Text>
            <List mb="md">
              <ListItem>
                <b>{t("notice1Title")}</b>
                {t("notice1Text")}
              </ListItem>
              <ListItem>
                <b>{t("notice2Title")}</b>
                {t("notice2Text")}
              </ListItem>
              <ListItem>
                <b>{t("notice3Title")}</b>
                {t("notice3Text")}
              </ListItem>
            </List>
            <Text mb="md">{t("text2")}</Text>
            <Text fw="bold" mb="lg">
              {t("wish")}
            </Text>
          </Container>

          <Flex justify="center">
            <Button
              size="md"
              onClick={() => {
                sendSurveyStarted(survey.id);
                setSurveyStarted(true);
              }}
            >
              {t("start")}
            </Button>
          </Flex>
        </Container>
      )}
    </>
  );
};
