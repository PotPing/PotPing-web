import React from "react";
import HeaderGuest from "../components/header/HeaderGuest";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      <HeaderGuest />
      <main className="pt-20 pl-48">
        <section className="px-16">
          <h1 className="text-[48px] leading-tight font-bold mb-4">
            주행 영상 만으로
            <br />
            <span className="text-[#F97316]">포트홀 신고</span>를
            <br />
            자동으로.
          </h1>

          <p className="text-[18px] text-[#C0C0C0] leading-relaxed mb-7">
            YOLO 기반 객체 탐지를 이용해 도로 위 포트홀을 자동 감지하고
            <br />
            클릭 한 번으로 신고까지 이어주는 서비스입니다.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/report")}
              className="w-[182px] h-[52px] rounded-md text-[#FF6800] border-2 border-[#FF6800] bg-transparent font-medium text-[18px]
                         hover:bg-[#FF6800]/5 cursor-pointer"
            >
              신고하러 가기
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="w-[182px] h-[52px] rounded-md border-2 border-white text-sm font-medium text-white text-[18px]
                         hover:bg-white/5 cursor-pointer"
            >
              관리하러 가기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
