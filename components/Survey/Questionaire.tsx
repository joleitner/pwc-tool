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
  const smallScreen = useMediaQuery("(max-width: 768px)", true);
  const {
    participation: { survey },
  } = useSurveyContext();

  const questions = [
    {
      key: "eyes",
      label: "dass alle Personen auf dem Bild die Augen geöffnet haben.",
    },
    { key: "smile", label: "dass die meisten Personen Freude ausdrücken." },
    {
      key: "gaze",
      label: "dass die meisten Personen in die Kamera schauen?",
    },
    {
      key: "occluded",
      label: "dass keine Gesicht verdeckt oder abgeschnitten ist?",
    },
    { key: "sharpness", label: "dass das Bild scharf ist?" },
    {
      key: "lighting",
      label:
        "dass die Beleuchtung im Bild gleichmäßig ist (z. B. keine starken Schatten oder Reflexionen auf den Gesichtern/Personen)?",
    },
    {
      key: "face_orientation",
      label: "dass die Personen den Kopf nicht zu stark wegdrehen",
    },
    { key: "centering", label: "dass die Gruppe im Bild zentriert ist?" },
    {
      key: "self_observation",
      label: "dass oben genannte Kriterien vorallem auf mich zutreffen?",
    },
    {
      key: "background",
      label: "dass der Hintergrund mit der Gesamtbild harmoniert?",
    },
  ];

  const radioOptions = [
    { value: "1", label: "Sehr unwichtig" },
    { value: "2", label: "Unwichtig" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Wichtig" },
    { value: "5", label: "Sehr wichtig" },
  ];

  // loop through questions to create initial values and validation rules
  const initialValues: any = {
    additional_features: "",
  };
  const validate: any = {};
  questions.forEach((question) => {
    initialValues[question.key] = "";
    validate[question.key] = isNotEmpty("Bitte wähle eine Option aus.");
  });

  const form = useForm({
    initialValues,
    validate,
  });

  const handleSubmit = async (values: any) => {
    if (form.isValid()) {
      const { error } = await saveQuestionaireAnswers(survey.id, values);

      if (!error) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Paper withBorder p={smallScreen ? 25 : 50} mt={80} shadow="lg">
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
                  py={smallScreen ? 2 : 10}
                  key={form.key(question.key)}
                  {...form.getInputProps(question.key)}
                >
                  <Flex
                    p={smallScreen ? "sm" : "lg"}
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
              mt={smallScreen ? "md" : "lg"}
              autosize
              minRows={4}
              label="Mir sind noch weitere Eigenschaften wichtig bei Gruppenfotos die oben noch nicht genannt wurden (oder sonstige Anmerkungen):"
              {...form.getInputProps("additional_features")}
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
