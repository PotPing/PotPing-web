import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import StatusBadgeSelect from "../components/report/StatusBadgeSelect";
import { fetchPotholesBySession } from "../apis/potholeApi";

const SEVERITY_LABEL = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export default function ReportDetailAdmin() {
  const { id: reportId } = useParams(); 
  const routerLocation = useLocation();

  const sessionId = routerLocation.state?.sessionId; 
  const initialStatus = routerLocation.state?.processStatus || "PENDING";
  const initialRegion = routerLocation.state?.regionName || "";

  const [report, setReport] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 세션별 포트홀 조회
  useEffect(() => {
    if (!sessionId) {
      setError("세션 ID 정보가 없습니다. 목록 화면에서 다시 들어와 주세요.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const potholes = await fetchPotholesBySession(sessionId);
        if (!potholes || potholes.length === 0) {
          setError("이 세션에서 감지된 포트홀이 없습니다.");
          return;
        }

        const first = potholes[0]; 

        const mapped = {
          potholeId: first.id || first.potholeId, 
          reportId, 
          status: initialStatus,
          location: initialRegion || first.regionName || "",
          detectedAt: first.detectedAt,
          severity: first.severity,
          detectionCount: first.detectionCount,
          reliabilityAvg: first.reliabilityAvg,
          originalImageUrl: first.originalImageUrl,
          equalizedImageUrl: first.equalizedImageUrl,
        };

        setReport(mapped);
        setStatus(initialStatus);
      } catch (e) {
        console.error(e);
        setError("포트홀 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sessionId, initialStatus, initialRegion, reportId]);

  const handleChangeStatus = (nextStatus) => {
    setStatus(nextStatus);
    setReport((prev) => (prev ? { ...prev, status: nextStatus } : prev));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white">
        <HeaderUser />
        <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
          <p>로딩 중입니다...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white">
        <HeaderUser />
        <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
          <p className="text-red-400">{error}</p>
        </main>
      </div>
    );
  }

  if (!report) return null;

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
                포트홀 {report.potholeId}
              </h1>

              <div className="flex items-center gap-3">
                <StatusBadgeSelect
  reportId={report.reportId} 
  value={status}
  onChange={handleChangeStatus}
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
