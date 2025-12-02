import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const HeaderGuest = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[66px] flex items-center justify-between bg-[#0B1120] pl-8 pr-16">
      {/* 로고 */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="로고" className="w-[130px] h-auto" />
      </div>

      {/* 로그인, 회원가입 */}
      <nav className="flex items-center gap-8 text-[12px]">
        <button
          onClick={() => navigate("/signin")}
          className="text-white font-medium cursor-pointer"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-4 py-2 rounded-md bg-[#FF6800] font-medium hover:bg-[#ea580c] cursor-pointer"
        >
          회원가입
        </button>
      </nav>
    </header>
  );
};

export default HeaderGuest;
