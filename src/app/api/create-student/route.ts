import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { rollNumber, name, password } = await req.json();

    if (!rollNumber || !name || !password) {
      return NextResponse.json(
        { error: "تمام معلومات فراہم کرنا ضروری ہیں" },
        { status: 400 }
      );
    }

    // Check existing student
    const existingStudent = await db.student.findUnique({
      where: { rollNumber },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "یہ رول نمبر پہلے سے موجود ہے" },
        { status: 400 }
      );
    }

    // Save simple plain text password directly
    const student = await db.student.create({
      data: {
        rollNumber,
        name,
        password, // Simple Password
      },
    });

    return NextResponse.json({
      message: "طالب علم کامیابی سے رجسٹر ہو گیا ہے",
      student: { id: student.id, rollNumber: student.rollNumber, name: student.name },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "سٹوڈنٹ بنانے میں خرابی پیش آئی" },
      { status: 500 }
    );
  }
}