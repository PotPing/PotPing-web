import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import StatusBadge from "../components/report/StatusBadge";

import samplePothole from "../assets/pothole_sample.png";
import sampleHistogram from "../assets/pothole_histogram.png";
import { fetchPotholesBySession } from "../apis/potholeApi";

const SEVERITY_LABEL = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export default function ReportDetailUser() {
  const { id } = useParams();
  const routerLocation = useLocation();
  const sessionId = routerLocation.state?.sessionId;
  const processStatus = routerLocation.state?.processStatus;
  const initialStatus = processStatus === "DONE" ? "DONE" : "PENDING";
  const [badgeStatus] = useState(initialStatus); 

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 응답 매핑
  const mapResponseToReport = (reportId, sessionId, potholes) => {
    if (!potholes || potholes.length === 0) return null;

    const first = potholes[0];

    const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const highestSeverity = potholes.reduce((acc, cur) => {
      if (!acc) return cur;
      return severityOrder[cur.severity] > severityOrder[acc.severity]
        ? cur
        : acc;
    }).severity;

    const detectedAt =
      first.detectedAt?.replace("T", " ").slice(0, 19) ?? first.detectedAt;

    return {
      id: reportId,
      potholeId: first.potholeId,
      sessionId,
      potholeStatus: first.status,
      location: first.regionName,
      detectedAt,
      severity: highestSeverity,
      detectionCount: potholes.length,
      reliabilityAvg: null,
      originalImageUrl: first.originalImg || samplePothole,
      equalizedImageUrl: first.processedImg || sampleHistogram,
    };
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!sessionId) {
          setError("세션 정보가 없습니다. 목록에서 다시 접근해주세요.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const data = await fetchPotholesBySession(sessionId);
        const mapped = mapResponseToReport(id, sessionId, data);
        setReport(mapped);
      } catch (err) {
        console.error(err);
        setError("신고 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [sessionId, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white">
        <HeaderUser />
        <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
          <p>불러오는 중입니다...</p>
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

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white">
        <HeaderUser />
        <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
          <p>해당 세션에서 감지된 포트홀이 없습니다.</p>
        </main>
      </div>
    );
  }

  const {
    location,
    detectedAt,
    severity,
    detectionCount,
    reliabilityAvg,
    potholeId,
  } = report;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <HeaderUser />

      <main className="max-w-6xl mx-auto pt-10 px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-[36px] font-semibold text-[#F97316]">
                포트홀 {potholeId}
              </h1>
              <StatusBadge status={badgeStatus} />
            </div>

            <div className="w-full max-w-[640px] rounded-xl overflow-hidden bg-black/40 border border-white/5">
              <img
                src={report.originalImageUrl}
                alt="포트홀 원본 이미지"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* 오른쪽 */}
          <section className="flex-1 space-y-4 text-md mt-16 ml-2">
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
            <InfoRow
              label="신뢰도 평균"
              value={reliabilityAvg != null ? `${reliabilityAvg}%` : "-"}
            />

            {/* 평활화 이미지 */}
            <div className="flex items-start gap-6 pt-4">
              <span className="w-24 text-gray-400 mt-2">평활화 이미지</span>
              <div className="w-full max-w-[360px] aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
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
      <span className="text-sm">{value ?? "-"}</span>
    </div>
  );
}
