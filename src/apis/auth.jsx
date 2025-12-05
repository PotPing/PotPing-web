import api from "./api";

// 회원가입 
export const signup = async ({ role, userId, password }) => {
  const backendRole = role === "ADMIN" ? "ADMIN" : "DRIVER";

  const body = {
    username: userId,
    password,
    role: backendRole,
  };

  const res = await api.post("/api/auth/signup", body);
  return res.data;
};
