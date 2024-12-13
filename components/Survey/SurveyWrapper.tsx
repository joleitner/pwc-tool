"use client";

import { PairwiseComparison, Participation } from "@/types";
import { useFileUtils } from "@/utils/useFileUtils";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Survey } from "./Survey";
import { SurveyProvider } from "./SurveyProvider";

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
  const [imageUrls, setImageUrls] = useLocalStorage<{ [id: number]: string }>({
    key: "imageUrls",
    defaultValue: {},
  });
  const [urlExpiry, setUrlExpiry] = useLocalStorage<number>({
    key: "urlExpiry",
    defaultValue: 0,
  });
  const [storageLoaded, setStorageLoaded] = useState(false);
  const { getSignedFileUrl } = useFileUtils();

  const fetchImageUrls = async () => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < urlExpiry) {
      return imageUrls;
    }

    const valid = 3600; // 1 hour

    const urls = await Promise.all(
      images.map(async (image) => ({
        id: image.id,
        url: await getSignedFileUrl(image.path, valid),
      }))
    );
    if (urls.length > 0) {
      setUrlExpiry(currentTime + valid);
    }

    return urls.reduce<{ [id: number]: string }>((acc, { id, url }) => {
      acc[id] = url;
      return acc;
    }, {});
  };

  useEffect(() => {
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    const getUrls = async () => {
      const urls = await fetchImageUrls();
      setImageUrls(urls);
      console.log("urls", urls);
    };
    getUrls();
  }, [storageLoaded]);

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
