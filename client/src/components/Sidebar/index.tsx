import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        padding: "24px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2>AtlasAI</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "32px",
        }}
      >
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/dashboard">Portfolio</Link>

        <Link to="/dashboard">Transactions</Link>

        <Link to="/dashboard">AI Assistant</Link>
      </nav>
    </aside>
  );
}