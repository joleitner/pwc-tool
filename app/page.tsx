import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { PwcExample } from "@/components/PwcExample/PwcExample";
import { Button, Container, Flex, Text, Title } from "@mantine/core";

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
            solcher Fotoserien an. &quot;Welches war jetzt nochmal das eine
            schöne, das ich jemandem schicken wollte?&quot;
          </Text>
          <Text my={5}>
            In meiner Masterarbeit möchte ich untersuchen, ob sich ein
            Machine-Learning-Modell entwickeln lässt, das Vorschläge zur
            ästhetischen Bildqualität liefert. KI-Assistenzsysteme sparen uns in
            vielen Bereichen bereits Zeit und Aufwand – warum also nicht auch in
            unserer Bildergalerie?
          </Text>
        </Container>
        <PwcExample />
        <Container size="md">
          <Text my={5}>
            Hier brauche ich Deine Unterstützung! Um die Funktionalität des
            entwickelten KI-Modells verlässlich zu überprüfen, benötige ich
            echte, gelabelte Daten zur Validierung. Dies ist nur mit der Hilfe
            vieler engagierter Freiwilliger möglich. Für die Validierung
            verwende ich die Methode der erzwungenen paarweisen Vergleiche
            (Forced Pairwise Comparison). Dabei werden jeweils zwei Bilder
            gegenübergestellt, und das Bild, das subjektiv als ästhetisch
            ansprechender empfunden wird, muss ausgewählt werden.
          </Text>
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
