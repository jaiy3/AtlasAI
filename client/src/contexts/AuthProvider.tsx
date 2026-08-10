import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext, type User } from "./AuthContext";
import { me } from "../services/auth";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await me(token);
        setUser(data.user);
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        setToken(null);
      }

      setLoading(false);
    }

    loadUser();
  }, [token]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const logout = () => {
  localStorage.removeItem("token");

  setUser(null);
  setToken(null);
};

  return (
    <AuthContext.Provider
      value={{
      user,
      token,
      setUser,
      setToken,
      logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}