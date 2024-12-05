import { Box, Center, Flex, Overlay, Paper, Text } from "@mantine/core";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import Image from "next/image";

export const PwcExample = () => (
  <Paper shadow="md" p={30} radius="md" my={50} withBorder>
    <Text fw="bold" mb={15}>
      Welches Bild gefällt dir besser?
    </Text>
    <Flex gap={10}>
      <Box w="50%" pos="relative">
        <Image
          src="/group_image_1.jpg"
          alt="Logo"
          width={750}
          height={500}
          style={{ width: "100%", height: "100%" }}
        />
        <Overlay color="#000" backgroundOpacity={0.4} zIndex={2}>
          <Center h="100%">
            <IconCircleDashedCheck
              color="var(--mantine-primary-color-6)"
              size={60}
            />
          </Center>
        </Overlay>
      </Box>
      <Box w="50%">
        <Image
          src="/group_image_2.jpg"
          alt="Logo"
          width={750}
          height={500}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Flex>
  </Paper>
);
