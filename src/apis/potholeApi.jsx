import api from "./api";

// 세션별 포트홀 목록 조회
export const fetchPotholesBySession = async (sessionId) => {
  const res = await api.get(`/api/pothole/session/${sessionId}`);
  
  return res.data;
};