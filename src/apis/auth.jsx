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

// 로그인 
export const signin = async ({ userId, password }) => {
  const body = {
    username: userId,
    password,
  };

  const res = await api.post("/api/auth/signin", body);
  return res.data; 
};

// 로그아웃 
export const logoutApi = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};
