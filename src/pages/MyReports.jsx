import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import ReportCard from "../components/report/ReportCard";
import { getMyReports } from "../apis/reportApi";

export default function MyReports() {
  const navigate = useNavigate();

  // 로그인 정보 가져오기
  const storedUserId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role");

  // 역할에 따라 표시 이름 설정
  const displayName =
    storedRole === "ADMIN"
      ? `관리자 ${storedUserId}`
      : `사용자 ${storedUserId}`;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapStatus = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "NEW";
      case "DONE":
        return "DONE";
      default:
        return "NEW";
    }
  };

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        const data = await getMyReports();
        setReports(data || []);
      } catch (err) {
        console.error("내 신고 내역 조회 실패:", err);
        setError("신고 내역을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  const handleCardClick = (reportId) => {
    console.log("신고 상세 이동:", reportId);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <HeaderUser />

      <main className="max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16">
        <h1 className="text-xl md:text-2xl font-semibold">
          <span className="text-[#FF7A00] mr-1">{displayName}</span>
          님의 신고 내역
        </h1>

        <section className="mt-8">
          {loading && <p className="text-sm text-gray-300">불러오는 중...</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && reports.length === 0 && (
            <p className="text-sm text-gray-300">아직 신고한 내역이 없습니다.</p>
          )}

          <div className="mt-4 space-y-6">
            {reports.map((report) => {
              const {
                reportId,
                regionName,
                totalPotholesInSession,
                processStatus,
                reportedAt,
              } = report;

              const date = reportedAt ? reportedAt.slice(0, 10) : "";
              const title = `${regionName} 포트홀 ${totalPotholesInSession}개 감지`;

              return (
                <ReportCard
                  key={reportId}
                  date={date}
                  title={title}
                  status={mapStatus(processStatus)}
                  onClick={() => handleCardClick(reportId)}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
