import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#d9e1f3] flex items-center justify-center p-4 dir-rtl">
      <div className="bg-[#111827] border border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
        
        {/* ہیڈر */}
        <div>
          <h1 className="text-xl font-bold text-white">
            Pak Paramedical College, Chiniot
          </h1>
          <p className="text-xs text-gray-400 mt-1">Pharmacy Teacher - AI Learning Portal</p>
        </div>

        {/* لاگ ان اور دوسرے بٹنز */}
        <div className="space-y-3">
          <Link
            href="/login?part=1"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm shadow"
          >
            🚀 B-Pharmacy Part 1 Login
          </Link>

          <Link
            href="/login?part=2"
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition text-sm shadow"
          >
            🚀 B-Pharmacy Part 2 Login
          </Link>

          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl transition text-sm">
            💻 Install App
          </button>

          {/* نیا ایڈمن لاگ ان بٹن */}
          <Link
            href="/admin"
            className="w-full flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition text-sm shadow"
          >
            🔐 Admin Login Panel
          </Link>
        </div>

       <div className="text-xs font-bold text-gray-400 tracking-wider pt-3 border-t border-gray-800/60">
          Powered by 
          <a 
            href="https://www.smtechaisolutions.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-extrabold ml-1 transition-colors"
          >
            SM Tech AI Solutions
          </a>
        </div>
      </div>
    </div>
  );
}