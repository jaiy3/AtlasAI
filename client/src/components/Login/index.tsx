import { useState } from "react";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";

type LoginProps = {
  onSubmit: (email: string, password: string) => void | Promise<void>;
  loading?: boolean;
};

export default function Login({
  onSubmit,
  loading = false,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    onSubmit(email, password);
  }

  return (
    <Card>
      <h1>Login</h1>

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        style={{
          width: "100%",
          marginTop: 16,
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Card>
  );
}