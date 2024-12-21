import { getAuthUser } from "@/actions/auth";
import { Header } from "@/components/Header/Header";
import { LoginForm } from "@/components/Admin/LoginForm";
import { Center, Container, Title } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getAuthUser();

  if (user && user.role === "admin") {
    redirect("/admin");
  }

  return (
    <>
      <Header />
      <Container size="xs">
        <Center mb="md">
          <Title order={2}>Login</Title>
        </Center>
        <LoginForm />
      </Container>
    </>
  );
}
