import { Link } from "react-router";

export default function NavbarLanding() {
  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 shadow-md py-4 px-8 flex items-center justify-between backdrop-blur-md z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <img src="/atomic-logo.svg" alt="Atomic Study Logo" className="h-10 w-10 drop-shadow-2xl" />
        <span className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight drop-shadow-lg">
          Atomic Study
        </span>
      </div>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-white border-2 border-blue-700 text-blue-700 rounded-lg font-bold shadow hover:bg-blue-50 transition text-base dark:bg-gray-900 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-gray-800"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-lg transition text-base border-2 border-blue-700 hover:scale-105 dark:bg-blue-800 dark:hover:bg-blue-900 dark:border-blue-400"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
