"use server";

import { PairwiseComparison } from "@/types";
import { createServerSupabase } from "@/utils/supabase/supabase.server";

export async function getParticipants() {
  const supabase = await createServerSupabase();

  return await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function deleteParticipant(id: number) {
  const supabase = await createServerSupabase();

  return await supabase.from("participants").delete().eq("id", id);
}

export async function getSurveys() {
  const supabase = await createServerSupabase();

  return await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getSurveyByPublicId(id: string) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("surveys")
    .select("*")
    .eq("public_id", id)
    .single();
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

  return await supabase.from("pair_comparisons").insert(comparisons);
}

export async function isUserParticipantOfSurvey(
  surveyId: number,
  userId: string
) {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("survey_users")
    .select("*")
    .eq("survey", surveyId)
    .eq("user", userId)
    .single();

  return data ? true : false;
}

export async function getPairwiseComparisons(surveyId: number) {
  const supabase = await createServerSupabase();

  return await supabase
    .from("pair_comparisons")
    .select("id, image_1(id, path), image_2(id, path)")
    .eq("survey", surveyId)
    .returns<PairwiseComparison[]>();
}
