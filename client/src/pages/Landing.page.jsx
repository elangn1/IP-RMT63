import { Link, Navigate } from "react-router";

export default function LandingPage() {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-12 pb-16 md:pb-12 relative">
        {/* Left: Text */}
        <div className="flex-1 max-w-xl text-center md:text-left flex flex-col gap-6 justify-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-2 leading-tight drop-shadow-lg dark:text-white">
            Belajar <span className="text-blue-600 dark:text-blue-400 animate-pulse">Efektif</span>{" "}
            & <span className="text-blue-400 dark:text-blue-300 animate-pulse">Personal</span>{" "}
            <br className="hidden md:block" /> Mulai dari{" "}
            <span className="text-blue-700 dark:text-blue-400 animate-bounce">Hal Terkecil</span>
          </h1>
          <h2 className="text-lg md:text-2xl font-semibold text-blue-700 mb-2 dark:text-blue-300 animate-fade-in delay-200">
            Atomic Study: Ubah kebiasaan kecil, capai hasil besar.
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto md:mx-0 dark:text-gray-300 animate-fade-in delay-300">
            Platform belajar modern berbasis{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">AI</span> yang membantumu
            membangun habit belajar dari unit terkecil ("atom") hingga jadi perubahan besar. Temukan
            gaya belajar, dapatkan rekomendasi AI, quiz interaktif, dan motivasi harian yang bikin
            belajar makin seru!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mt-2 animate-fade-in delay-500">
            <Link
              to="/register"
              className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg transition text-lg border-2 border-blue-700 hover:scale-110 dark:bg-blue-800 dark:hover:bg-blue-900 dark:border-blue-400 animate-wiggle"
            >
              🚀 Daftar Gratis
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white border-2 border-blue-700 text-blue-700 rounded-lg font-bold shadow hover:bg-blue-50 transition text-lg dark:bg-gray-900 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-gray-800 hover:scale-105"
            >
              🔑 Sudah Punya Akun?
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 animate-fade-in delay-700">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 dark:bg-gray-800 dark:border-blue-900 hover:scale-105 transition shadow-lg">
              <span className="text-2xl animate-bounce">🧠</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Quiz Gaya Belajar &amp; AI Recommendation
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 dark:bg-gray-800 dark:border-blue-900 hover:scale-105 transition shadow-lg">
              <span className="text-2xl animate-pulse">💬</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Motivasi Harian &amp; Tips Belajar
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 dark:bg-gray-800 dark:border-blue-900 hover:scale-105 transition shadow-lg">
              <span className="text-2xl animate-bounce">🔒</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Privasi Aman, Data Milikmu
              </span>
            </div>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center items-center relative animate-fade-in delay-300">
          <div className="relative group">
            <img
              src="/atomic-logo.svg"
              alt="Atomic Study Illustration"
              className="w-72 md:w-96 drop-shadow-2xl animate-bounce-slow dark:drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:scale-110 transition"
            />
            <div className="absolute -top-8 -right-8 bg-blue-100 border-2 border-blue-400 rounded-full p-4 shadow-lg animate-spin-slow dark:bg-gray-800 dark:border-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#2563eb"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute left-0 top-0 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10 animate-pulse dark:bg-blue-900" />
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl -z-10 animate-pulse dark:bg-blue-800" />
      </main>

      {/* Curiosity Section */}
      <section className="w-full py-10 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 dark:from-gray-900 dark:to-gray-950 dark:border-blue-900 animate-fade-in delay-1000">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 dark:text-blue-300 animate-bounce">
            Apa yang bikin aplikasi ini beda?
          </h3>
          <ul className="text-lg text-gray-700 space-y-2 mb-6 dark:text-gray-200">
            <li>
              ✨ <span className="font-bold text-blue-600 dark:text-blue-400">AI Feedback</span>{" "}
              instan untuk setiap rencana belajar kamu
            </li>
            <li>🧩 Quiz otomatis yang menantang dan bikin nagih</li>
            <li>🔒 Privasi dan data kamu aman</li>
          </ul>
          <p className="text-blue-600 font-semibold text-xl animate-bounce dark:text-blue-400">
            Yuk, coba sekarang dan rasakan bedanya!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-white/80 text-center text-gray-500 text-sm border-t border-blue-100 mt-auto dark:bg-gray-900/80 dark:text-gray-300 dark:border-blue-900 animate-fade-in delay-1400">
        &copy; {new Date().getFullYear()} IP Atomic Study. All rights reserved.
      </footer>
    </div>
  );
}
