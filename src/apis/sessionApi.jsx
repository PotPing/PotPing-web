import api from "./api";

// 주행 시작: 세션 ID 발급
export const startSession = async ({ userId, regionId }) => {
  const res = await api.post("/api/session/start", {
    userId,
    regionId,
  });
  return res.data;
};
