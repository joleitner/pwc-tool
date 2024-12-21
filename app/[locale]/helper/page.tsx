import { getAuthUser } from "@/actions/auth";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { HelperForm } from "@/components/Helper/HelperForm";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getAuthUser();

  if (user?.role !== "helper" && user?.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <Header />
      <HelperForm />
      <Footer />
    </>
  );
}
