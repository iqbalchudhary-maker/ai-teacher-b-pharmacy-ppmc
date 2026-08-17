// src/app/api/test-models/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY نہیں ملی۔" }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // یہاں آپ کو تمام دستیاب ماڈلز کی لسٹ مل جائے گی
    return NextResponse.json({ success: true, models: data.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}