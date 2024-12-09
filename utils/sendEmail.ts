export const sendSurveyLinkMail = async (email: string, surveyLink: string) => {
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
      templateId: 1,
      params: {
        surveyLink,
      },
    }),
  });
};
