import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function HeaderUser() {
  const navigate = useNavigate();

  const goMyPage = () => navigate("/mypage");

  const logout = () => {
    // 로그아웃 API 연동 해야함
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  return (
    <header className="w-full h-[66px] flex items-center justify-between bg-[#0B1120] pl-8 pr-16">
      {/* 로고 */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="로고" className="w-[130px] h-auto" />
      </div>

      {/* 로그아웃, 프로필 */}
      <div className="flex items-center gap-8 text-[12px]">
        <button
          onClick={logout}
          className="px-4 py-2 rounded-md bg-[#FF6800] font-medium hover:bg-[#ea580c] cursor-pointer"
        >
          로그아웃
        </button>
        <FaUserCircle
          onClick={goMyPage}
          size={28}
          className="text-white cursor-pointer"
        />
      </div>
    </header>
  );
}
