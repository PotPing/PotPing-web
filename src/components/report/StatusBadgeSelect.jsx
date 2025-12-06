import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { completeReport } from "../../apis/reportApi";

const STATUS_LABEL = {
  PENDING: "대기중",
  DONE: "완료",       
};

const STATUS_STYLE = {
  PENDING: "bg-[#F97316]/10 text-[#FDBA74] border border-[#FDBA74]/40",
  DONE: "bg-[#22C55E]/10 text-[#A7F3D0] border border-[#A7F3D0]/40",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "대기중" },
  { value: "DONE", label: "완료" },  
];

export default function StatusBadgeSelect({
  value,
  onChange,
  disabled,
  reportId, // 신고 ID
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCompleted = value === "DONE";

  const current = STATUS_OPTIONS.find((opt) => opt.value === value);
  const label = current?.label ?? STATUS_LABEL.PENDING;
  const style = STATUS_STYLE[value] ?? STATUS_STYLE.PENDING;

  const handleSelect = async (val) => {
    setOpen(false);
    if (val === value) return;

    if (val === "DONE" && reportId) {   
      try {
        setLoading(true);
        await completeReport(reportId);

        onChange && onChange(val);
        alert("보수 완료 처리되었습니다.");
      } catch (e) {
        console.error(e);
        alert("보수 완료 처리에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    } else {
      onChange && onChange(val);
    }
  };

  return (
    <div className="relative inline-block">
      {/* 상태 뱃지 */}
      <button
        type="button"
        disabled={disabled || loading || isCompleted}
        onClick={() => {
          if (isCompleted) return;
          setOpen((prev) => !prev);
        }}
        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium ${style} ${
          disabled || loading || isCompleted
            ? "opacity-60 cursor-not-allowed"
            : ""
        }`}
      >
        <span>{label}</span>
        {!isCompleted && <IoIosArrowDown className="ml-2 text-[14px]" />}
      </button>

      {/* 드롭다운 메뉴 */}
      {open && !loading && !isCompleted && (
        <div className="absolute right-0 mt-2 w-[120px] bg-[#0F172A] text-sm text-gray-100 rounded-md shadow-lg border border-white/10 z-20">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 hover:bg-white/10 ${
                opt.value === value ? "text-[#F97316] font-semibold" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
