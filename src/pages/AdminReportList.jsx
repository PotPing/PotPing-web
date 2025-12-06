import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import HeaderUser from "../components/header/HeaderUser";
import MyReportCard from "../components/report/ReportCard";
import { fetchRegions } from "../apis/regionApi";

const TABS = [
  { key: "NEW", label: "신고 내역" },
  { key: "IN_PROGRESS", label: "처리중" },
  { key: "DONE", label: "완료" },
];

const MOCK_REPORTS = [
  {
    id: 1,
    date: "2025-11-30",
    title: "경산시 대학교 포트홀 2개 감지",
    status: "NEW",
    province: "경상북도",
    city: "경산시",
  },
  {
    id: 2,
    date: "2025-11-30",
    title: "경산시 대학교 포트홀 2개 감지",
    status: "IN_PROGRESS",
    province: "경상북도",
    city: "경산시",
  },
  {
    id: 3,
    date: "2025-11-30",
    title: "경산시 대학교 포트홀 2개 감지",
    status: "DONE",
    province: "경상북도",
    city: "경산시",
  },
];

export default function AdminReportList() {
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");

  // 시/도, 시/군/구 목록
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]); 

  // 선택된 시/도, 시/군/구의 id
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const [regionError, setRegionError] = useState("");

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setRegionError("");
        const data = await fetchRegions(); 
        setProvinces(data);
        if (data.length > 0) {
          setSelectedProvinceId(data[0].id); 
        }
      } catch (e) {
        console.error(e);
        setRegionError("지역 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedProvinceId == null) return;
      try {
        setRegionError("");
        const data = await fetchRegions(selectedProvinceId);
        setCities(data);
        if (data.length > 0) {
          setSelectedCityId(data[0].id); 
        } else {
          setSelectedCityId(null);
        }
      } catch (e) {
        console.error(e);
        setRegionError("시/군/구 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadCities();
  }, [selectedProvinceId]);

  const selectedProvinceName = useMemo(
    () => provinces.find((p) => p.id === selectedProvinceId)?.name || "",
    [provinces, selectedProvinceId]
  );

  const selectedCityName = useMemo(
    () => cities.find((c) => c.id === selectedCityId)?.name || "",
    [cities, selectedCityId]
  );

  const handleProvinceChange = (e) => {
    const nextId = e.target.value === "" ? null : Number(e.target.value);
    setSelectedProvinceId(nextId);
  };

  const handleCityChange = (e) => {
    const nextId = e.target.value === "" ? null : Number(e.target.value);
    setSelectedCityId(nextId);
  };

  // 탭 + 지역 필터를 모두 적용한 리스트
  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((r) => {
      if (r.status !== activeTab) return false;
      if (selectedProvinceName && r.province !== selectedProvinceName)
        return false;
      if (selectedCityName && r.city !== selectedCityName) return false;
      return true;
    });
  }, [activeTab, selectedProvinceName, selectedCityName]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <HeaderUser />

      <main className="max-w-5xl mx-auto pt-10 pb-16 px-6 md:px-10">
        {/* 탭 영역 */}
        <div className="flex items-center gap-5 border-b border-[#111827] pb-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-sm md:text-base font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 지역 필터 */}
        <div className="mt-6 flex flex-wrap gap-4">
          {/* 시/도 */}
          <div className="w-[220px]">
            <div className="relative">
              <select
                value={selectedProvinceId ?? ""}
                onChange={handleProvinceChange}
                className="w-full h-10 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none"
              >
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                <IoIosArrowDown size={18} />
              </span>
            </div>
          </div>

          {/* 시/군/구 */}
          <div className="w-[220px]">
            <div className="relative">
              <select
                value={selectedCityId ?? ""}
                onChange={handleCityChange}
                className="w-full h-10 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                <IoIosArrowDown size={18} />
              </span>
            </div>
          </div>
        </div>

        {regionError && (
          <p className="mt-3 text-sm text-red-400">{regionError}</p>
        )}

        {/* 신고 목록 */}
        <section className="mt-8 space-y-4">
          {filteredReports.length === 0 ? (
            <div className="w-full rounded-xl bg-[#020617] border border-dashed border-[#374151] px-6 py-8 text-center text-sm text-gray-400">
              선택한 탭과 지역에 해당하는 신고가 없습니다.
            </div>
          ) : (
            filteredReports.map((report) => (
              <MyReportCard
                key={report.id}
                date={report.date}
                title={report.title}
                status={report.status}
                onClick={() => {
                  console.log("신고 상세 이동:", report.id);
                  navigate(`/admin/report/${report.id}`);
                }}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
