"use server";

import { Participant } from "@/types";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";

export async function signupParticipants(
  participants: Participant[],
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

  participants.forEach(async (participant) => {
    userRequests.push(
      supabase.from("users").insert({
        id: participant.id,
      })
    );
    surveyUserRequests.push(
      supabase.from("survey_users").insert({
        survey: surveyId,
        user: participant.id,
      })
    );
    participantRequests.push(
      supabase.from("participants").delete().eq("id", participant.id)
    );
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
  return { error: null };
}
