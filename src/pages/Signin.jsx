import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderGuest from "../components/header/HeaderGuest";

const Signin = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const goSignup = () => navigate("/signup");

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      <HeaderGuest />
      <main className="flex-1 flex justify-center mt-20 px-4">
        <div className="w-full max-w-[490px] h-[368px] border-[1.5px] border-white rounded-xl px-12 pt-10">
          <h1 className="text-[32px] font-semibold text-center mb-8">로그인</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 */}
            <div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력해주세요"
                className="w-full h-11 px-3 rounded-md border border-white bg-transparent
                           text-sm text-white placeholder:text-[#BCBCBC] focus:outline-none
                           focus:border-[#F97316]"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="w-full h-11 px-3 rounded-md border border-white bg-transparent
                           text-sm text-white placeholder:text-[#BCBCBC] focus:outline-none
                           focus:border-[#F97316]"
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full h-11 mt-5 rounded-md bg-[#F97316] text-[16px] font-medium
                         hover:bg-[#ea580c] transition cursor-pointer"
            >
              로그인
            </button>
          </form>

          {/* 회원가입 이동 */}
          <div className="mt-1.5 text-center">
            <button
              type="button"
              onClick={goSignup}
              className="text-[12px] text-white underline-offset-2 hover:underline cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signin;
