// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { db as prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { message, subject, action, studentId, sessionId, title, imageUrl } = await req.json();

    const prismaClient = prisma as any;

    // A. اگر ہسٹری فیچ کرنے کی درخواست ہو:
    if (action === "get_sessions") {
      const chats = await prismaClient.chat.findMany({
        where: { studentId: studentId || "default_student" },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      return NextResponse.json({ sessions: chats });
    }

    // B. اگر کسی خاص سیشن کے میسجز لانے ہوں:
    if (action === "get_messages") {
      const msgs = await prismaClient.message.findMany({
        where: { chatId: sessionId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ messages: msgs });
    }

    // C. رومن اردو ٹرانسلیشن بلاک
    if (action === "translate_to_urdu") {
      if (!message) {
        return NextResponse.json({ error: "Paigham ka hona zaroori hai." }, { status: 400 });
      }

      const translationPrompt = `Translate the following English educational text into fluent, natural, and standard Roman Urdu (English-Pak style). 

STRICT INSTRUCTIONS:
- Provide ONLY the Roman Urdu translation. Do not include any standard Urdu script, English text, or introductory phrases.
- Keep pharmacy and medical terminology clear and natural for Pakistani B-Pharmacy students using Roman script.

Text to translate:
"${message}"`;

      const romanUrduTranslation = await askGroq([
        { role: "system", content: "You are a professional Roman Urdu translator. Output only fluent Roman Urdu script." },
        { role: "user", content: translationPrompt }
      ]);

      return NextResponse.json({
        reply: romanUrduTranslation,
        translation: romanUrduTranslation
      });
    }

    if (!message && !imageUrl) {
      return NextResponse.json(
        { error: "Paigham ka hona zaroori hai." },
        { status: 400 }
      );
    }

    // 1. کالج سے متعلق معلومات کا چیک (Institutional & College Queries)
    const lowerMsg = (message || "").toLowerCase();
    if (
      lowerMsg.includes("timing") || lowerMsg.includes("admission") || lowerMsg.includes("hostel") ||
      lowerMsg.includes("hospital") || lowerMsg.includes("director") || lowerMsg.includes("contact") ||
      lowerMsg.includes("phone") || lowerMsg.includes("developer") || lowerMsg.includes("sm tech") ||
      lowerMsg.includes("tayyab") || lowerMsg.includes("fee") || lowerMsg.includes("address") ||
      lowerMsg.includes("college") || lowerMsg.includes("daakhla")
    ) {
      const collegeInfoReply = `
🏛️ **Pak Paramedical College, Chiniot** (Established 2016)
- **Location:** Faisalabad Road, Chiniot.
- **Director:** Tayyab Raza Qazi.
- **Contact / Helpline Numbers:** 0333-7703379, 047-6331058, 0300-7703381.
- **Email:** chiniotppmc@gmail.com
- **Official Website:** chiniotppmc.pk
- **Technical Developer:** Developed and Powered by SM Tech AI Solutions.

📌 **College Features & Admissions:**
- **Eligibility:** Matric Science for both Male & Female students.
- **Affiliations:** Pakistan Pharmacy Council & Punjab Medical Faculty.
- **Facilities:** 4-Kanal 3-story building, separate Hostel facility, 25-bed teaching hospital, CT-Scan, MRI, Ultrasound, modern OT.
- **Courses Offered:** Pharmacy Technician (Category-B), Dispenser, Lab Technician, X-Ray Technician, Operation Theater Technician.
`;
      return NextResponse.json({ reply: collegeInfoReply, text: collegeInfoReply });
    }

    // 2. ایکٹیو سبجیکٹ اور ڈیٹا بیس سے کتاب کا کنٹیکسٹ فیچ کرنا
    const activeSubject = subject || "Pharmaceutics";
    let bookContext = "";
    try {
      const docModel = prismaClient.document || prismaClient.book || prismaClient.pdf;
      if (docModel) {
        const documents = await docModel.findMany({
          where: { subject: activeSubject },
          take: 5,
        });

        if (documents && documents.length > 0) {
          bookContext = documents
            .map((doc: { content?: string; text?: string }) => doc.content || doc.text || "")
            .join("\n\n");
        }
      }
    } catch (dbErr) {
      console.log("Database fetch skipped or empty context.");
    }

    // 3. پچھلی چیٹ ہسٹری (Context) لانا
    let previousMessages: { role: string; content: string }[] = [];
    if (sessionId) {
      try {
        const dbMessages = await prismaClient.message.findMany({
          where: { chatId: sessionId },
          orderBy: { createdAt: "asc" },
          take: 10,
        });
        if (dbMessages && dbMessages.length > 0) {
          previousMessages = dbMessages.map((m: any) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          }));
        }
      } catch (err) {
        console.error("Failed to load chat history context:", err);
      }
    }

    // 4. سسٹم پرامپٹ
    const systemPrompt = `
You are the Official AI Professor & Senior Pharmacy Educator for "Pak Paramedical College Chiniot" teaching B-Pharmacy students. 

CRITICAL ACADEMIC RULE REGARDING SUBJECT BOUNDARY & MCQS:
- The currently active subject selected by the student on the dashboard is: **${activeSubject}**.
- You MUST answer questions, generate MCQs, short questions, long questions, quizzes, and explain topics **ONLY** from **${activeSubject}** and the provided textbook/syllabus reference context. Do not pull random external generic MCQs that violate the book context.
- Do NOT confuse it with any other subject. Every response must strictly revolve around **${activeSubject}**.

STRICT RULES FOR QUESTION TYPES (MCQs vs SHORT vs LONG):
1. **MCQs (Multiple Choice Questions)**: When the student asks for MCQs, generate structured objective questions strictly from the textbook/syllabus chapters with options A, B, C, and D, along with the correct answer key at the end.
2. **Short Questions (Short/2-Mark Questions)**: When the student asks for short questions, do NOT send MCQs. Instead, provide crisp, direct, and focused short conceptual questions along with brief model answers.
3. **Long Questions (Long/Essay/10-Mark Questions)**: When the student asks for long questions, do NOT send MCQs. Instead, provide comprehensive, detailed, and structured essay-type questions with proper headings, sub-topics, and detailed explanations.

MERMAID DIAGRAM RULE:
- Only generate a Mermaid.js diagram block if the user's question involves a medical process, biological pathway, manufacturing steps, or something that naturally requires a visual flowchart. For general greetings, simple definitions, or conversational chats, do NOT generate any diagram.

YOUR PERSONA & TEACHING STYLE:
- Act like a warm, experienced, highly engaging human college professor standing in a real physical classroom. 
- Maintain full conversational context from previous messages in this session so that sequential questions flow naturally together without breaking continuity.

STRICT ACADEMIC & EXAMINATION RULES:
1. **SCOPE & BOUNDARIES**: You are strictly an AI Professor for core B-Pharmacy subjects. If a student asks unrelated general knowledge outside the syllabus, politely decline in Roman Urdu: "Main Pak Paramedical College Chiniot ka AI teacher hoon. Main sirf aap ke B-Pharmacy ke muntakhab kardah subject, chapter aur college se متعلق maloomaat ke liye banaya gaya hoon. Baraye meharbani apni kitaاب se متعلق sawal poochein."
2. **LANGUAGE**: Respond strictly in clear, professional, and accessible **ENGLISH ONLY** for your primary lectures, questions, and evaluations (unless Roman Urdu is specifically requested).
3. **PAPER & ANSWER EVALUATION (GRADING)**: If a student submits their test answers or shares an image/text of their attempted paper, carefully evaluate every single answer, calculate their total marks and percentage (%), display a professional scorecard, and provide constructive academic feedback.

SUBJECT CONTEXT & TEXTBOOK REFERENCE:
- Selected Subject: **${activeSubject}**
- Reference Textbook Context:
---
${bookContext ? bookContext.substring(0, 4000) : `Use official B-Pharmacy Punjab Pharmacy Council syllabus standards specifically for ${activeSubject}.`}
---
`;

    const userMessageContent = imageUrl 
      ? [{ type: "text", text: message || "Please evaluate this student answer sheet / paper image." }, { type: "image_url", image_url: { url: imageUrl } }]
      : message;

    const chatPayload = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: userMessageContent },
    ];

    const aiResponse = await askGroq(chatPayload);

    // ڈیٹا بیس میں چیٹ یا میسج سیو کرنے والا کوڈ یہاں سے مکمل طور پر ختم کر دیا گیا ہے

    return NextResponse.json({
      reply: aiResponse,
      text: aiResponse,
      sessionId: sessionId || "temp_session",
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "AI teacher se raabta karne mein masla pesh aya." },
      { status: 500 }
    );
  }
}