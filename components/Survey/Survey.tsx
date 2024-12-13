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
import { Questionaire } from "./Questionaire";
import { useSurveyContext } from "./SurveyProvider";
import { getComparisonBatch, sendSurveyStarted } from "@/actions/survey";

export const Survey = () => {
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
                  Laden neuer Vergleichspaare
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
            <Questionaire />
          </Container>
        )
      ) : (
        <Container size="md" mb={150} mt={50}>
          <Container>
            <Title order={2} mb={40}>
              Willkommen zur Umfrage
            </Title>
            <Text>
              Die Umfrage wird etwa 10-15 Minuten dauern. Bitte stelle sicher,
              dass du in einer ruhigen Umgebung bist und dich auf die Aufgabe
              konzentrieren kannst.
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
              dolor sit amet.
            </Text>
            <Text fw="bold" mt={15} mb={5}>
              Ablauf der Nutzerstudie:
            </Text>
            <List mb={20}>
              <ListItem>
                Es wird eine Reihe von Gruppenbildern von Ihnen aufgenommen
              </ListItem>
              <ListItem>
                Darauffolgend erhalten Sie einen Link zur Umfrage. In dieser
                musst du mithilfe von paarweisen Vergleichen die Bildqualität
                der einzelnen Bilder bewerten.
              </ListItem>
              <ListItem>
                Im Anschluss erhälst du ein paar allgemeine Fragen dazu, anhand
                was du die Qualität von Gruppenbildern festmachst.
              </ListItem>
              <ListItem>
                Die Umfrage dauert ca. 10-15 Minuten und kann bequem von zu
                Hause aus durchgeführt werden.
              </ListItem>
              <ListItem>
                Die Bilder können nur von Teilnehmern der Umfrage gesehen
                werden. Die Ergebnisse werden anonymisiert ausgewertet.
              </ListItem>
            </List>
          </Container>

          <PwcExample />
          <Flex justify="center">
            <Button
              size="md"
              onClick={() => {
                sendSurveyStarted(survey.id);
                setSurveyStarted(true);
              }}
            >
              Umfrage starten
            </Button>
          </Flex>
        </Container>
      )}
    </>
  );
};
