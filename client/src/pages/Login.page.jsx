import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { serverApi } from "../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await serverApi.post("/login", {
        email,
        password
      });
      const access_token = response.data.access_token;
      // console.log(response);

      localStorage.setItem("access_token", access_token);
      navigate("/home");
    } catch (err) {
      console.log(err, "<== error handle login");
      Swal.fire({
        icon: "warning",
        text: err.response.data.message
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
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h3 className="card-title fw-bold text-dark">Welcome Back</h3>
                <p className="text-muted">Please sign in to your account</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 mb-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </button>

                <div className="text-center mb-3">
                  <span className="text-muted">or</span>
                </div>

                <div id="buttonDiv" className="d-flex justify-content-center mb-3"></div>

                <hr className="my-4" />

                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="text-decoration-none text-primary fw-semibold">
                    Create one
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
