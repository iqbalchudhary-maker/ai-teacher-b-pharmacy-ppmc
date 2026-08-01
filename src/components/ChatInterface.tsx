import { Send, FileText, Sparkles } from "lucide-react";
import { FormEvent, ChangeEvent, RefObject } from "react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  text: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  loading: boolean;
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  handleSendMessage: (e?: FormEvent) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  selectedSubject: string;
}

export default function ChatInterface({
  messages,
  loading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleImageUpload,
  selectedImage,
  setSelectedImage,
  messagesEndRef,
  selectedSubject
}: ChatInterfaceProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-slate-800/90 border border-slate-700/60 text-slate-100 rounded-bl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/90 border border-slate-700/60 text-slate-300 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center space-x-2 animate-pulse">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" />
              <span>AI Professor is typing response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={selectedImage} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-700" />
            <span className="text-xs text-slate-300">Image attached for evaluation</span>
          </div>
          <button 
            onClick={() => setSelectedImage(null)}
            className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Footer */}
      <div className="p-3 md:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 max-w-4xl mx-auto">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${selectedSubject} question, or type 'give me MCQs / Short / Long questions'...`}
            className="flex-1 bg-slate-900 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={loading || (!inputMessage.trim() && !selectedImage)}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium p-2.5 rounded-xl transition flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

    </div>
  );
}