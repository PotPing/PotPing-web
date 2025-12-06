import React from "react";

const STATUS_LABEL = {
  PENDING: "대기중",
  DONE: "완료", 
};

const STATUS_STYLE = {
  PENDING: "bg-[#F97316]/10 text-[#FDBA74] border border-[#FDBA74]/40",
  DONE: "bg-[#22C55E]/10 text-[#A7F3D0] border border-[#A7F3D0]/40", 
};

export default function StatusBadge({ status }) {
  const label = STATUS_LABEL[status] ?? "대기중";
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.PENDING;

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium ${style}`}
    >
      {label}
    </span>
  );
}
