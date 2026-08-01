import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string || file?.name.replace(/\.[^/.]+$/, "") || "Untitled Book";
    const subject = formData.get("subject") as string || "General";

    if (!file) {
      return NextResponse.json(
        { error: "برائے مہربانی Word (.docx) فائل منتخب کریں۔" },
        { status: 400 }
      );
    }

    // فائل کو Buffer میں تبدیل کریں
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Mammoth کے ذریعے Docx فائل سے Raw Text نکالیں
    const result = await mammoth.extractRawText({ buffer });
    const extractedText = result.value;

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "فائل میں سے کوئی ٹیکسٹ حاصل نہیں ہو سکا۔" },
        { status: 400 }
      );
    }

    // ڈائریکٹ Prisma کے ذریعے Database میں سیو کریں
    const newBook = await db.book.create({
      data: {
        title,
        subject,
        content: extractedText,
      },
    });

    return NextResponse.json({
      success: true,
      message: "کتاب کامیابی سے اپلوڈ اور سیو ہو گئی!",
      book: {
        id: newBook.id,
        title: newBook.title,
        subject: newBook.subject,
      },
    });
  } catch (error: any) {
    console.error("Docx Upload Error:", error);
    return NextResponse.json(
      { error: "کتاب اپلوڈ کرنے میں مسئلہ آیا: " + error.message },
      { status: 500 }
    );
  }
}