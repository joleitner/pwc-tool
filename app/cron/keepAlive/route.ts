export async function GET() {
  const data = await fetch(`${process.env.ASAP_API_URL}`);

  return Response.json(await data.json());
}
