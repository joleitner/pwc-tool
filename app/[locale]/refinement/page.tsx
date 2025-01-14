import { getAuthUser } from "@/actions/auth";
import { areSurveysAvailable } from "@/actions/refinement";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { RefineContent } from "@/components/Refine/RefineContent";
import { redirect } from "next/navigation";

export default async function RefinePage() {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?next=/refinement`);
  }

  const surveysAvailable = await areSurveysAvailable();

  return (
    <>
      <Header />
      <RefineContent surveysAvailable={surveysAvailable} />
      <Footer />
    </>
  );
}
