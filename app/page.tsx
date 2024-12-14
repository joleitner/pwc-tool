import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { PwcExample } from "@/components/PwcExample/PwcExample";
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
        <Container size="md">
          <Title order={2} size="h3" mb="md">
            Umfrage zur ästhetischen Qualität von Gruppenbildern
          </Title>
          <Text my={5}>
            Wir kennen es doch alle: Man war mit Freunden unterwegs und hat
            schöne Erinnerungsfotos aufgenommen. Beim Teilen entstehen oft
            mehrere Serien von Gruppenfotos, die sich ähnlich sehen. Aber
            eigentlich will doch jeder nur das Beste davon, oder? Sortiert man
            die Bilder nicht gleich aus, sammeln sich im Laufe der Zeit viele
            solcher Fotoserien an. "Welches war jetzt nochmal das eine schöne,
            das ich jemandem schicken wollte?"
          </Text>
          <Text my={5}></Text>
        </Container>
        <PwcExample />
        <Container size="md">
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
