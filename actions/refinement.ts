"use server";

import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { getAuthUser } from "./auth";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";
import { sendEmail } from "@/utils/sendEmail";

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

export async function getAvailableUsers() {
  const supabase = await createServerSupabase();
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .neq("role", "admin");

  return users;
}

export async function sendRefinementEmail(
  users: { email: string; locale: string }[]
) {
  const supabase = await createAdminSupabase();

  users.map(async (user) => {
    const { data: otp_link } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
    });
    if (otp_link) {
      const token = otp_link.properties?.hashed_token;
      const type = otp_link.properties?.verification_type;

      const refinementLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/refinement`;

      await sendEmail(
        user.email,
        user.locale === "de" ? 9 : 10,
        refinementLink
      );
    }
  });
}

export async function getResponselessParticipants() {
  const supabase = await createServerSupabase();
  const { data: participants } = await supabase
    .from("participations")
    .select("survey(id, public_id), user(id, name, locale)")
    .eq("initial", true)
    .filter("finished", "is", null);

  return participants;
}

export async function sendReminderEmail(
  reminders: { survey_id: string; email: string; locale: string }[]
) {
  const supabase = await createAdminSupabase();

  reminders.map(async (remind) => {
    const { data: otp_link } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: remind.email,
    });
    if (otp_link) {
      const token = otp_link.properties?.hashed_token;
      const type = otp_link.properties?.verification_type;

      const reminderLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/survey?id=${remind.survey_id}`;

      await sendEmail(
        remind.email,
        remind.locale === "de" ? 7 : 8,
        reminderLink
      );
    }
  });
}
