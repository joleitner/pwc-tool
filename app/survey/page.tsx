import { redirect } from "next/navigation";

import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Container, Flex, Text } from "@mantine/core";
import { IconLogin, IconMail } from "@tabler/icons-react";
import { MagicLinkForm } from "@/components/MagicLinkForm";

export default async function SurveyPage() {
  const supabase = await createServerSupabase();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <>
      <Header />
      <Container size="md" style={{ height: "calc(100vh - 150px - 210px)" }}>
        {user ? (
          <>
            <h1>Survey</h1>
            <p>Survey page content</p>
          </>
        ) : (
          <>
            <Flex
              mih="100%"
              align="center"
              justify="center"
              direction="column"
              gap={10}
            >
              <IconLogin size={50} color="gray" />

              <Text fw="bold">Neuen Loginlink anfordern</Text>
              <Text ta="center">
                Du hast dich erfolgreich registriert aber dein Loginlink ist
                abgelaufen?
              </Text>
              <MagicLinkForm w={250} />
            </Flex>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}
