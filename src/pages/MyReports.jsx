import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import ReportCard from "../components/report/ReportCard";

export default function MyReports() {
  const navigate = useNavigate();

  const userName = "user1";
  const reports = [
    {
      id: 1,
      date: "2025-11-30",
      title: "경산시 대학교 포트홀 2개 감지",
      status: "NEW",
    },
    {
      id: 2,
      date: "2025-11-30",
      title: "경산시 대학교 포트홀 2개 감지",
      status: "IN_PROGRESS",
    },
    {
      id: 3,
      date: "2025-11-30",
      title: "경산시 대학교 포트홀 2개 감지",
      status: "DONE",
    },
  ];

  const handleCardClick = (reportId) => {
    // navigate(`/my-reports/${reportId}`);
    console.log("신고 상세로 이동:", reportId);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <HeaderUser />

      <main className="max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-16">
        {/* 제목 영역 */}
        <h1 className="text-xl md:text-2xl font-semibold">
          <span className="text-[#FF7A00] mr-1">{userName}</span>
          님의 신고 내역
        </h1>

        {/* 신고 목록 */}
        <section className="mt-8 space-y-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              date={report.date}
              title={report.title}
              status={report.status}
              onClick={() => handleCardClick(report.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
