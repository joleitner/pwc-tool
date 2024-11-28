import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ParticapteForm } from "@/components/ParticipateForm";
import {
  Center,
  Container,
  Title,
  Text,
  Box,
  ListItem,
  List,
} from "@mantine/core";

export default function ParticipatePage() {
  return (
    <>
      <Header />
      <Container size="md" mih="70vh">
        <Title order={2} mb={40}>
          Danke für Ihre Hilfe!
        </Title>
        <Text>
          Vielen Dank, dass Sie sich bereit erklärt haben an der Nutzerstudie
          zur Qualitativen Bewertung von Gruppenbildern teilzunehmen! Um besser
          verstehen zu können, wie das schönste Gruppenbild aus einer Fotoreihe
          ausgewählt wird führe ich in Folge meiner Masterarbeit diese Umfrage
          durch. Ich möchte erforschen, ob es mithilfe von Deep Learning möglich
          ist sinnvolle Aussagen über die Bildqualität von Gruppenbildern zu
          treffen. Zur Validierung benötige ich Ihre Hilfe um echte Daten zu
          sammeln.
        </Text>
        <Text fw="bold" mt={15} mb={5}>
          Ablauf der Nutzerstudie:
        </Text>
        <List mb={20}>
          <ListItem>
            Es wird eine Reihe von Gruppenbildern von Ihnen aufgenommen
          </ListItem>
          <ListItem>
            Darauffolgend erhalten Sie einen Link zur Umfrage. In dieser müssen
            Sie mithilfe von paarweisen Vergleichen die Bildqualität der
            einzelnen Bilder bewerten.
          </ListItem>
          <ListItem>
            Im Anschluss erhalten Sie ein paar allgemeine Fragen dazu, an was
            sie die Qualität von Gruppenbildern festmachen.
          </ListItem>
          <ListItem>
            Die Umfrage dauert ca. 10-15 Minuten und kann bequem von zu Hause
            aus durchgeführt werden.
          </ListItem>
          <ListItem>
            Die Bilder können nur von Teilnehmern der Umfrage gesehen werden.
            Die Ergebnisse werden anonymisiert ausgewertet.
          </ListItem>
        </List>
        <Container size="sm">
          <ParticapteForm />
        </Container>
      </Container>
      <Footer />
    </>
  );
}
