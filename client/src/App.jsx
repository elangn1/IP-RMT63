import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import LoginPage from "./pages/Login.page";
import RegisterPage from "./pages/Register.page";
import LandingPage from "./pages/Landing.page";
import HomePage from "./pages/Home.page";
import QuizPage from "./pages/Quiz.page";
import AuthLayout from "./layouts/AuthLayout";
import LandingLayout from "./layouts/LandingLayout";
import { store } from "./store";
import { Provider } from "react-redux";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          <Route path="/home" element={<AuthLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
