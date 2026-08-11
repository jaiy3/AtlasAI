import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";

import { register } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number;

  async function handleSubmit() {
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!passwordValid) {
      setError(
        "Please make sure your password meets all the requirements."
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to create your account. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="auth-heading">
        <div className="auth-icon">✦</div>

        <div>
          <span className="auth-eyebrow">
            GET STARTED
          </span>

          <h1>Create your account</h1>

          <p>
            Set up AtlasAI and start exploring your crypto
            portfolio.
          </p>
        </div>
      </div>

      <div className="register-name-grid">
        <Input
          label="First name"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          label="Last name"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

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
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="password-requirements">
        <span className={passwordChecks.length ? "valid" : ""}>
          {passwordChecks.length ? "✓" : "○"} 8+ characters
        </span>

        <span className={passwordChecks.uppercase ? "valid" : ""}>
          {passwordChecks.uppercase ? "✓" : "○"} Uppercase letter
        </span>

        <span className={passwordChecks.lowercase ? "valid" : ""}>
          {passwordChecks.lowercase ? "✓" : "○"} Lowercase letter
        </span>

        <span className={passwordChecks.number ? "valid" : ""}>
          {passwordChecks.number ? "✓" : "○"} Number
        </span>
      </div>

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
        {loading
          ? "Creating account..."
          : "Create account →"}
      </Button>

      <div className="auth-divider">
        <span />
        <p>Already have an account?</p>
        <span />
      </div>

      <button
        type="button"
        className="auth-secondary-button"
        onClick={() => navigate("/login")}
      >
        Sign in
      </button>

      <p className="auth-footnote">
        AtlasAI provides portfolio analytics and educational
        insights.
      </p>
    </Card>
  );
}