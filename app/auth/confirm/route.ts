import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createServerSupabase } from "@/utils/supabase/supabase.server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/confirmed";

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error && data) {
      if (type === "invite") {
        // set participant as verified
        await supabase
          .from("registrations")
          .update({ verified: true })
          .eq("id", data.user!.id!)
          .select();
      }

      // redirect user to specified redirect URL or root of app
      redirect(next);
    } else if (error?.code === "otp_expired") {
      redirect(`/login?next=${next}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
