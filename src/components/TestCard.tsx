import { Sparkles } from "lucide-react";

interface TestCardProps {
  selectedSubject: string;
}

export default function TestCard({ selectedSubject }: TestCardProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-slate-800/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xs md:text-sm font-bold text-white">Active Subject Hub: {selectedSubject}</h2>
          <p className="text-xs text-slate-400">Ask for MCQs, Short, or Long questions anytime.</p>
        </div>
      </div>
      <span className="hidden sm:inline-block text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-medium">
        PPMC Official AI
      </span>
    </div>
  );
}