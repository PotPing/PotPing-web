import api from "./api";

// 전체 신고 내역 조회
export const fetchAllReports = async () => {
  const res = await api.get("/api/report");
  return res.data;
};

// 내 신고/처리 내역 조회
export const getMyReports = async () => {
  const res = await api.get("/api/report/me");
  return res.data; 
};

// 보수 완료 처리
export const completeReport = async (reportId) => {
  return api.post(`/api/report/${reportId}`);
};