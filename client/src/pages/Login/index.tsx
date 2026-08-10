import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import LoginForm from "../../components/Login";
import { login } from "../../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [loading, setLoading] = useState(false);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setToken(response.data.token);

        navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
    />
  );
}