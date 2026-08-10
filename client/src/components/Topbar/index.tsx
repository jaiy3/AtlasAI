import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: "72px",
        padding: "0 24px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2>Overview</h2>

      <span>
        {user ? `${user.firstName} ${user.lastName}` : ""}
      </span>
    </header>
  );
}