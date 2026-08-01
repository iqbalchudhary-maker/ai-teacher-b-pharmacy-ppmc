// components/TestCard.tsx
"use client";

import { useState } from "react";

interface Option {
  id: string; // "A", "B", "C", "D"
  text: string;
}

interface QuestionProps {
  id: number;
  question: string;
  options: Option[];
  correctOption?: string;
  explanation?: string;
}

export default function TestCard({
  id,
  question,
  options,
  correctOption,
  explanation,
}: QuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (optionId: string) => {
    setSelected(optionId);
    setShowResult(true);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm my-4 dir-rtl text-right">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-900 font-bold text-xs px-2.5 py-1 rounded-md">
          سوال {id}
        </span>
        <h3 className="font-semibold text-gray-800 text-sm leading-relaxed">
          {question}
        </h3>
      </div>

      <div className="space-y-2 mt-4">
        {options.map((option) => {
          let btnStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300";

          if (showResult && correctOption) {
            if (option.id === correctOption) {
              btnStyle = "bg-green-100 border-green-500 text-green-900 font-bold";
            } else if (option.id === selected) {
              btnStyle = "bg-red-100 border-red-500 text-red-900 font-bold";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`w-full text-right p-3 rounded-lg text-xs border transition flex items-center justify-between ${btnStyle}`}
            >
              <span>
                <strong className="ml-2 font-bold">{option.id}.</strong> {option.text}
              </span>
              {showResult && option.id === correctOption && (
                <span className="text-green-600 font-bold text-sm">✓ صحیح</span>
              )}
              {showResult && option.id === selected && option.id !== correctOption && (
                <span className="text-red-600 font-bold text-sm">✗ غلط</span>
              )}
            </button>
          );
        })}
      </div>

      {showResult && explanation && (
        <div className="mt-4 p-3 bg-blue-50 border-r-4 border-blue-500 text-blue-900 text-xs rounded-l-md leading-relaxed">
          <strong className="block mb-1">استاد کی وضاحت:</strong>
          {explanation}
        </div>
      )}
    </div>
  );
}