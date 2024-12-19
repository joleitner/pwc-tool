import { DataPrivacy } from "@/components/DataPrivacy/DataPrivacy";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Container, Paper, Title } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Header />
      <Container size="md">
        <Paper shadow="md" p={30} radius="md" my={20} withBorder>
          <Title order={1} mb="md">
            Datenschutzerklärung
          </Title>
          <DataPrivacy />
        </Paper>
      </Container>

      <Footer />
    </>
  );
}
