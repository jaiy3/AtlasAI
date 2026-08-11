import { useState } from "react";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";

type LoginProps = {
  onSubmit: (
    email: string,
    password: string
  ) => void | Promise<void>;

  loading?: boolean;

  error?: string;

  onRegister?: () => void;
};

export default function Login({
  onSubmit,
  loading = false,
  error = "",
  onRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    onSubmit(email, password);
  }

  return (
    <Card>
      <div className="auth-heading">
        <div className="auth-icon">↗</div>

        <div>
          <span className="auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>Sign in to AtlasAI</h1>

          <p>
            Continue analyzing your crypto portfolio
            with intelligent insights.
          </p>
        </div>
      </div>

      <div className="auth-form">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          style={{
            width: "100%",
            marginTop: 16,
          }}
        >
          {loading ? "Signing in..." : "Sign in →"}
        </Button>
      </div>

      <div className="auth-divider">
        <span />
        <p>New to AtlasAI?</p>
        <span />
      </div>

      <button
        type="button"
        className="auth-secondary-button"
        onClick={onRegister}
      >
        Create an account
      </button>

      <p className="auth-footnote">
        Your portfolio data stays connected to your wallet.
      </p>
    </Card>
  );
}