import "./auth.css";

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
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    onSubmit(email, password);
  }

  return (
    <main className="auth-page">
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <div className="auth-shell">
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

          {error && (
            <div className="auth-message auth-message-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>

              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to AtlasAI?</span>
          </div>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={onRegister}
          >
            Create an account
          </button>

          <a className="auth-demo-link" href="/demo">
            Explore the live demo, no account needed →
          </a>

          <p className="auth-footer">
            Your portfolio data stays connected to your
            wallet.
          </p>
        </section>
      </div>
    </main>
  );
}