import api from "./api";

// 전체 신고 내역 조회
export const fetchAllReports = async () => {
  const res = await api.get("/api/report");
  return res.data;
};
