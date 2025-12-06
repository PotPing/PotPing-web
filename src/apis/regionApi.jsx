import api from "./api";

// 지역 목록 조회
export const fetchRegions = async (parentId) => {
  const res = await api.get("/api/region", {
    params: parentId != null ? { parentId } : {},
  });
  return res.data;
};
