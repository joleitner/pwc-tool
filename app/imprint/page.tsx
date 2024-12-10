import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Container, Paper, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Header />
      <Container size="md" style={{ minHeight: "calc(100vh - 150px - 210px)" }}>
        <Paper shadow="md" p={30} radius="md" my={20} withBorder>
          <Title order={2} mb="md">
            Impressum
          </Title>
          <Text>
            Jonas Leitner
            <br />
            Masterstudent an der Hochschule München
            <br />
            Knorrstr. 83
            <br />
            80807 München
          </Text>
          <Title order={3} size="h4" mt="md">
            Kontakt
          </Title>
          <Text>E-Mail: jonas.leitner@hm.edu</Text>
          <Title order={3} size="h4" mt="md">
            Berufsbezeichnung und berufsrechtliche Regelungen
          </Title>
          <Text>
            Berufsbezeichnung:
            <br />
            Student
          </Text>
          <Title order={3} size="h4" mt="md">
            EU-Streitschlichtung
          </Title>
          <Text>
            Die Europ&auml;ische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .<br /> Meine E-Mail-Adresse finden Sie oben im Impressum.
          </Text>
          <Title order={3} size="h4" mt="md">
            Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle
          </Title>
          <Text>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </Text>

          <Text mt="xl">
            Quelle:{" "}
            <a href="https://www.e-recht24.de/impressum-generator.html">
              https://www.e-recht24.de/impressum-generator.html
            </a>
          </Text>
        </Paper>
      </Container>

      <Footer />
    </>
  );
}
