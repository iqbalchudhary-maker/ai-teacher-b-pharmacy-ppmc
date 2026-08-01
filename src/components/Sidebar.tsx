// components/Sidebar.tsx
"use client";

interface ChatSession {
  id: string;
  title: string;
  subject?: string;
  chapter?: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col hidden md:flex border-l border-gray-800 dir-rtl">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow"
        >
          <span>+</span>
          <span>نئی چیٹ (New Chat)</span>
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
        <div className="px-2 py-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          پچھلی نشستیں (Recent Chats)
        </div>

        {sessions.length === 0 ? (
          <div className="text-gray-500 text-[11px] text-center py-4">
            کوئی پرانی گفتگو موجود نہیں۔
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-right p-2.5 rounded-lg text-xs truncate transition block ${
                activeSessionId === session.id
                  ? "bg-gray-800 text-white font-bold border-r-4 border-blue-500"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
              }`}
            >
              💬 {session.title || `${session.subject || "General"} - ${session.chapter || "Session"}`}
            </button>
          ))
        )}
      </div>

      {/* Developer & System Branding Footer */}
      <div className="p-4 border-t border-gray-800 text-[10px] text-gray-500 text-center leading-relaxed">
        <div>Pak Paramedical College Chiniot</div>
        <div className="text-gray-400 font-semibold mt-0.5">
          Powered by SM Tech AI Solutions
        </div>
      </div>
    </aside>
  );
}