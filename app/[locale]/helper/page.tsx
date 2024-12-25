import { getAuthUser } from "@/actions/auth";
import { getRegistrations } from "@/actions/survey";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { HelperForm } from "@/components/Helper/HelperForm";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getAuthUser();

  if (user?.role !== "helper" && user?.role !== "admin") {
    redirect("/");
  }

  const { data: registrations } = await getRegistrations();

  return (
    <>
      <Header />
      <HelperForm registrations={registrations || []} />
      <Footer />
    </>
  );
}
