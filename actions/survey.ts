"use server";

import { DetailedSurvey, Participation } from "@/types";
import { convertToPwcObjects, createPWCMatrix } from "@/utils/pwcMatrix";
import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { getAuthUser } from "./auth";

export async function getRegistrations() {
  const supabase = await createServerSupabase();

  return await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function deleteRegistration(id: string) {
  const supabase = await createServerSupabase();

  return await supabase.from("registrations").delete().eq("id", id);
}

export async function getSurveys() {
  const supabase = await createServerSupabase();

  return await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getSurveyInfo(
  surveyId: number
): Promise<DetailedSurvey | null> {
  const supabase = await createServerSupabase();

  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .single();

  if (!survey) return null;

  const [{ data: participations }, { data: pwcResults }, { data: images }] =
    await Promise.all([
      supabase
        .from("participations")
        .select("user(id, name), started, finished")
        .eq("survey", surveyId)
        .returns<
          {
            user: { id: string; name: string };
            started: string;
            finished: string;
          }[]
        >(),
      supabase.from("pwc_results").select().eq("survey", surveyId),
      getImages(surveyId),
    ]);

  const participationsWithCount: any = [];

  for (const participation of participations!) {
    const comparison_count = pwcResults!.filter(
      (result) => result.user === participation.user.id
    ).length;
    participationsWithCount.push({ ...participation, comparison_count });
  }

  return {
    ...survey!,
    participations: participationsWithCount,
    comparison_count: pwcResults!.length,
    images: images!,
  };
}

export async function getSurveyScores(
  surveyId: number
): Promise<{ scores_mean: number[]; scores_std: number[] }> {
  const supabase = await createServerSupabase();

  const [{ data: pwcResults }, { data: images }] = await Promise.all([
    supabase.from("pwc_results").select().eq("survey", surveyId),
    getImages(surveyId),
  ]);

  // get scores for images
  const imageIds = images!.map((image) => image.id);
  const pwc_matrix = createPWCMatrix(imageIds, pwcResults!);
  const asapResult = await fetch(`${process.env.ASAP_API_URL}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pwc_matrix,
    }),
  });
  return await asapResult.json();
}

export async function createNewSurvey(data: any) {
  const supabase = await createServerSupabase();

  return await supabase.from("surveys").insert([data]).select().single();
}

export async function createImageEntries(
  surveyId: number,
  filenames: string[],
  metadata: any
) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("images")
    .insert(
      filenames.map((filename) => ({
        survey: surveyId,
        path: filename,
        metadata,
      }))
    )
    .select("id");
}

export async function getImages(surveyId: number) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("images")
    .select("id, path")
    .eq("survey", surveyId)
    .order("id");
}

export async function getParticipation(surveyId: string, userId: string) {
  const supabase = await createServerSupabase();

  const { data: survey, error } = await supabase
    .from("surveys")
    .select("id")
    .eq("public_id", surveyId)
    .single();

  if (error || !survey?.id) return { data: null };

  return await supabase
    .from("participations")
    .select("*, survey(id, image_count)")
    .eq("survey", survey.id)
    .eq("user", userId)
    .returns<Participation[]>()
    .single();
}

export async function isQuestionnaireFinished() {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();

  const { data } = await supabase
    .from("questionnaires")
    .select("id")
    .eq("user", user!.id)
    .single();

  return Boolean(data);
}

export async function getComparisonBatch(surveyId: number) {
  const supabase = await createServerSupabase();

  try {
    // 1. fetch all necessary data from supabase
    const [user, { data: images }, { data: pwcResults }] = await Promise.all([
      getAuthUser(),
      getImages(surveyId),
      supabase.from("pwc_results").select().eq("survey", surveyId),
    ]);

    if (!user) throw new Error("User not authenticated");
    if (!images) throw new Error("Error when fetching images");
    if (!pwcResults) throw new Error("Error when fetching results");

    // 2 see if user has already answered certain amount
    const userResults = pwcResults.filter(
      (result) => result.user === user.id && result.survey === surveyId
    );
    if (userResults.length >= (images.length - 1) * 2) {
      return { data: [], error: null };
    }

    // 3. create pwc_matrix
    const imageIds = images.map((image) => image.id);
    const pwc_matrix = createPWCMatrix(imageIds, pwcResults);

    // 4. send pwc_matrix to asap api
    const asapResult = await fetch(`${process.env.ASAP_API_URL}/asap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pwc_matrix,
      }),
    });
    const data = await asapResult.json();

    // 5. convert answer to next pairs with correct ids
    const nextPairs = convertToPwcObjects(imageIds, data.pairs);

    return { data: nextPairs, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function saveQuestionaireAnswers(surveyId: number, answers: any) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("questionnaires")
    .insert([{ ...answers, user: user!.id }])
    .single();

  await supabase
    .from("participations")
    .update({
      finished: new Date().toISOString(),
    })
    .eq("survey", surveyId)
    .eq("user", user!.id);

  return { data, error };
}

export async function sendPwcResult(
  survey: number,
  pair: number[],
  choice: number,
  timeTaken: number
) {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();
  if (!user) return;

  return supabase.from("pwc_results").insert({
    user: user.id,
    survey,
    image_1: pair[0],
    image_2: pair[1],
    choice,
    time_taken: timeTaken,
  });
}

export async function sendSurveyStarted(surveyId: number) {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();
  if (!user) return;

  return supabase
    .from("participations")
    .update({
      started: new Date().toISOString(),
    })
    .eq("survey", surveyId)
    .eq("user", user!.id);
}

export async function sendSurveyFinished(surveyId: number) {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();
  if (!user) return;

  return supabase
    .from("participations")
    .update({
      finished: new Date().toISOString(),
    })
    .eq("survey", surveyId)
    .eq("user", user!.id);
}
