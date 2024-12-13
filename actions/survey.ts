"use server";

import { Participation, PWCResultWithPair } from "@/types";
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

// export async function getSurveyInfo(surveyId: number): Promise<DetailedSurvey> {
//   const supabase = await createServerSupabase();

//   const { data: survey } = await supabase
//     .from("surveys")
//     .select("*")
//     .eq("id", surveyId)
//     .single();

//   const { data: participations } = await supabase
//     .from("participations")
//     .select("user, finished")
//     .eq("survey", surveyId);

//   const { data: comparisons, error } = await supabase
//     .from("comparison_pairs")
//     .select("id")
//     .eq("survey", surveyId);

//   console.log(error);

//   const { data: pwc_results } = await supabase
//     .from("pwc_results")
//     .select()
//     .in(
//       "pair",
//       comparisons!.map((c) => c.id)
//     );

//   const { data: questionnaires } = await supabase
//     .from("questionnaires")
//     .select()
//     .eq("survey", surveyId);

//   return {
//     ...survey!,
//     participations: participations!,
//     comparison_count: comparisons!.length,
//     pwc_results: pwc_results!,
//     questionnaires: questionnaires!,
//   };
// }

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

export async function createPairwiseComparisonEntries(
  surveyId: number,
  imageIds: number[]
) {
  const supabase = await createServerSupabase();
  let comparisons = [];
  for (let i = 0; i < imageIds.length; i++) {
    for (let j = i + 1; j < imageIds.length; j++) {
      comparisons.push({
        survey: surveyId,
        image_1: imageIds[i],
        image_2: imageIds[j],
      });
    }
  }

  return await supabase.from("comparison_pairs").insert(comparisons);
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

export async function getComparisonBatch(surveyId: number) {
  const supabase = await createServerSupabase();

  try {
    // 1. fetch all necessary data from supabase
    const [user, { data: images }, { data: pwcPairs }, { data: pwcResults }] =
      await Promise.all([
        getAuthUser(),
        getImages(surveyId),
        supabase.from("comparison_pairs").select().eq("survey", surveyId),
        supabase
          .from("pwc_results")
          .select("*, pair(*)")

          .eq("pair.survey", surveyId)
          .returns<PWCResultWithPair[]>(),
      ]);

    if (!user) throw new Error("User not authenticated");
    if (!images) throw new Error("Error when fetching images");
    if (!pwcPairs) throw new Error("Error when fetching pairs");
    if (!pwcResults) throw new Error("Error when fetching results");

    // 2 see if user has already answered certain amount
    const userResults = pwcResults.filter(
      (result) => result.user === user.id && result.pair.survey === surveyId
    );
    if (userResults.length >= (images.length - 1) * 2) {
      return { data: [], error: null };
    }

    // 3. create pwc_matrix
    const imageIds = images.map((image) => image.id);
    const pwc_matrix = createPWCMatrix(imageIds, pwcResults);

    // 4. send pwc_matrix to asap api
    const asapResult = await fetch(`${process.env.ASAP_API_URL}`, {
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
    const nextPairs = convertToPwcObjects(imageIds, pwcPairs, data.pairs);

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
  comparisonPairId: number,
  imageId: number,
  timeTaken: number
) {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();
  if (!user) return;

  return supabase.from("pwc_results").insert({
    user: user.id,
    pair: comparisonPairId,
    choice: imageId,
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
