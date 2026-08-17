// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [part, setPart] = useState("1"); // نیا اسٹیٹ پارٹ کے لیے (ڈیفالٹ Part 1)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password, part }), // API کو بھی پارٹ بھیجیں (اگر ضرورت ہو)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "لاگ ان میں مسئلہ پیش آیا");
      }

      // براؤزر کی کوکیز میں رول نمبر اور پارٹ دونوں محفوظ کریں (7 دن کے لیے)
      document.cookie = `studentRollNo=${rollNumber.trim()}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `studentPart=${part}; path=/; max-age=${60 * 60 * 24 * 7}`;

      // ڈیش بورڈ پر پارٹ کے ساتھ ری ڈائریکٹ کریں
      router.push(`/dashboard?part=${part}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-blue-900">پاک پیرامیڈیکل کالج، چنیوٹ</h1>
          <p className="text-xs text-slate-500 mt-1">B-Pharmacy Category-B AI Tutor Portal</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Powered by SM Tech AI Solutions</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center font-medium shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* پارٹ سلیکشن (Part 1 یا Part 2) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">کلاس / پارٹ (Select Class Part)</label>
            <select
              value={part}
              onChange={(e) => setPart(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900 font-bold cursor-pointer"
            >
              <option value="1">B-Pharmacy Part 1</option>
              <option value="2">B-Pharmacy Part 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">رول نمبر (Roll Number)</label>
            <input
              type="text"
              required
              placeholder="e.g., BP-2026-001"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">پاس ورڈ (Password)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
            />
          </div>

         <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 transition disabled:opacity-50 shadow-md cursor-pointer"
>
  {loading ? "Login ho raha hai..." : "لاگ ان کریں (Login)"}
</button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
          رابطہ نمبر: 03337703379 | ڈائریکٹر: طیب رضا قاضی
        </div>
      </div>
    </div>
  );
}