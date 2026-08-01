import { Menu, BookOpen } from "lucide-react";

interface HeaderProps {
  selectedSubject: string;
  setSelectedSubject: (sub: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({ selectedSubject, setSelectedSubject, onToggleSidebar }: HeaderProps) {
  const subjects = [
    "Pharmaceutics",
    "Pharmacology",
    "Pharmaceutical Chemistry",
    "Pharmacognosy",
    "Anatomy & Physiology",
    "Community Pharmacy"
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800/50"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="font-bold text-sm md:text-base text-white">Pak Paramedical College, Chiniot</h1>
          <p className="text-xs text-slate-400 hidden sm:block">B-Pharmacy AI Learning Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-inner">
        <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-transparent text-xs md:text-sm text-slate-200 focus:outline-none cursor-pointer"
        >
          {subjects.map((sub) => (
            <option key={sub} value={sub} className="bg-slate-900 text-white">
              {sub}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}