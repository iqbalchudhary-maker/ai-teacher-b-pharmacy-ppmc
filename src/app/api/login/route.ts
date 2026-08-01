// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rollNumber, password } = body;

    // 1. چیک کریں کہ رول نمبر اور پاس ورڈ فراہم کیے گئے ہیں
    if (!rollNumber || !password) {
      return NextResponse.json(
        { error: "رول نمبر اور پاس ورڈ دونوں درج کریں" },
        { status: 400 }
      );
    }

    // 2. ڈیٹا بیس سے سٹوڈنٹ کو رول نمبر کے ذریعے تلاش کریں
    const student = await db.student.findUnique({
      where: { rollNumber: rollNumber.trim() },
    });

    // اگر سٹوڈنٹ موجود نہ ہو
    if (!student) {
      return NextResponse.json(
        { error: "غلط رول نمبر یا پاس ورڈ" },
        { status: 401 }
      );
    }

    // 3. سادہ پاس ورڈ میچ کریں (Plain Text Comparison)
    if (student.password !== password) {
      return NextResponse.json(
        { error: "غلط رول نمبر یا پاس ورڈ" },
        { status: 401 }
      );
    }

    // 4. لاگ ان کے لیے سیشن ٹوکن تیار کریں
    const token = await signToken({
      id: student.id,
      rollNumber: student.rollNumber,
      name: student.name,
    });

    const response = NextResponse.json({
      message: "لاگ ان کامیاب ہو گیا",
      student: {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
      },
    });

    // 5. کوکی محفوظ کریں اور رسائی دیں
    response.cookies.set("student_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "سرور پر مسئلہ پیش آیا ہے" },
      { status: 500 }
    );
  }
}