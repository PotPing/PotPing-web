import React, { useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import HeaderUser from "../components/header/HeaderUser";
import MyReportCard from "../components/report/ReportCard";
import { PROVINCES, CITIES_BY_PROVINCE } from "../constants/regions";

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
  const [province, setProvince] = useState("경상북도");
  const [city, setCity] = useState("경산시");

  const cityOptions = useMemo(
    () => CITIES_BY_PROVINCE[province] || [],
    [province]
  );

  const handleProvinceChange = (e) => {
    const nextProvince = e.target.value;
    setProvince(nextProvince);
    const firstCity = CITIES_BY_PROVINCE[nextProvince]?.[0] || "";
    setCity(firstCity);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // 탭 + 지역 필터를 모두 적용한 리스트
  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter(
      (r) =>
        r.status === activeTab && r.province === province && r.city === city
    );
  }, [activeTab, province, city]);

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
                value={province}
                onChange={handleProvinceChange}
                className="w-full h-10 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                value={city}
                onChange={handleCityChange}
                className="w-full h-10 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none"
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                <IoIosArrowDown size={18} />
              </span>
            </div>
          </div>
        </div>

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
                  // navigate(`/admin/reports/${report.id}`);
                  console.log("신고 상세 이동:", report.id);
                }}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
