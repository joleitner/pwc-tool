"use client";

import { getSurveyScores } from "@/actions/survey";
import { useImageProvider } from "@/utils/useImageProvider";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Props = Partial<FlexProps> & {
  surveyId: number;
  images: { id: number; path: string }[];
};

export const ImageRanking = ({ surveyId, images, ...props }: Props) => {
  const { imageUrls } = useImageProvider(surveyId, images);
  const [imageScores, setImageScores] = useState<
    { id: number; score: number }[]
  >([]);

  useEffect(() => {
    const fetchScores = async () => {
      const result = await getSurveyScores(surveyId);

      const scores = result.scores_mean.map((score, index) => {
        return { id: images[index].id, score };
      });
      // sort by score
      scores.sort((a, b) => b.score - a.score);

      setImageScores(scores);
    };
    fetchScores();
  }, []);

  return (
    <Flex {...props} h={400} gap="xs" wrap="wrap">
      {imageScores.length === 0 ? (
        <Flex h="100%" w="100%" align="center" justify="center">
          <Loader type="bars" />
        </Flex>
      ) : (
        <Carousel
          my="lg"
          withIndicators
          height="100%"
          w="100%"
          slideSize={{ base: "100%", sm: "50%" }}
          slideGap={{ base: 0, sm: "xs" }}
        >
          {imageScores.map((image, index) => (
            <CarouselSlide key={index}>
              <Stack gap={0}>
                <Center>
                  <Text>Score: {Math.round(image.score * 1000) / 1000}</Text>
                </Center>
                <Box
                  style={{
                    aspectRatio: 1,
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={imageUrls[image.id]}
                    alt={`Group Image - Score ${image.score} `}
                    key={index}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "inline-block",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Stack>
            </CarouselSlide>
          ))}
        </Carousel>
      )}
    </Flex>
  );
};
