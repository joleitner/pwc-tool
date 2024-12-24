import { sendPwcResult } from "@/actions/survey";
import {
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Overlay,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSurveyContext } from "../SurveyProvider";
import classes from "./ComparisonForm.module.css";
import { useTranslations } from "next-intl";

type Props = {
  comparison: number[];
  finished: () => void;
};

export const ComparisonForm = ({ comparison, finished }: Props) => {
  const t = useTranslations("ComparisonForm");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false]);
  const [loading, setLoading] = useState(false);
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const {
    imageUrls,
    participation: { survey },
  } = useSurveyContext();

  const largerThanMd = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const timeTaken = new Date().getTime() - timeStart!.getTime();
    await sendPwcResult(survey.id, comparison, selectedImage, timeTaken);

    setSelectedImage(null);
    setLoading(false);
    finished();
  };

  useEffect(() => {
    if (imagesLoaded.every((loaded) => loaded)) {
      setTimeStart(new Date());
    }
  }, [imagesLoaded]);

  return (
    <>
      <Title order={3} mb={largerThanMd ? 40 : 5} mt={40}>
        {t("text")}
      </Title>
      <Box className={classes.wrapper}>
        {comparison.map((imageId, index) => (
          <Box className={classes.imageContainer} key={imageId}>
            {imageUrls[imageId] ? (
              <img
                src={imageUrls[imageId]}
                alt={`Gruppenfoto ${index + 1}`}
                className={classes.image}
                onClick={() => setSelectedImage(imageId)}
                onLoad={() => {
                  setImagesLoaded((prev) =>
                    prev.map((value, i) => (i === index ? true : value))
                  );
                }}
              />
            ) : (
              <Loader />
            )}

            {selectedImage === imageId && (
              <Overlay
                color="#000"
                backgroundOpacity={0.4}
                zIndex={2}
                onClick={() => setSelectedImage(null)}
              >
                <Center h="100%">
                  <IconCircleDashedCheck
                    color="var(--mantine-primary-color-6)"
                    size={60}
                  />
                </Center>
              </Overlay>
            )}
          </Box>
        ))}
      </Box>
      <Flex justify="flex-end" mt={40} mb={largerThanMd ? 0 : 40}>
        <Button
          disabled={(!selectedImage && timeStart === null) || loading}
          loading={loading}
          onClick={handleSubmit}
        >
          {t("submit")}
        </Button>
      </Flex>
    </>
  );
};
