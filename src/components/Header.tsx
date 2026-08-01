// components/Header.tsx
"use client";

interface HeaderProps {
  subject: string;
  setSubject: (sub: string) => void;
  chapter: string;
  setChapter: (chap: string) => void;
  onLogout?: () => void;
}

export default function Header({
  subject,
  setSubject,
  chapter,
  setChapter,
  onLogout,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm dir-rtl">
      {/* College Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow">
          P
        </div>
        <div>
          <h1 className="font-bold text-blue-900 text-base leading-tight">
            پاک پیرامیڈیکل کالج، چنیوٹ
          </h1>
          <p className="text-[11px] text-gray-500">
            Director: Tayyab Raza Qazi | Helpline: 03337703379
          </p>
        </div>
      </div>

      {/* Subject & Chapter Selectors + Logout */}
      <div className="flex items-center gap-3">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="text-xs p-2.5 border border-gray-300 rounded-lg bg-gray-50 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pharmaceutics">Pharmaceutics</option>
          <option value="Anatomy and Physiology">Anatomy & Physiology</option>
          <option value="Microbiology">Microbiology</option>
          <option value="Biochemistry">Biochemistry</option>
        </select>

        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="e.g., Chapter 1"
          className="text-xs p-2.5 border border-gray-300 rounded-lg bg-gray-50 w-32 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        />

        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg font-bold transition"
          >
            لاگ آؤٹ
          </button>
        )}
      </div>
    </header>
  );
}