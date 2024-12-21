"use client";

import { Participation } from "@/types";
import { useImageProvider } from "@/utils/useImageProvider";
import { Survey } from "./Survey";
import { SurveyProvider } from "./SurveyProvider";

type Props = {
  participation: Participation;
  comparisons: number[][];
  images: { id: number; path: string }[];
};

export const SurveyWrapper = ({
  comparisons,
  images,
  participation,
}: Props) => {
  const { imageUrls } = useImageProvider(participation.survey.id, images);

  return (
    <SurveyProvider
      initialComparisons={comparisons}
      imageUrls={imageUrls}
      participation={participation}
    >
      <Survey />
    </SurveyProvider>
  );
};
