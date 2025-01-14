"use client";

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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { OrderQuestion } from "./OrderQuestion";
import { useSurveyContext } from "./SurveyProvider";

export const Questionnaire = () => {
  const t = useTranslations("Questionnaire");
  const [loading, setLoading] = useState(false);
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
    {
      key: "lighting",
      label: t("lighting"),
    },
    {
      key: "face_orientation",
      label: t("faceOrientation"),
    },
    {
      key: "self_observation",
      label: t("selfObservation"),
    },
    { key: "centering", label: t("centering") },
    { key: "sharpness", label: t("sharpness") },
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
  ];

  const featureItems = [
    { value: "eyes", label: t("featureEyes") },
    { value: "smile", label: t("featureSmile") },
    { value: "gaze", label: t("featureGaze") },
    { value: "occluded", label: t("featureOccluded") },
    { value: "lighting", label: t("featureLighting") },
    { value: "face_orientation", label: t("featureFaceOrientation") },
    { value: "background", label: t("featureBackground") },
    { value: "centering", label: t("featureCentering") },
    { value: "sharpness", label: t("featureSharpness") },
  ];

  const [featureOrder, setFeatureOrder] = useState<string[]>([]);

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
    if (
      form.isValid() &&
      featureOrder.length === featureItems.length &&
      !loading
    ) {
      setLoading(true);
      const { error } = await saveQuestionaireAnswers(survey.id, {
        ...values,
        feature_order: featureOrder,
      });
      setLoading(false);

      if (!error) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Paper
        withBorder
        px={smallScreen ? "xs" : "xl"}
        py="xl"
        mt={smallScreen ? "sm" : 80}
        shadow="lg"
      >
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

            <OrderQuestion
              title={t("orderQuestion")}
              items={featureItems}
              setOrderedList={setFeatureOrder}
            />
            <Textarea
              mt={smallScreen ? "md" : "lg"}
              autosize
              minRows={4}
              label={t("additional")}
              {...form.getInputProps("additional_features")}
            />
          </Stack>

          <Flex justify="center" mt="md">
            <Button
              type="submit"
              disabled={
                !form.isValid() ||
                featureOrder.length !== featureItems.length ||
                loading
              }
              loading={loading}
            >
              {t("submit")}
            </Button>
          </Flex>
        </form>
      </Paper>
    </>
  );
};
