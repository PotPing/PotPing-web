import React from "react";

const STATUS_MAP = {
  NEW: {
    label: "대기중",
    className: "border border-[#FF7A00] text-[#FF7A00] bg-transparent",
  },
  IN_PROGRESS: {
    label: "처리중",
    className: "bg-white text-[#FF7A00]",
  },
  DONE: {
    label: "완료됨",
    className: "bg-[#FF7A00] text-white",
  },
};

export default function ReportCard({ date, title, status = "NEW", onClick }) {
  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP.NEW;

  return (
    <div
      className="w-full rounded-md bg-[#141c2e] px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-[#141c2e]/70 transition-colors"
      onClick={onClick}
    >
      {/* 왼쪽 영역 */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] text-[#9CA3AF]">{date}</span>
        <span className="text-sm md:text-base text-white">{title}</span>
      </div>

      {/* 상태 배지 */}
      <span
        className={
          "inline-flex items-center justify-center px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold " +
          statusInfo.className
        }
      >
        {statusInfo.label}
      </span>
    </div>
  );
}
