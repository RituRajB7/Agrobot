import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { Response } from "groq-sdk/_shims/registry.mjs"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are AgriBot, a smart farming assistant." },
      { role: "user", content: prompt },
    ],
  })

  return NextResponse.json({
    response: completion.choices[0].message.content,
  })
}

