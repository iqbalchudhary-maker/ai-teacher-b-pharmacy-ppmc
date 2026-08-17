// src/lib/groq.ts

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY ماحول فائل (.env) میں موجود نہیں ہے۔");
}

export async function askGroq(
  messages: { role: string; content: string }[],
  model = "openai/gpt-oss-20b" // یہاں وہ ماڈل رکھیں جو 100% فعال ہو
) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || "Groq API سے جواب حاصل کرنے میں ناکامی ہوئی۔"
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}