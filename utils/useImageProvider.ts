import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useFileUtils } from "./useFileUtils";

export const useImageProvider = (
  surveyId: number,
  images: { id: number; path: string }[]
) => {
  const [imageUrls, setImageUrls] = useLocalStorage<{ [id: number]: string }>({
    key: `imageUrls-survey${surveyId}`,
    defaultValue: {},
  });
  const [urlExpiry, setUrlExpiry] = useLocalStorage<number>({
    key: `urlExpiry-survey${surveyId}`,
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
    console.log("fetching image urls");
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
    };
    getUrls();
  }, [storageLoaded]);

  return { imageUrls };
};
