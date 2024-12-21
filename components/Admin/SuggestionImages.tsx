"use client";

import { useImageProvider } from "@/utils/useImageProvider";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Box, Flex, FlexProps } from "@mantine/core";

type Props = Partial<FlexProps> & {
  suggestionId: number;
  images: string[];
};

export const SuggestionImages = ({ suggestionId, images, ...props }: Props) => {
  const { imageUrls } = useImageProvider(
    suggestionId,
    images.map((image, index) => ({ id: index, path: image }))
  );

  return (
    <Flex {...props} h={400} gap="xs" wrap="wrap">
      <Carousel
        my="lg"
        withIndicators
        // heioght="100%"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        // w="100%"
        slideSize={{ base: "100%", sm: "50%" }}
        slideGap={{ base: 0, sm: "xs" }}
      >
        {Object.values(imageUrls).map((imageUrl, index) => (
          <CarouselSlide key={index} style={{ height: "100%" }}>
            <Box
              style={{
                aspectRatio: 1,
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <img
                src={imageUrl}
                alt={`Group Image`}
                key={index}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  objectFit: "contain",
                }}
              />
            </Box>
          </CarouselSlide>
        ))}
      </Carousel>
    </Flex>
  );
};
