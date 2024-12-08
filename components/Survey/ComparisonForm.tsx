import { PairwiseComparison } from "@/types";
import { Button, Center, Flex, Overlay, Title } from "@mantine/core";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useSurveyContext } from "./SurveyProvider";
import { sendPwcResult } from "@/actions/survey";

type Props = {
  comparison: PairwiseComparison;
  finished: () => void;
};

export const ComparisonForm = ({ comparison, finished }: Props) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { imageUrls } = useSurveyContext();

  const images = [comparison.image_1, comparison.image_2];

  const timeStart = new Date();

  const handleSubmit = async () => {
    if (!selectedImage) return;
    const timeTaken = new Date().getTime() - timeStart.getTime();

    await sendPwcResult(comparison.id, selectedImage, timeTaken);

    finished();
  };

  return (
    <>
      <Title order={3} mb={40} mt={40}>
        Welches Bild gefällt dir besser?
      </Title>
      <Flex gap={10} h="100%" align="center">
        {images.map((image, index) => (
          <Flex
            align="center"
            justify="center"
            pos="relative"
            w="50%"
            style={{
              aspectRatio: "1/1",
            }}
            key={image.id}
          >
            <img
              src={imageUrls[image.id]}
              alt={`Gruppenfoto ${index + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              onClick={() => setSelectedImage(image.id)}
            />
            {selectedImage === image.id && (
              <Overlay color="#000" backgroundOpacity={0.4} zIndex={2}>
                <Center h="100%">
                  <IconCircleDashedCheck
                    color="var(--mantine-primary-color-6)"
                    size={60}
                  />
                </Center>
              </Overlay>
            )}
          </Flex>
        ))}
      </Flex>
      <Flex justify="flex-end" mt={40}>
        <Button disabled={!selectedImage} onClick={handleSubmit}>
          Weiter
        </Button>
      </Flex>
    </>
  );
};
