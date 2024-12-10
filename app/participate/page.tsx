import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ParticapteForm } from "@/components/ParticipateForm";
import { Container, List, ListItem, Text, Title } from "@mantine/core";

export default function ParticipatePage() {
  return (
    <>
      <Header />
      <Container size="md" mih="70vh">
        <Container>
          <Title order={2} mb={40}>
            Danke für Deine Hilfe!
          </Title>
          <Text>
            Vielen Dank für deine Teilnahme an der Nutzerstudie zur qualitativen
            Bewertung von Gruppenbildern! Für uns Menschen ist es oft einfach zu
            entscheiden, welches Bild uns ästhetisch am besten gefällt. Dies
            geschieht jedoch oft auf einer unbewussten Ebene, wodurch es
            schwierig ist, genau zu verstehen, warum ein Bild einem anderen
            vorgezogen wird. Um diesen Prozess besser verstehen zu können, führe
            ich diese Umfrage für meine Masterarbeit durch. Ich möchte
            untersuchen, ob es möglich ist mit Hilfe von Deep Learning sinnvolle
            Aussagen über die ästhetische Qualität von Gruppenbildern zu
            treffen. Für die Validierung benötige ich deine Hilfe, um reale
            Daten zu sammeln.
          </Text>
          <Text fw="bold" mt={15} mb={5}>
            Ablauf der Nutzerstudie:
          </Text>
          <List mb={20}>
            <ListItem>
              Nachdem du deine Zustimmung zur Teilnahme an der Nutzerstudie
              gegeben hast, werden zu Beginn eine Reihe von Gruppenfotos von dir
              und deiner Gruppe gemacht.
            </ListItem>
            <ListItem>
              Die Bilder werden zu eurer Umfrage hinzugefügt und ihr erhaltet
              einen Link zur Umfrage per E-Mail.
            </ListItem>
            <ListItem>
              In der Umfrage wirst du die Qualität der einzelnen Bilder anhand
              von Paarvergleichen bewerten.
            </ListItem>
            <ListItem>
              Anschließend werden dir einige allgemeine Fragen gestellt, um
              herauszufinden, welche Faktoren die ästhetische Qualität der
              Gruppenfotos bestimmen.
            </ListItem>
            <ListItem>
              Die Umfrage dauert ca. 10 Minuten und kann direkt vom Smartphone
              oder idealerweise bequem von zu Hause aus durchgeführt werden.
            </ListItem>
            <ListItem>
              Die aufgenommenen Gruppenbilder können nur von (den Teilnehmern
              der Umfrage / eurer Gruppe) eingesehen werden. Die Ergebnisse
              werden pseudonymisiert ausgewertet.
            </ListItem>
          </List>
        </Container>

        <Container size="sm">
          <ParticapteForm />
        </Container>
      </Container>
      <Footer />
    </>
  );
}
