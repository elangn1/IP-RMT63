import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { serverApi } from "../utils/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await serverApi.post("/register", { email, password });
      Swal.fire({
        icon: "success",
        text: "Registration successful! Please login.",
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response?.data?.message || "Registration failed"
      });
    }
  };

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    try {
      const { data } = await axios.post("http://localhost:3000/google-login", {
        id_token: response.credential
      });

      const access_token = data.access_token;
      localStorage.setItem("access_token", access_token);
      Swal.fire({
        icon: "success",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/home");
    } catch (err) {
      console.error(err, "<== error handle google login");
      Swal.fire({
        icon: "warning",
        text: err.response.data.message
      });
    }
  }

  useEffect(() => {
    if (window.google && document.getElementById("buttonDiv")) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
        theme: "outline", // Options: "outline", "filled_blue", "filled_black"
        size: "large", // Options: "large", "medium", "small"
        shape: "circle", // Options: "rectangular", "pill", "circle", "square"
        text: "continue_with", // Options: "signin_with", "signup_with", "continue_with", "signin"
        logo_alignment: "center", // Options: "left", "center"
        width: "200", // Custom width in pixels
        locale: "en_US"
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center py-8 px-4 gap-8 md:gap-16">
        {/* Left: Illustration */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center">
          <img
            src="/atomic-logo.svg"
            alt="Atomic Study Illustration"
            className="w-60 h-60 mb-6 drop-shadow-2xl animate-bounce-slow"
          />
          <h3 className="text-2xl font-bold text-blue-700 mb-2 dark:text-blue-300">
            Daftar & Mulai Belajar
          </h3>
          <p className="text-gray-500 text-center max-w-xs dark:text-gray-300">
            Buat akun gratis, dapatkan rekomendasi AI, dan quiz interaktif yang bikin belajar makin
            seru!
          </p>
        </div>
        {/* Right: Register Form */}
        <div className="flex-1 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 min-h-[540px] flex flex-col justify-center mx-auto md:mx-0 dark:bg-gray-900 dark:shadow-blue-900 dark:border dark:border-blue-900">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-1 text-center dark:text-blue-300">
              Sign up for Atomic Study
            </h2>
            <p className="text-gray-500 text-center dark:text-gray-300">
              Create your account to start learning
            </p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-200"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50 dark:bg-gray-800 dark:text-white dark:border-blue-700"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-200"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50 dark:bg-gray-800 dark:text-white dark:border-blue-700"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white font-bold rounded-lg shadow hover:bg-blue-800 transition text-lg mb-2 flex items-center justify-center gap-2 dark:bg-blue-800 dark:hover:bg-blue-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3A2.25 2.25 0 018.25 19.5V9m7.5 0H8.25m7.5 0a2.25 2.25 0 012.25 2.25v7.5A2.25 2.25 0 0115.75 21H8.25A2.25 2.25 0 016 19.5v-7.5A2.25 2.25 0 018.25 9h7.5z"
                />
              </svg>
              Sign Up
            </button>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="mx-3 text-gray-400 text-sm dark:text-gray-300">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div
              id="buttonDiv"
              className="flex flex-col justify-center items-center transition-none"
              style={{ height: 70, minHeight: 70, maxHeight: 70 }}
            ></div>
            <div className="text-center mt-4">
              <span className="text-gray-500 dark:text-gray-300">Already have an account? </span>
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline dark:text-blue-400"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
