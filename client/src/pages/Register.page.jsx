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
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="card-title fw-bold mb-2 text-dark text-center pb-2">
                Get started for free
              </h2>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <span className="input-group-text" title="Password minimal 6 karakter">
                      <i className="bi bi-info-circle"></i>
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3 fw-bold">
                  Sign Up
                </button>
              </form>
              <p className="text-center text-muted mb-3">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Login here
                </Link>
              </p>
              <div className="mt-4">
                <p className="fw-semibold mb-2">Or sign up using:</p>
                <div id="buttonDiv" className="d-flex justify-content-center mb-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
