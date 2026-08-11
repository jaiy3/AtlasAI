import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css";

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

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
    <main className="auth-page">
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <div className="auth-shell auth-shell-register">
        <div className="auth-brand">
          <div className="auth-brand-mark">↗</div>

          <div>
            <div className="auth-brand-name">AtlasAI</div>
            <div className="auth-brand-tagline">
              Intelligent crypto portfolio analytics
            </div>
          </div>
        </div>

        <section className="auth-card">
          <div className="auth-card-header">
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

          {error && (
            <div className="auth-message auth-message-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-grid">
              <div className="auth-field">
                <label htmlFor="register-first-name">
                  First name
                </label>

                <input
                  id="register-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-last-name">
                  Last name
                </label>

                <input
                  id="register-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a strong password"
                autoComplete="new-password"
              />

              <div className="password-rules">
                <span
                  className={
                    passwordChecks.length
                      ? "rule-valid"
                      : ""
                  }
                >
                  {passwordChecks.length ? "✓" : "○"} 8+
                  characters
                </span>

                <span
                  className={
                    passwordChecks.uppercase
                      ? "rule-valid"
                      : ""
                  }
                >
                  {passwordChecks.uppercase ? "✓" : "○"}{" "}
                  Uppercase letter
                </span>

                <span
                  className={
                    passwordChecks.lowercase
                      ? "rule-valid"
                      : ""
                  }
                >
                  {passwordChecks.lowercase ? "✓" : "○"}{" "}
                  Lowercase letter
                </span>

                <span
                  className={
                    passwordChecks.number
                      ? "rule-valid"
                      : ""
                  }
                >
                  {passwordChecks.number ? "✓" : "○"} Number
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>

          <p className="auth-footer">
            AtlasAI provides portfolio analytics and
            educational insights.
          </p>
        </section>
      </div>
    </main>
  );
}