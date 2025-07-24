import PlanList from "../components/PlanList";
import { useEffect, useState } from "react";
import { serverApi } from "../utils/api";

export default function HomePage() {
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const { data } = await serverApi.get("/plans/quotes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });
        setQuote(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingQuote(false);
      }
    };
    fetchQuote();
  }, []);

  const handleFetchActivity = async () => {
    setLoadingActivity(true);
    setActivity(null);
    try {
      const { data } = await serverApi.get("/plans/activity", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });
      setActivity(data.activity);
    } catch (err) {
      setActivity("Gagal mengambil activity.");
    } finally {
      setLoadingActivity(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-8 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 w-full">
        {/* Quotes & Activity Side by Side */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Motivational Quote Card */}
            <div className="flex-1 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-400 dark:border-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900 flex items-center gap-3">
              <span className="text-2xl text-blue-400 dark:text-blue-300">🌟</span>
              <div className="flex-1">
                <span className="block text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                  Inspirational quotes from ZenQuotes:
                </span>
                {loadingQuote ? (
                  <span className="block text-blue-800 dark:text-blue-200 mt-2 animate-pulse">
                    Mengambil motivasi...
                  </span>
                ) : quote && quote.q ? (
                  <>
                    <span className="block text-blue-800 dark:text-blue-100 mt-2">"{quote.q}"</span>
                    <span className="block text-xs text-blue-600 dark:text-blue-300 mt-1">
                      - {quote.a}
                    </span>
                  </>
                ) : (
                  <span className="block text-blue-800 dark:text-blue-100 mt-2">
                    Motivasi tidak tersedia.
                  </span>
                )}
              </div>
            </div>
            {/* Random Activity Card */}
            <div className="flex-1 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 shadow flex flex-col items-center gap-3">
              <span className="text-2xl text-blue-500 dark:text-blue-300">🎲</span>
              <span className="block text-lg font-bold text-blue-700 dark:text-blue-200 mb-1">
                Random Activity by Bored API
              </span>
              <button
                onClick={handleFetchActivity}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full font-semibold shadow transition disabled:opacity-50"
                disabled={loadingActivity}
              >
                {loadingActivity ? "Loading..." : "Get Random Activity"}
              </button>
              {activity && (
                <span className="block text-blue-800 dark:text-blue-100 mt-2 text-center">
                  {activity}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 animate-fade-in">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 drop-shadow-lg animate-fade-in">
              Selamat Datang Kembali! 🚀
            </h1>
            <h2 className="text-lg md:text-2xl font-semibold text-gray-700 dark:text-blue-200 mb-2 animate-fade-in delay-200">
              Siap membangun kebiasaan belajar hari ini?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-xl animate-fade-in delay-300">
              "Setiap langkah kecil adalah bagian dari perubahan besar. Mulai dari satu rencana,
              jadikan belajar sebagai habit, dan raih impianmu!"
            </p>
          </div>

          <div className="flex-1 flex justify-center items-center animate-fade-in delay-400">
            <img
              src="/atomic-logo.svg"
              alt="Atomic Study Home Illustration"
              className="w-48 md:w-64 drop-shadow-2xl animate-bounce-slow dark:drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            />
          </div>
        </div>
        <div className="mb-8 text-center animate-fade-in delay-500">
          <span className="inline-block px-4 py-2 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-semibold shadow animate-pulse">
            #AtomicHabit #BelajarKonsisten #AIStudyBuddy
          </span>
        </div>
        <PlanList />
      </div>
      {/* Motivational Footer & ZenQuotes Attribution */}
      <div className="mt-auto py-6 text-center text-blue-700 dark:text-blue-300 animate-fade-in delay-700">
        <span className="font-bold">Tetap semangat! </span>
        <span className="italic">"Belajar hari ini, sukses esok hari."</span>
        <div className="mt-4 text-xs text-blue-500 dark:text-blue-400">
          Inspirational quotes provided by{" "}
          <a
            href="https://zenquotes.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-700"
          >
            ZenQuotes API
          </a>{" "}
          &nbsp;|&nbsp;
          <a
            href="https://zenquotes.io/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-700"
          >
            ZenQuotes.io Docs
          </a>
        </div>
      </div>
    </div>
  );
}
