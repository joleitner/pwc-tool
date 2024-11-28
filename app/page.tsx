import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import {
  Box,
  Center,
  Container,
  Flex,
  Overlay,
  Paper,
  Title,
  Text,
  List,
  ListItem,
  Button,
} from "@mantine/core";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <Container size="lg" miw="100vh">
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
        <Container size="md">
          <Title order={2} size="h3">
            Bewertung der Bildqualität von Gruppenbildern
          </Title>
          <Text my={5}>
            Wenn man als Gruppe unterwegs ist, nimmt man häufiger gerne
            Gruppenbilder auf um sich auch noch später an die guten alten Zeiten
            zu erinnern.
          </Text>
          <Text my={5}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Text>
          <List>
            <ListItem>Weil es einfach cool ist!</ListItem>
            <ListItem>Hilf mir es besser zu machen</ListItem>
            <ListItem>Wäre das nicht viel leichter und schneller?</ListItem>
          </List>
          <Flex justify="center" my={30}>
            <Button component="a" href="/participate">
              An Umfrage teilnehmen!
            </Button>
          </Flex>
        </Container>
      </Container>

      <Footer />
    </>
  );
}
