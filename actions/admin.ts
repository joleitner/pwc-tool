"use server";

import { Registrations } from "@/types";
import { sendEmail } from "@/utils/sendEmail";
import { createAdminSupabase } from "@/utils/supabase/supabase.admin";

export async function signupParticipants(
  registrations: Registrations[],
  surveyId: number
) {
  const supabase = createAdminSupabase();

  let userRequests: any[] = [];
  let participantRequests: any[] = [];
  let surveyUserRequests: any[] = [];
  let participants: { email: string; locale: string }[] = [];

  registrations.forEach(async (registration) => {
    userRequests.push(
      supabase.from("users").insert({
        id: registration.id,
        name: registration.email,
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
    participants.push({
      email: registration.email,
      locale: registration.locale!,
    });
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

  participants.map(async (participant) => {
    const { data: otp_link } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: participant.email,
    });
    if (otp_link) {
      const token = otp_link.properties?.hashed_token;
      const type = otp_link.properties?.verification_type;

      const surveyLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/survey?id=${survey?.public_id}`;

      await sendEmail(
        participant.email,
        participant.locale === "de" ? 1 : 2,
        surveyLink
      );
    }
  });

  return { error: null };
}

export async function inviteParticipant(email: string, locale: string) {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
  });

  if (error) {
    return { error };
  }
  const token = data.properties?.hashed_token;
  const type = data.properties?.verification_type;
  const inviteLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/confirmed`;

  await sendEmail(email, locale === "de" ? 3 : 4, inviteLink);

  return await supabase
    .from("registrations")
    .insert([{ id: data.user.id, email, locale }]);
}

export async function resendOTPLink(
  email: string,
  next: string,
  locale: string
) {
  const supabase = await createAdminSupabase();

  // check if user exists
  const [user, registration] = await Promise.all([
    supabase.from("users").select("id").eq("name", email).single(),
    supabase.from("registrations").select("id").eq("email", email).single(),
  ]);
  if (!user && !registration) {
    return { error: "User not found" };
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error) {
    return { error };
  }
  const token = data.properties?.hashed_token;
  const type = data.properties?.verification_type;
  const magicLink = `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=${next}`;

  await sendEmail(email, locale === "de" ? 5 : 6, magicLink);

  return { error: null };
}

export async function addHelper(email: string) {
  const supabase = await createAdminSupabase();

  const { data } = await supabase
    .from("users")
    .update({ role: "helper" })
    .eq("name", email)
    .select("id")
    .single();

  if (!data) {
    return "";
  }

  const { data: otp_link } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email,
  });
  if (otp_link) {
    const token = otp_link.properties?.hashed_token;
    const type = otp_link.properties?.verification_type;

    return `${process.env.SITE_URL}/auth/confirm?token_hash=${token}&type=${type}&next=/helper`;
  }
  return "";
}
