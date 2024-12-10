import { Box, Center, Overlay, Paper, Text } from "@mantine/core";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import Image from "next/image";
import groupImage1 from "../../public/group_image_1.webp";
import groupImage2 from "../../public/group_image_2.webp";
import classes from "./PwcExample.module.css";

export const PwcExample = () => (
  <Paper shadow="md" p={30} radius="md" my={50} withBorder>
    <Text fw="bold" mb={15}>
      Welches Bild gefällt dir besser?
    </Text>
    <Box className={classes.wrapper}>
      <Box className={classes.imageContainer}>
        <Image
          src={groupImage1}
          alt="Gruppenfoto 1 von Tim Mossholder auf Unsplash"
          className={classes.image}
        />
        <Overlay color="#000" backgroundOpacity={0.4} zIndex={2}>
          <Center h="100%">
            <IconCircleDashedCheck
              color="var(--mantine-primary-color-6)"
              size={50}
            />
          </Center>
        </Overlay>
      </Box>
      <Box className={classes.imageContainer}>
        <Image
          src={groupImage2}
          alt="Gruppenfoto 2 von Tim Mossholder auf Unsplash"
          className={classes.image}
        />
      </Box>
    </Box>
  </Paper>
);
