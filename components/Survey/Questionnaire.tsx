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
import { useTranslations } from "next-intl";

export const Questionnaire = () => {
  const t = useTranslations("Questionnaire");
  const smallScreen = useMediaQuery("(max-width: 768px)", true);
  const {
    participation: { survey },
  } = useSurveyContext();

  const questions = [
    {
      key: "eyes",
      label: t("eyes"),
    },
    { key: "smile", label: t("smile") },
    {
      key: "gaze",
      label: t("gaze"),
    },
    {
      key: "occluded",
      label: t("occluded"),
    },
    { key: "sharpness", label: t("sharpness") },
    {
      key: "lighting",
      label: t("lighting"),
    },
    {
      key: "face_orientation",
      label: t("faceOrientation"),
    },
    { key: "centering", label: t("centering") },
    {
      key: "self_observation",
      label: t("selfObservation"),
    },
    {
      key: "background",
      label: t("background"),
    },
  ];

  const radioOptions = [
    { value: "1", label: t("radioOption1") },
    { value: "2", label: t("radioOption2") },
    { value: "3", label: t("radioOption3") },
    { value: "4", label: t("radioOption4") },
    { value: "5", label: t("radioOption5") },
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
          {t("title")}
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Text fw="bold">{t("text")}</Text>

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
              label={t("additional")}
              {...form.getInputProps("additional_features")}
            />
          </Stack>

          <Flex justify="center" mt="md">
            <Button type="submit" disabled={!form.isValid()}>
              {t("submit")}
            </Button>
          </Flex>
        </form>
      </Paper>
    </>
  );
};
