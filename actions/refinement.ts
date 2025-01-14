"use server";

import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { getAuthUser } from "./auth";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";

export async function enterRefinementForNewSurvey() {
  const supabase = await createServerSupabase();
  const supabaseAdmin = await createAdminSupabase();
  const user = await getAuthUser();
  if (!user) return;

  // #1 Check which surveys the user has already participated in
  const { data: participations } = await supabase
    .from("participations")
    .select("survey, finished")
    .eq("user", user.id);

  if (!participations) return;
  // if user has not finished the initial survey yet, send this survey to him
  const unfinished = participations.find((p) => !p.finished);
  if (unfinished) {
    const { data: survey } = await supabase
      .from("surveys")
      .select("public_id")
      .eq("id", unfinished.survey)
      .single();
    return survey?.public_id;
  }

  const surveyIds = participations.map((p) => p.survey);
  const surveyIdString = `(${surveyIds.join(",")})`;

  // #2 Get all surveys with there pwc_results to calculate their standard trials: n(n - 1)/2
  const [{ data: surveys }, { data: pwcCounts }] = await Promise.all([
    supabase.from("surveys").select("*").not("id", "in", surveyIdString),
    supabase.rpc("get_pwc_counts"),
  ]);

  if (!surveys || !pwcCounts || pwcCounts.length === 0) return;

  const surveyCounts = pwcCounts.reduce((acc, item) => {
    acc[item.survey] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const standardTrials = surveys.map((survey) => {
    const n = survey.image_count!;
    const possiblePairs = (n * (n - 1)) / 2;
    return {
      survey: survey.id,
      trials: surveyCounts[survey.id] / possiblePairs,
    };
  });
  const refineSurveyId = standardTrials.sort((a, b) => a.trials - b.trials)[0][
    "survey"
  ];

  await supabaseAdmin.from("participations").insert({
    survey: refineSurveyId,
    user: user.id,
    initial: false,
  });

  return surveys.find((s) => s.id === refineSurveyId)?.public_id;
}

export async function areSurveysAvailable() {
  const supabase = await createServerSupabase();
  const user = await getAuthUser();
  if (!user) return false;

  const [{ data: surveys }, { data: participations }] = await Promise.all([
    supabase.from("surveys").select("id"),
    supabase
      .from("participations")
      .select("survey")
      .eq("user", user.id)
      .not("finished", "is", null),
  ]);

  if (!surveys || !participations) return false;
  const availableSurveys = surveys.filter(
    (s) => !participations.find((p) => p.survey === s.id)
  );

  return availableSurveys.length > 0;
}
