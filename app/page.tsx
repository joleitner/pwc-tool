import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { PwcExample } from "@/components/PwcExample";
import {
  Button,
  Container,
  Flex,
  List,
  ListItem,
  Text,
  Title,
} from "@mantine/core";

export default function Home() {
  return (
    <>
      <Header />
      <Container size="lg">
        <PwcExample />
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
