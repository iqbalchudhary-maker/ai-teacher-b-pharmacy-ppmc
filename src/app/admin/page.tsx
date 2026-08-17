// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Tab State: 'students' | 'upload' | 'teacher'
  const [activeTab, setActiveTab] = useState<"students" | "upload" | "teacher">("students");

  // Form States for Students
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [studentPart, setStudentPart] = useState("1"); // Part 1 ya Part 2

  // Form States for Books
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [bookPart, setBookPart] = useState("1"); // Part 1 ya Part 2
  const [file, setFile] = useState<File | null>(null);

  const [studentMsg, setStudentMsg] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);

  // Default Admin Access Key
  const ADMIN_SECRET_KEY = "admin123";

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_SECRET_KEY) {
      setIsAdminAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("❌ غلط ایڈمن پاس ورڈ!");
    }
  };

  // 1. Create Student Logic
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentMsg("");
    setLoadingStudent(true);

    try {
      const res = await fetch("/api/create-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, name, password, part: studentPart }),
      });

      const data = await res.json();
      if (res.ok) {
        setStudentMsg("✅ " + data.message);
        setRollNumber("");
        setName("");
        setPassword("");
        setStudentPart("1");
      } else {
        setStudentMsg("❌ " + (data.error || "رجسٹریشن میں ناکامی"));
      }
    } catch (err) {
      setStudentMsg("❌ سرور کنکشن میں خرابی");
    } finally {
      setLoadingStudent(false);
    }
  };

  // 2. Upload Word (.docx) Book Logic
  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !chapter || !subject) {
      setUploadMsg("❌ مضمون، کتاب کا عنوان اور فائل درج کریں");
      return;
    }

    setUploadMsg("");
    setLoadingBook(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("title", chapter);
    formData.append("part", bookPart); // Part 1 ya Part 2 API ko bhejna

    try {
      const res = await fetch("/api/upload-book", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadMsg("✅ " + data.message);
        setSubject("");
        setChapter("");
        setFile(null);
        setBookPart("1");
      } else {
        setUploadMsg("❌ " + (data.error || "کتاب اپلوڈ کرنے میں ناکامی"));
      }
    } catch (err) {
      setUploadMsg("❌ سرور کنکشن میں خرابی");
    } finally {
      setLoadingBook(false);
    }
  };

  // IF NOT AUTHENTICATED: Show Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dir-rtl">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">ایڈمن لاگ ان (Admin Access)</h1>
            <p className="text-xs text-gray-500 mt-1">پاک پیرامیڈیکل کالج، چنیوٹ</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                ایڈمن پاس ورڈ (Admin Key)
              </label>
              <input
                type="password"
                placeholder=""
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full p-3 text-sm border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 text-center font-bold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 text-sm rounded-xl transition shadow"
            >
              ایڈمن پورٹل میں داخل ہوں
            </button>
          </form>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Show Admin Control Panel
  return (
    <div className="min-h-screen bg-gray-50 p-6 dir-rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-blue-900 text-white p-6 rounded-2xl shadow flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">پاک پیرامیڈیکل کالج، چنیوٹ - ایڈمن کنٹرول پینل</h1>
            <p className="text-xs text-blue-200 mt-0.5">Powered by SM Tech AI Solutions</p>
          </div>
          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
          >
            لاگ آؤٹ (Logout)
          </button>
        </header>

        {/* 3 Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-xl p-1.5 shadow-xs gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 py-3 text-xs font-bold rounded-lg transition text-center ${
              activeTab === "students"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            👨‍🎓 Registered Student
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-3 text-xs font-bold rounded-lg transition text-center ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📚 Upload Book (Word)
          </button>

          <button
            onClick={() => setActiveTab("teacher")}
            className={`flex-1 py-3 text-xs font-bold rounded-lg transition text-center ${
              activeTab === "teacher"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            👨‍🏫 Use Teacher
          </button>
        </div>

        {/* TAB 1: Registered Student Form */}
        {activeTab === "students" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">
              👨‍🎓 نیا سٹوڈنٹ رجسٹر کریں (Add Registered Student)
            </h2>
            <form onSubmit={handleCreateStudent} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  رول نمبر (Roll Number)
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  طالب علم کا نام
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  پاس ورڈ (Password)
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Part Selection for Student */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  کلاس پارٹ (Class Part)
                </label>
                <select
                  value={studentPart}
                  onChange={(e) => setStudentPart(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Part 1 (فرسٹ پارٹ)</option>
                  <option value="2">Part 2 (سیکنڈ پارٹ)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingStudent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow"
              >
                {loadingStudent ? "سیو ہو رہا ہے..." : "سٹوڈنٹ سیو کریں"}
              </button>

              {studentMsg && (
                <p className="text-xs text-center font-semibold mt-2">{studentMsg}</p>
              )}
            </form>
          </div>
        )}

        {/* TAB 2: Upload Complete Word Book Form */}
        {activeTab === "upload" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">
              📚 مکمل نصابی کتاب اپلوڈ کریں (Upload Word Book)
            </h2>
            <form onSubmit={handleUploadBook} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  مضمون (Subject)
                </label>
                <input
                  type="text"
                  placeholder="مضمون کا نام درج کریں، مثلاً: Pharmacology"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  کتاب کا نام / عنوان (Book Title)
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: Pharmaceutics-I Chapter 1"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Part Selection for Book */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  کتاب کا پارٹ (Book Part)
                </label>
                <select
                  value={bookPart}
                  onChange={(e) => setBookPart(e.target.value)}
                  className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Part 1 (فرسٹ ایئر/پارٹ)</option>
                  <option value="2">Part 2 (سیکنڈ ایئر/پارٹ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  ورڈ کتاب فائل (Word Document File .docx / .doc)
                </label>
                <input
                  type="file"
                  accept=".docx,.doc"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs p-2 border rounded-lg bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingBook}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 rounded-xl transition shadow"
              >
                {loadingBook ? "کتاب پروسیس اور سیو ہو رہی ہے..." : "کتاب اپلوڈ کریں"}
              </button>

              {uploadMsg && (
                <p className="text-xs text-center font-semibold mt-2">{uploadMsg}</p>
              )}
            </form>
          </div>
        )}

        {/* TAB 3: Use Teacher Link */}
        {activeTab === "teacher" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center space-y-4">
            <div className="text-4xl">👨‍🏫</div>
            <h2 className="text-base font-bold text-gray-800">AI Teacher ڈیش بورڈ استعمال کریں</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              یہاں سے آپ براہِ راست AI ٹیچر ڈیش بورڈ پر جا کر سوالات پوچھ سکتے ہیں اور جوابات کو ٹیسٹ کر سکتے ہیں۔
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-8 rounded-xl transition shadow"
              >
                AI Teacher Dashboard پر جائیں ➔
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}