"use server";

import { Registrations } from "@/types";
import { sendSurveyLinkMail } from "@/utils/sendEmail";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";

export async function signupParticipants(
  registrations: Registrations[],
  surveyId: number
) {
  const supabase = createAdminSupabase();

  // const responses = await Promise.all(
  //     participants.map((participant) =>
  //         supabase.auth.admin.createUser({
  //             email: participant.email,
  //             email_confirm: false,
  //         })
  //     )
  //   )

  let userRequests: any[] = [];
  let participantRequests: any[] = [];
  let surveyUserRequests: any[] = [];
  let participantEmails: string[] = [];

  registrations.forEach(async (registration) => {
    userRequests.push(
      supabase.from("users").insert({
        id: registration.id,
      })
    );
    surveyUserRequests.push(
      supabase.from("participations").insert({
        survey: surveyId,
        user: registration.id,
      })
    );
    participantRequests.push(
      supabase.from("registrations").delete().eq("id", registration.id)
    );
    participantEmails.push(registration.email);
  });

  const userResponses = await Promise.all(userRequests);
  const surveyUserResponses = await Promise.all(surveyUserRequests);
  const participantResponses = await Promise.all(participantRequests);

  // check for errors
  if (
    userResponses.some((response) => response.error) ||
    surveyUserResponses.some((response) => response.error) ||
    participantResponses.some((response) => response.error)
  ) {
    return { error: "Error signing up participants" };
  }

  // send email to participants
  const { data: survey } = await supabase
    .from("surveys")
    .select("public_id")
    .eq("id", surveyId)
    .single();

  participantEmails.map(async (email) => {
    const { data: otp_link } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (otp_link) {
      const token = otp_link.properties?.hashed_token;
      const type = otp_link.properties?.verification_type;

      const surveyLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/survey?id=${survey?.public_id}`;

      await sendSurveyLinkMail(email, surveyLink);
    }
  });

  return { error: null };
}
