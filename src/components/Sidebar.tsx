import { Plus, MessageSquare, X, Sparkles } from "lucide-react";

interface SidebarProps {
  sessions: any[];
  currentSessionId: string | null;
  onSelectSession: (id: string, subject: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ sessions, currentSessionId, onSelectSession, onNewChat, isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-40
      w-72 bg-slate-950 border-r border-slate-800 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-lg text-white">PPMC AI Portal</span>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-5 w-5" />
          <span>New Chat Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Your Previous Lectures
        </p>
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-500 px-2 italic">No saved chats yet.</p>
        ) : (
          sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id, s.subject)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center space-x-3 transition ${
                currentSessionId === s.id 
                  ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 font-medium" 
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-indigo-400" />
              <span className="truncate">{s.title || "Untitled Session"}</span>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 text-center">
        Pak PPMC Chiniot | SM Tech AI
      </div>
    </aside>
  );
}