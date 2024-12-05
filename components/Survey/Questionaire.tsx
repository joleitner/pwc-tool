import { saveQuestionaireAnswers } from "@/actions/survey";
import {
  Button,
  Flex,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useSurveyContext } from "./SurveyProvider";

export const Questionaire = () => {
  const smallScreen = useMediaQuery("(max-width: 768px)");
  const { surveyId } = useSurveyContext();

  const questions = [
    {
      key: "question1",
      label: "dass alle Personen auf dem Bild die Augen geöffnet haben.",
    },
    { key: "question2", label: "dass die meisten Personen Freude ausdrücken." },
    {
      key: "question3",
      label: "dass die meisten Personen in die Kamera schauen?",
    },
    {
      key: "question4",
      label: "dass keine Gesicht verdeckt oder abgeschnitten ist?",
    },
    { key: "question5", label: "dass das Bild scharf ist?" },
  ];

  const form = useForm({
    initialValues: {
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
      question11: "",
    },
    validate: {
      question1: isNotEmpty("Dieses Feld ist erforderlich"),
      question2: isNotEmpty("Dieses Feld ist erforderlich"),
      question3: isNotEmpty("Dieses Feld ist erforderlich"),
      question4: isNotEmpty("Dieses Feld ist erforderlich"),
      question5: isNotEmpty("Dieses Feld ist erforderlich"),
    },
  });

  const radioOptions = [
    { value: "1", label: "Sehr unwichtig" },
    { value: "2", label: "Unwichtig" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Wichtig" },
    { value: "5", label: "Sehr wichtig" },
  ];

  const handleSubmit = async (values: any) => {
    if (form.isValid()) {
      const { error } = await saveQuestionaireAnswers(surveyId, values);

      if (!error) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Paper withBorder p={50} mt={80} shadow="lg">
        <Title order={3} mb={40}>
          Fragebogen
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Text fw="bold">
              Bei der Auswahl der Gruppenbilder ist es mir wichtig, …
            </Text>

            {questions.map((question) => {
              return (
                <RadioGroup
                  label={question.label}
                  mb="lg"
                  py={10}
                  key={form.key(question.key)}
                  {...form.getInputProps(question.key)}
                >
                  <Flex
                    p="lg"
                    justify="space-evenly"
                    direction={smallScreen ? "column" : "row"}
                  >
                    {radioOptions.map((option) => (
                      <Radio
                        key={`${question.key}_${option.value}`}
                        value={option.value}
                        label={option.label}
                        my={smallScreen ? 3 : 0}
                      />
                    ))}
                  </Flex>
                </RadioGroup>
              );
            })}

            <Textarea
              mt="xl"
              autosize
              minRows={4}
              label="Mir sind noch weitere Eigenschaften wichtig bei Gruppenfotos die oben noch nicht genannt wurden:"
              {...form.getInputProps("question11")}
            />
          </Stack>

          <Flex justify="center" mt="md">
            <Button type="submit" disabled={!form.isValid()}>
              Umfrage abschicken
            </Button>
          </Flex>
        </form>
      </Paper>
    </>
  );
};
