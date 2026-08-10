import Card from "../Card";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { register } from "../../services/authService";

export default function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {
  try {
    const response = await register({
      firstName,
      lastName,
      email,
      password,
    });

    console.log(response);
    alert("Registration successful!");
  } catch (error) {
    console.error(error);
    alert("Registration failed");
  }
};

  return (
    <Card>
      <h1>Create Account</h1>

      <Input
        label="First Name"
        placeholder="John"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <Input
        label="Last Name"
        placeholder="Doe"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

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
        Create Account
      </Button>
    </Card>
  );
}