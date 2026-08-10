import api from "./api";

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const me = async (token: string) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};