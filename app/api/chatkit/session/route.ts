// app/api/chatkit/session/route.ts
import { NextResponse } from "next/server";

const OPENAI_SESSIONS_URL = "https://api.openai.com/v1/chatkit/sessions";

export async function POST(req: Request) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return NextResponse.json({ error: "Missing OpenAI key" }, { status: 500 });
  }

  try {
    // Optional: you can accept a user id or metadata from request body
    const body = await req.json().catch(() => ({}));
    const userId = body.userId ?? `user_${Math.random().toString(36).slice(2, 9)}`;

    // Build session creation payload - adjust according to ChatKit docs and whether you
    // want to attach a workflow/agent id when creating session.
    const payload: any = {
      user: { id: userId },
      // If you want a specific workflow/agent to be used by the chat session:
      // workflow: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
    };

    const resp = await fetch(OPENAI_SESSIONS_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text }, { status: resp.status });
    }

    const data = await resp.json();

    // The response shape may differ; return whatever short-lived token the service gives.
    // Common fields: client_secret, clientToken, etc. Inspect returned JSON from OpenAI.
    return NextResponse.json({ clientToken: data.client_secret ?? data.clientToken ?? data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
