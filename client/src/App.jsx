import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/Login.page";
import RegisterPage from "./pages/Register.page";
import Home from "./pages/Home.page";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
