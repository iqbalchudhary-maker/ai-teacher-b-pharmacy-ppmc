import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { rollNumber, password } = await req.json();

    if (!rollNumber || !password) {
      return NextResponse.json(
        { error: "رول نمبر اور پاس ورڈ ضروری ہیں" },
        { status: 400 }
      );
    }

    const student = await db.student.findUnique({
      where: { rollNumber },
    });

    // Simple Direct Password Check
    if (!student || student.password !== password) {
      return NextResponse.json(
        { error: "غلط رول نمبر یا پاس ورڈ" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: student.id,
      rollNumber: student.rollNumber,
      name: student.name,
    });

    const response = NextResponse.json({
      message: "لاگ ان کامیاب!",
      student: { name: student.name, rollNumber: student.rollNumber },
    });

    response.cookies.set("student_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "لاگ ان پروسیس میں مسئلہ آیا" },
      { status: 500 }
    );
  }
}