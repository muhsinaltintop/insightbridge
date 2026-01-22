export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400 }
      );
    }

    const url =
      "https://ai-analytics-expert.onrender.com/analyze?" +
      new URLSearchParams({ question });

    const upstream = await fetch(url, {
      method: "POST",
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(
        JSON.stringify({
          error: "AI service error",
          status: upstream.status,
          body: text,
        }),
        { status: 502 }
      );
    }

    const data = await upstream.json();

    return new Response(
      JSON.stringify({ answer: data.answer }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Server error",
        message: err?.message,
      }),
      { status: 500 }
    );
  }
}
