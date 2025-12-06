import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../components/header/HeaderUser";
import { fetchRegions } from "../apis/regionApi";
import { startSession, endSession } from "../apis/sessionApi";
import { fetchPotholesBySession } from "../apis/potholeApi";

export default function Report() {
  const navigate = useNavigate();

  // 지역 상태
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [regionError, setRegionError] = useState("");

  // 주행 상태 & 결과
  const [isDriving, setIsDriving] = useState(false);
  const [isFetchingResult, setIsFetchingResult] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 발급받은 세션 ID
  const [sessionId, setSessionId] = useState(null);

  // 시/도 이름
  const selectedProvinceName = useMemo(
    () => provinces.find((p) => p.id === selectedProvinceId)?.name || "",
    [provinces, selectedProvinceId]
  );

  // 시/군/구 이름
  const selectedCityName = useMemo(
    () => cities.find((c) => c.id === selectedCityId)?.name || "",
    [cities, selectedCityId]
  );

  // 시/도 목록 조회
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setRegionError("");
        const data = await fetchRegions(); // parentId 없이 호출 -> 시/도 목록
        setProvinces(data);

        if (data.length > 0) {
          setSelectedProvinceId(data[0].id); // 첫 번째 시/도 기본 선택
        }
      } catch (e) {
        console.error(e);
        setRegionError("지역 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadProvinces();
  }, []);

  // 시/군/구 목록 조회 (선택된 시/도 기준)
  useEffect(() => {
    const loadCities = async () => {
      if (selectedProvinceId == null) return;

      try {
        setRegionError("");
        const data = await fetchRegions(selectedProvinceId); // 선택된 시/도의 하위 시/군/구
        setCities(data);

        if (data.length > 0) {
          setSelectedCityId(data[0].id); // 첫 번째 시/군/구 기본 선택
        } else {
          setSelectedCityId(null);
        }
      } catch (e) {
        console.error(e);
        setRegionError("시/군/구 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadCities();
  }, [selectedProvinceId]);

  const handleProvinceChange = (e) => {
    const nextId = e.target.value === "" ? null : Number(e.target.value);
    setSelectedProvinceId(nextId);
  };

  const handleCityChange = (e) => {
    const nextId = e.target.value === "" ? null : Number(e.target.value);
    setSelectedCityId(nextId);
  };

  // 주행 시작
  const handleStartDriving = async () => {
    try {
      setErrorMessage("");
      setHasResult(false);
      setResult(null);

      if (!selectedProvinceId || !selectedCityId) {
        setErrorMessage("지역을 먼저 선택해주세요.");
        return;
      }

      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        setErrorMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 세션 시작 API 호출
      const newSessionId = await startSession({
        userId,
        regionId: selectedCityId,
      });

      setSessionId(newSessionId);
      setIsDriving(true);
      console.log("세션 시작, ID:", newSessionId);
    } catch (err) {
      console.error(err);
      setErrorMessage("주행 시작 요청 중 오류가 발생했습니다.");
      setIsDriving(false);
      setSessionId(null);
    }
  };

  // 주행 종료 + 결과 조회
  const handleStopDriving = async () => {
    try {
      setErrorMessage("");
      setIsDriving(false);
      setIsFetchingResult(true);

      if (!selectedProvinceId || !selectedCityId) {
        setErrorMessage("지역을 먼저 선택해주세요.");
        setIsFetchingResult(false);
        return;
      }

      if (!sessionId) {
        setErrorMessage("진행 중인 주행 세션이 없습니다.");
        setIsFetchingResult(false);
        return;
      }

      // 세션 종료 API 호출
      const message = await endSession(sessionId);
      console.log("세션 종료:", message);

      // 세션별 포트홀 목록 조회
      const potholes = await fetchPotholesBySession(sessionId);
      const potholeCount = Array.isArray(potholes) ? potholes.length : 0;

      // 분석 시각: 마지막 포트홀 감지 시각 or 지금 시각
      const detectedAt =
        potholeCount > 0 && potholes[potholeCount - 1].detectedAt
          ? new Date(potholes[potholeCount - 1].detectedAt).toLocaleString(
              "ko-KR"
            )
          : new Date().toLocaleString("ko-KR");

      setResult({
        province: selectedProvinceName,
        city: selectedCityName,
        detectedAt,
        message,
        potholeCount,
      });
      setHasResult(true);
      setSessionId(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("결과 조회 중 오류가 발생했습니다.");
    } finally {
      setIsFetchingResult(false);
    }
  };

  // 초기화 버튼
  const handleReset = () => {
    setIsDriving(false);
    setIsFetchingResult(false);
    setHasResult(false);
    setResult(null);
    setErrorMessage("");
    setSessionId(null);
  };

  // 신고 내역 바로가기
  const handleGoReportHistory = () => {
    navigate("/my-reports");
  };

  const cityOptions = cities;

  // === 분석 상태 판별 ===
  const hasPotholeCount =
    result && typeof result.potholeCount === "number";

  const isPotholeDetected =
    hasPotholeCount && result.potholeCount > 0; // 분석 완료 + 포트홀 있음

  const isAnalyzedNoPothole =
    hasPotholeCount && result.potholeCount === 0; // 분석 완료 + 포트홀 0개

  const isAnalysisPending = result && !hasPotholeCount; // (백업용) 결과 객체만 있고 개수는 없는 경우

  // 버튼 비활성화 조건
  const isStartDisabled = isDriving || isFetchingResult || hasResult;
  const isStopDisabled = !isDriving || isFetchingResult || hasResult;

  return (
    <div className="min-h-screen bg-[#0B1320] text-white">
      {/* 상단 헤더 */}
      <HeaderUser />

      {/* 메인 콘텐츠 */}
      <main className="max-w-[960px] mx-auto pt-12 pb-16 px-6">
        {/* 안내 문구 */}
        <p className="text-center text-[20px] leading-relaxed">
          지역 선택 후{" "}
          <span className="text-orange-400 font-semibold">주행 시작</span>{" "}
          버튼을 눌러 로컬에서 영상을 재생하고,{" "}
          <span className="text-orange-400 font-semibold">주행 종료</span>{" "}
          버튼을 눌러 결과를 확인하세요!
        </p>

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mt-6 text-center text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* 지역 관련 에러 */}
        {regionError && (
          <div className="mt-3 text-center text-sm text-red-400">
            {regionError}
          </div>
        )}

        {/* 지역 선택 + 버튼 영역 */}
        <div className="mt-10 flex flex-col gap-6">
          {/* 지역 선택 드롭다운 */}
          <div className="flex justify-center gap-4 flex-wrap">
            {/* 시/도 선택 */}
            <div className="w-[220px]">
              <label className="block mb-2 text-sm text-gray-300">
                시 / 도
              </label>
              <div className="relative">
                <select
                  value={selectedProvinceId ?? ""}
                  onChange={handleProvinceChange}
                  disabled={isDriving || isFetchingResult || hasResult}
                  className={`w-full h-11 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none ${
                    isDriving || isFetchingResult || hasResult
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs cursor-pointer">
                  <IoIosArrowDown size={20} />
                </span>
              </div>
            </div>

            {/* 시/군/구 선택 */}
            <div className="w-[220px]">
              <label className="block mb-2 text-sm text-gray-300">
                시 / 군 / 구
              </label>
              <div className="relative">
                <select
                  value={selectedCityId ?? ""}
                  onChange={handleCityChange}
                  disabled={isDriving || isFetchingResult || hasResult}
                  className={`w-full h-11 bg-[#111827] border border-[#4B5563] rounded-md px-4 pr-9 text-sm text-white appearance-none focus:outline-none ${
                    isDriving || isFetchingResult || hasResult
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {cityOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs ">
                  <IoIosArrowDown size={20} />
                </span>
              </div>
            </div>
          </div>

          {/* 주행 시작 / 종료 버튼 */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={handleStartDriving}
              disabled={isStartDisabled}
              className={`min-w-[140px] h-11 rounded-md text-sm font-semibold transition ${
                isStartDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              }`}
            >
              주행 시작
            </button>

            <button
              type="button"
              onClick={handleStopDriving}
              disabled={isStopDisabled}
              className={`min-w-[140px] h-11 rounded-md text-sm font-semibold transition ${
                isStopDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              }`}
            >
              주행 종료
            </button>
          </div>

          {/* 상태 */}
          <div className="text-center text-sm text-gray-300">
            상태:{" "}
            {isFetchingResult ? (
              <span className="text-sky-400 font-semibold">
                결과를 불러오는 중입니다...
              </span>
            ) : isDriving ? (
              <span className="text-green-400 font-semibold">
                주행 중입니다. 결과를 기다려주세요...
              </span>
            ) : hasResult ? (
              <span className="text-sky-400 font-semibold">
                분석이 완료되었습니다.
              </span>
            ) : (
              <span className="text-gray-400">대기 중입니다.</span>
            )}
          </div>
        </div>

        {/* 결과 영역 */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">주행 결과</h2>

          {!hasResult || !result ? (
            // 아직 주행 종료 전 (아무 결과 없음)
            <div className="w-full rounded-xl border border-dashed border-gray-600 bg-[#020617]/40 px-6 py-8 text-center text-sm text-gray-400">
              아직 분석 결과가 없습니다.{" "}
              <span className="text-orange-400 font-semibold">
                주행을 시작하고 종료
              </span>
              하면 선택한 구간의 포트홀 분석 결과가 표시됩니다.
            </div>
          ) : (
            <>
              {isPotholeDetected && (
                // 분석 완료 + 포트홀 감지됨
                <div className="w-full rounded-xl border border-dashed border-gray-600 bg-[#020617]/40 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 min-w-[220px] text-center md:text-left">
                    <p className="text-[18px] font-semibold text-orange-400 leading-relaxed">
                      분석 결과, 해당 구간에서 포트홀이 감지되었습니다.
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      분석 구간:{" "}
                      <span className="font-semibold text-white">
                        {result.province} {result.city}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      분석 시각: {result.detectedAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoReportHistory}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-orange-400 text-sm font-medium text-orange-200 hover:bg-orange-500/10 hover:border-orange-300 transition cursor-pointer"
                  >
                    <span>신고 내역 바로가기</span>
                    <IoChevronForward size={18} />
                  </button>
                </div>
              )}

              {isAnalyzedNoPothole && (
                // 분석 완료 + 포트홀 0개
                <div className="w-full rounded-xl border border-dashed border-gray-600 bg-[#020617]/40 px-6 py-8 text-center">
                  <p className="text-[18px] font-semibold text-sky-300">
                    분석 결과, 포트홀이 감지되지 않았습니다.
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    선택한 구간에서 신고할 포트홀이 발견되지 않았습니다.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    분석 시각: {result.detectedAt}
                  </p>
                </div>
              )}

              {isAnalysisPending && (
                // 주행 종료는 했지만 개수가 없는 경우
                <div className="w-full rounded-xl border border-dashed border-gray-600 bg-[#020617]/40 px-6 py-8 text-center">
                  <p className="text-[18px] font-semibold text-sky-300">
                    주행이 정상적으로 종료되었습니다.
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    포트홀 분석 결과를 불러오는 중입니다.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    종료 시각: {result.detectedAt}
                  </p>
                </div>
              )}

              {/* 초기화 버튼 */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-w-[140px] h-10 px-6 rounded-md border border-gray-400 text-sm text-gray-100 hover:bg-gray-700 transition cursor-pointer"
                >
                  초기화
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
