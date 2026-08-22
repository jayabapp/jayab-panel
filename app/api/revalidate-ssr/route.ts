import axios from "axios";

/**
 * revalidate website ssr cache
 * @param request
 * @returns
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const webUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

    const res = await axios({
      method: "GET",
      url: `${webUrl}/api/v1/revalidate-ssr?token=${token}`,
    });

    console.log({ ssr: res?.data });

    return new Response(JSON.stringify({ message: "revalidate done" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "revalidate error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
