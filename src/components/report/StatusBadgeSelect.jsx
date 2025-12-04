import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const STATUS_LABEL = {
  PENDING: "대기중",
  IN_PROGRESS: "처리중",
  COMPLETED: "완료",
};

const STATUS_STYLE = {
  PENDING: "bg-[#F97316]/10 text-[#FDBA74] border border-[#FDBA74]/40",
  IN_PROGRESS: "bg-[#3B82F6]/10 text-[#93C5FD] border border-[#93C5FD]/40",
  COMPLETED: "bg-[#22C55E]/10 text-[#A7F3D0] border border-[#A7F3D0]/40",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "대기중" },
  { value: "IN_PROGRESS", label: "처리중" },
  { value: "COMPLETED", label: "완료" },
];

export default function StatusBadgeSelect({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);

  const current = STATUS_OPTIONS.find((opt) => opt.value === value);
  const label = current?.label ?? STATUS_LABEL.PENDING;
  const style = STATUS_STYLE[value] ?? STATUS_STYLE.PENDING;

  const handleSelect = (val) => {
    setOpen(false);
    if (val !== value && onChange) onChange(val);
  };

  return (
    <div className="relative inline-block">
      {/* 뱃지 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium ${style}`}
      >
        <span>{label}</span>
        <IoIosArrowDown className="ml-2 text-[14px]" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
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
