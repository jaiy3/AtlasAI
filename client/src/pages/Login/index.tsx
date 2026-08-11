import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import LoginForm from "../../components/Login";
import { login } from "../../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(email: string, password: string) {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);

      setToken(response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      onRegister={() => navigate("/register")}
    />
  );
}