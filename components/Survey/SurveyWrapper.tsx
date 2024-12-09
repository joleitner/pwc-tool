"use client";

import { PairwiseComparison, Participation } from "@/types";
import { SurveyProvider } from "./SurveyProvider";
import { Survey } from "./Survey";
import { useEffect, useState } from "react";
import { useFileUtils } from "@/utils/useFileUtils";

type Props = {
  participation: Participation;
  comparisons: PairwiseComparison[];
  images: { id: number; path: string }[];
};

export const SurveyWrapper = ({
  comparisons,
  images,
  participation,
}: Props) => {
  const [imageUrls, setImageUrls] = useState<{ [id: number]: string }>({});
  const { getFileUrl } = useFileUtils();

  useEffect(() => {
    const getImageUrls = async () => {
      const urls = await Promise.all(
        images.map(async (image) => ({
          id: image.id,
          url: await getFileUrl(image.path),
        }))
      );

      const imageUrls = urls.reduce<{ [id: number]: string }>(
        (acc, { id, url }) => {
          acc[id] = url;
          return acc;
        },
        {}
      );

      setImageUrls(imageUrls);

      // preload images
      urls.forEach(({ url }) => {
        const img = new Image();
        img.src = url;
      });
    };
    getImageUrls();
  }, []);

  return (
    <SurveyProvider
      comparisons={comparisons}
      imageUrls={imageUrls}
      participation={participation}
    >
      <Survey />
    </SurveyProvider>
  );
};
