// components/ChatInterface.tsx
"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, imageUrl?: string) => void;
  loading: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  loading,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    onSendMessage(input, imagePreview || undefined);
    setInput("");
    setImagePreview(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dir-rtl">
      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
              }`}
            >
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Paper Upload"
                  className="max-h-56 rounded-lg mb-3 border border-gray-300 object-cover"
                />
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-gray-100 border border-gray-200 text-gray-600 rounded-2xl p-3 text-xs animate-pulse flex items-center gap-2">
              <span>استاد جواب اور ٹیسٹ تیار کر رہے ہیں...</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Area */}
      {imagePreview && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-md border" />
            <span className="text-xs text-gray-600">پیپر / ٹیسٹ کی تصویر منسلک ہے</span>
          </div>
          <button
            onClick={() => setImagePreview(null)}
            className="text-xs text-red-500 font-bold hover:underline"
          >
            ختم کریں ✕
          </button>
        </div>
      )}

      {/* Input Box & Paper Upload Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
          {/* File Upload Icon/Button */}
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-xl border border-gray-300 transition flex items-center justify-center">
            📸
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <input
            type="text"
            placeholder="سوال پوچھیں، 50 MCQs کا ٹیسٹ بنوائیں يا پیپر چیک کروائیں..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow disabled:opacity-50"
          >
            ارسال
          </button>
        </form>
      </div>
    </div>
  );
}