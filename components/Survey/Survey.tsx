"use client";

import {
  Button,
  Container,
  Flex,
  List,
  ListItem,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { PwcExample } from "../PwcExample";
import { ComparisonForm } from "./ComparisonForm";
import { useSurveyContext } from "./SurveyProvider";
import { Questionaire } from "./Questionaire";

export const Survey = () => {
  const {
    comparisons,
    participation: { survey },
  } = useSurveyContext();
  const [nextComparison, setNextComparison] = useState<boolean>(false);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState<
    number | null
  >(comparisons.length > 0 ? 0 : null);

  const calculatePairs = (n: number) => {
    return (n * (n - 1)) / 2;
  };

  const [surveyStarted, setSurveyStarted] = useState<boolean>(
    comparisons.length < calculatePairs(survey.image_count)
  );

  useEffect(() => {
    if (nextComparison) {
      setCurrentComparisonIndex((prevIndex) =>
        prevIndex !== null && prevIndex + 1 < comparisons.length
          ? prevIndex + 1
          : null
      );
      setNextComparison(false);
    }
  }, [nextComparison, comparisons.length]);

  return (
    <>
      {surveyStarted ? (
        <Container size="xl">
          {currentComparisonIndex !== null ? (
            <ComparisonForm
              comparison={comparisons[currentComparisonIndex]}
              finished={() => setNextComparison(true)}
              key={comparisons[currentComparisonIndex].id}
            />
          ) : (
            <Container size="md" mb={150}>
              <Questionaire />
            </Container>
          )}
        </Container>
      ) : (
        <Container size="md" mb={150} mt={50}>
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
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Text>
          <Text fw="bold" mt={15} mb={5}>
            Ablauf der Nutzerstudie:
          </Text>
          <List mb={20}>
            <ListItem>
              Es wird eine Reihe von Gruppenbildern von Ihnen aufgenommen
            </ListItem>
            <ListItem>
              Darauffolgend erhalten Sie einen Link zur Umfrage. In dieser musst
              du mithilfe von paarweisen Vergleichen die Bildqualität der
              einzelnen Bilder bewerten.
            </ListItem>
            <ListItem>
              Im Anschluss erhälst du ein paar allgemeine Fragen dazu, anhand
              was du die Qualität von Gruppenbildern festmachst.
            </ListItem>
            <ListItem>
              Die Umfrage dauert ca. 10-15 Minuten und kann bequem von zu Hause
              aus durchgeführt werden.
            </ListItem>
            <ListItem>
              Die Bilder können nur von Teilnehmern der Umfrage gesehen werden.
              Die Ergebnisse werden anonymisiert ausgewertet.
            </ListItem>
          </List>
          <PwcExample />
          <Flex justify="center">
            <Button size="md" onClick={() => setSurveyStarted(true)}>
              Umfrage starten
            </Button>
          </Flex>
        </Container>
      )}
    </>
  );
};
