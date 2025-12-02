import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderGuest from "../components/header/HeaderGuest";
import userIcon from "../assets/user.png";
import adminIcon from "../assets/admin.png";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(null); // USER, ADMIN, null
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 API 연동 해야함
    console.log({ role, userId, password, passwordCheck });
  };

  const handleCheckDuplicate = () => {
    // 아이디 중복 확인 API 연동 해야함
    console.log("아이디 중복 확인:", userId);
  };

  const goLogin = () => navigate("/signin");

  const baseRoleCard =
    "flex flex-col items-center justify-center w-[186px] h-[105px] rounded-md border cursor-pointer transition";

  const activeStyle =
    "border-[#f97316] bg-[#f97316]/10 text-[#f97316] shadow-[0_0_0_1px_rgba(249,115,22,0.5)]";
  const inactiveStyle = "border-white bg-transparent";

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      <HeaderGuest />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[490px] border-[1.5px] border-white rounded-xl px-12 pt-8 pb-6">
          {/* 제목 */}
          <h1 className="text-[32px] font-semibold text-center mb-6">
            회원가입
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 역할 선택 */}
            <div>
              <label className="block text-sm mb-2">
                당신은? <span className="text-[#f97316]">*</span>
              </label>

              <div className="flex gap-4">
                {/* 사용자 카드 */}
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={`${baseRoleCard} ${
                    role === "USER" ? activeStyle : inactiveStyle
                  }`}
                >
                  <img src={userIcon} alt="사용자" className="w-10 h-10 mb-2" />
                  <div className="text-sm font-semibold">사용자</div>
                  <div className="text-[11px] text-[#949494]">포트홀 신고</div>
                </button>

                {/* 관리자 카드 */}
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`${baseRoleCard} ${
                    role === "ADMIN" ? activeStyle : inactiveStyle
                  }`}
                >
                  <img
                    src={adminIcon}
                    alt="관리자"
                    className="w-10 h-10 mb-1 mt-2"
                  />
                  <div className="text-sm font-semibold">관리자</div>
                  <div className="text-[11px] text-[#949494]">
                    신고 내역 관리
                  </div>
                </button>
              </div>
            </div>

            {/* 아이디 입력 */}
            <div className="space-y-2">
              <label className="block text-sm">
                아이디 <span className="text-[#f97316]">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디를 입력해주세요"
                  className="flex-1 h-11 px-3 rounded-md border border-white bg-transparent
                             text-sm text-white placeholder:text-[#BCBCBC] focus:outline-none
                             focus:border-[#f97316]"
                />
                <button
                  type="button"
                  onClick={handleCheckDuplicate}
                  className="w-24 h-11 rounded-md bg-[#151F38] text-sm font-medium
                             hover:bg-[#192543] cursor-pointer"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="block text-sm">
                비밀번호 <span className="text-[#f97316]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="영문자, 숫자 포함 8~12자"
                className="w-full h-11 px-3 rounded-md border border-white bg-transparent
                           text-sm text-white placeholder:text-[#BCBCBC] focus:outline-none
                           focus:border-[#f97316]"
              />
              <input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호를 확인해주세요"
                className="w-full h-11 px-3 rounded-md border border-white bg-transparent
                           text-sm text-white placeholder:text-[#BCBCBC] focus:outline-none
                           focus:border-[#f97316]"
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full h-11 mt-3 rounded-md bg-[#f97316] text-[16px] font-medium
                         hover:bg-[#ea580c] cursor-pointer"
            >
              회원가입
            </button>

            {/* 로그인 이동 */}
            <div className="text-center text-xs text-gray-300">
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                onClick={goLogin}
                className="text-[#f97316] hover:underline underline-offset-2 cursor-pointer"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
