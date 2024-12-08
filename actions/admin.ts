"use server";

import { Registrations } from "@/types";
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
