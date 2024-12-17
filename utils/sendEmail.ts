export const sendEmail = async (
  email: string,
  templateId: number,
  otpLink: string
) => {
  return await fetch(process.env.BREVO_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      to: [
        {
          email: email,
        },
      ],
      templateId,
      params: {
        otpLink,
      },
    }),
  });
};
