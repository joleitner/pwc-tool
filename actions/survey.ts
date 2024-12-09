"use server";

import { PairwiseComparison, Participation } from "@/types";
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
    .eq("survey", surveyId);
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

export async function getUnansweredComparisons(surveyId: number) {
  const supabase = await createServerSupabase();

  const user = await getAuthUser();

  const { data: pwc_results } = await supabase
    .from("pwc_results")
    .select("pair")
    .eq("user", user!.id);

  const { data, error } = await supabase
    .from("comparison_pairs")
    .select("id, image_1(id, path), image_2(id, path)")
    .eq("survey", surveyId)
    .returns<PairwiseComparison[]>();

  if (error || !pwc_results || pwc_results?.length === 0)
    return { data, error };

  // filter out comparisons that the user has already answered
  const unansweredComparisons = data.filter((comparison) => {
    return !pwc_results.some((result) => result.pair === comparison.id);
  });

  return { data: unansweredComparisons, error };
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
      finished: true,
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
