import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import samplePothole from "../assets/pothole_sample.png";
import sampleHistogram from "../assets/pothole_histogram.png";
import StatusBadgeSelect from "../components/report/StatusBadgeSelect";

const SEVERITY_LABEL = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "대기중" },
  { value: "IN_PROGRESS", label: "처리중" },
  { value: "COMPLETED", label: "완료" },
];

export default function ReportDetailAdmin() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const dummy = {
      id,
      status: "PENDING",
      location: "경상북도 경산시",
      detectedAt: "2025-12-03 16:17:59",
      severity: "MEDIUM",
      detectionCount: 3,
      reliabilityAvg: 80,
      originalImageUrl: samplePothole,
      equalizedImageUrl: sampleHistogram,
    };
    setReport(dummy);
    setStatus(dummy.status);
  }, [id]);

  if (!report) return null;

  const handleChangeStatus = async (nextStatus) => {
    const prevStatus = status;

    setStatus(nextStatus);
    try {
      setIsUpdating(true);
      // 상태 변경 API 연동 해야함
      console.log("신고 상태 변경:", report.id, nextStatus);

      setReport((prev) => ({ ...prev, status: nextStatus }));
    } catch (err) {
      console.error(err);
      alert("상태 변경에 실패했습니다.");
      setStatus(prevStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const { location, detectedAt, severity, detectionCount, reliabilityAvg } =
    report;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <HeaderUser />

      <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-[36px] font-semibold text-[#F97316]">
                포트홀 {report.id}
              </h1>

              <div className="flex items-center gap-3">
                <StatusBadgeSelect
                  value={status}
                  onChange={handleChangeStatus}
                  disabled={isUpdating}
                />
              </div>
            </div>

            {/* 이미지 */}
            <div className="w-full max-w-[640px] overflow-hidden bg-black/40 border border-white/5">
              <img
                src={report.originalImageUrl}
                alt="포트홀 원본 이미지"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* 오른쪽 */}
          <section className="flex-1 space-y-4 text-sm mt-16">
            <InfoRow label="위치" value={location} />
            <InfoRow label="감지된 시각" value={detectedAt} />

            {/* 심각도 */}
            <div className="flex items-center gap-6">
              <span className="w-24 text-gray-400">심각도</span>
              <div className="flex items-center gap-3 text-xs">
                {["HIGH", "MEDIUM", "LOW"].map((level) => {
                  const active = severity === level;
                  return (
                    <span
                      key={level}
                      className={
                        "px-2 py-1 rounded-full border " +
                        (active
                          ? level === "HIGH"
                            ? "border-red-400 text-red-300"
                            : level === "MEDIUM"
                            ? "border-blue-400 text-blue-300"
                            : "border-green-400 text-green-300"
                          : "border-transparent text-gray-500")
                      }
                    >
                      {SEVERITY_LABEL[level]}
                    </span>
                  );
                })}
              </div>
            </div>

            <InfoRow label="탐지 횟수" value={`${detectionCount} 회`} />
            <InfoRow label="신뢰도 평균" value={`${reliabilityAvg}%`} />

            {/* 평활화 이미지 */}
            <div className="flex items-start gap-6 pt-4">
              <span className="w-24 text-gray-400 mt-2">평활화 이미지</span>
              <div className="w-full max-w-[360px] aspect-video overflow-hidden bg-black/40 border border-white/5">
                <img
                  src={report.equalizedImageUrl}
                  alt="히스토그램 평활화 결과 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-24 text-gray-400">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
