import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const evalUrl = process.env.NEXT_PUBLIC_SERVER_EVAL_URL;
    console.log("SWOT PROXY: EVAL_URL:", evalUrl);
    console.log("SWOT PROXY: BODY:", body);
    if (!evalUrl) {
      return new Response(
        JSON.stringify({ error: "NEXT_PUBLIC_SERVER_EVAL_URL is not set" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const apiRes = await fetch(`${evalUrl}/swot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("SWOT PROXY: External API error", apiRes.status, text);
      return new Response(
        JSON.stringify({
          error: "External API error",
          status: apiRes.status,
          details: text,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await apiRes.json();
    console.log("Response from evaluation API:", data);
    return new Response(JSON.stringify(data), {
      status: apiRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("SWOT PROXY: Caught error", err);
    return new Response(
      JSON.stringify({ error: "Proxy error", details: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
