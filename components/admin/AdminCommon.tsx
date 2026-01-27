import React, { useState, useEffect } from "react";
import { StyledText } from "../../types";
import { getDirectImageUrl } from "../../utils/urlHelper";

const FONT_SIZE_OPTIONS = [
  "0.6rem",
  "0.7rem",
  "0.8rem",
  "0.9rem",
  "1rem",
  "1.1rem",
  "1.2rem",
  "1.3rem",
  "1.5rem",
  "1.8rem",
  "2rem",
  "2.5rem",
  "3rem",
  "4rem",
  "5rem",
];

const FONT_FAMILY_OPTIONS = [
  "Pretendard",
  "Merriweather",
  "Montserrat",
  "Inter",
  "Roboto",
  "Noto Sans KR",
  "Nanum Gothic",
  "Playfair Display",
  "Lora",
  "Libre Baskerville",
  "Nanum Myeongjo",
  "Cinzel",
  "serif",
  "sans-serif",
  "monospace",
];

const LETTER_SPACING_OPTIONS = [
  "0px",
  "0.5px",
  "1px",
  "1.5px",
  "2px",
  "3px",
  "4px",
  "5px",
  "8px",
  "10px",
];

export const ImageGuide: React.FC = () => (
  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
    <h4 className="text-indigo-800 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
      <span className="w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">
        !
      </span>
      이미지 연결 가이드 (구글 드라이브 지원)
    </h4>
    <p className="text-indigo-700 text-[11px] leading-relaxed">
      1. <strong>구글 드라이브</strong>: '링크가 있는 모든 사용자'로 공유 설정을
      변경한 후, <strong>공유 링크를 그대로 붙여넣으세요.</strong> 시스템이
      고성능 캐시 주소로 자동 변환합니다.
      <br />
      2. <strong>이미지 호스팅</strong>: Imgur, ImgBB 등의{" "}
      <strong>직접 링크(끝이 .jpg, .png)</strong>를 입력해도 정상 작동합니다.
    </p>
  </div>
);

export const SpecGuide: React.FC<{ spec: string }> = ({ spec }) => (
  <p className="mt-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
    RECOMMENDED: {spec}
  </p>
);

export const ImagePreview: React.FC<{ url: string; label: string }> = ({
  url,
  label,
}) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [url]);
  if (!url) return null;
  const directUrl = getDirectImageUrl(url);
  const isTransformed = directUrl.includes("lh3.googleusercontent.com");
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
          {isTransformed
            ? "✨ 구글 드라이브 최적화 변환 완료"
            : "실시간 진단 피드백"}
        </span>
      </div>
      <div
        className={`flex items-center gap-4 p-2 rounded border transition-all ${error ? "bg-red-50 border-red-200" : "bg-slate-100 border-slate-200"}`}
      >
        {!error ? (
          <img
            src={directUrl}
            alt={label}
            className="h-14 w-auto object-contain border bg-white"
            onError={() => setError(true)}
          />
        ) : (
          <div className="h-14 flex items-center px-3 text-[10px] text-red-600 font-bold leading-tight bg-white border border-red-100 rounded">
            ⚠️ 이미지 불러오기 실패
          </div>
        )}
        <p className="text-[8px] text-slate-400 font-mono truncate flex-1">
          {directUrl}
        </p>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<{
  label: string;
  value: StyledText;
  onChange: (newValue: StyledText) => void;
  multiline?: boolean;
}> = ({ label, value, onChange, multiline = false }) => {
  const update = (field: keyof StyledText, val: any) =>
    onChange({ ...value, [field]: val });

  const handleUnitInput = (
    field: keyof StyledText,
    inputVal: string,
    defaultUnit: string,
  ) => {
    // 숫자만 입력했을 경우 기본 단위를 붙여줌
    let finalVal = inputVal;
    if (inputVal && !isNaN(Number(inputVal))) {
      finalVal = inputVal + defaultUnit;
    }
    update(field, finalVal);
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`fluid-${label}`}
            checked={!!value?.isFluid}
            onChange={(e) => update("isFluid", e.target.checked)}
            className="w-3 h-3 accent-indigo-600"
          />
          <label
            htmlFor={`fluid-${label}`}
            className="text-[10px] font-bold text-indigo-600 uppercase cursor-pointer"
          >
            가변 폰트(Fluid)
          </label>
        </div>
      </div>

      {multiline ? (
        <textarea
          className="w-full border border-slate-200 rounded-md p-3 h-24 text-sm font-sans focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          value={value.text}
          onChange={(e) => update("text", e.target.value)}
        />
      ) : (
        <input
          className="w-full border border-slate-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          value={value?.text}
          onChange={(e) => update("text", e.target.value)}
        />
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
        {/* 스타일 버튼 그룹 */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-md">
          {[
            { key: "isBold", label: "B", title: "Bold" },
            { key: "isItalic", label: "I", title: "Italic" },
            { key: "isUnderline", label: "U", title: "Underline" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              title={f.title}
              onClick={() => update(f.key as any, !(value as any)[f.key])}
              className={`w-8 h-8 flex items-center justify-center rounded transition-all text-xs font-bold ${
                (value as any)[f.key]
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 정렬 버튼 그룹 */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-md">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => update("textAlign", align)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-all text-[10px] font-bold ${
                value.textAlign === align
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
              }`}
            >
              {align[0].toUpperCase()}
            </button>
          ))}
        </div>

        {/* 색상 선택 */}
        <div className="relative group">
          <input
            type="color"
            className="w-10 h-10 p-0.5 border border-slate-200 rounded-md cursor-pointer bg-white overflow-hidden"
            value={value.color || "#000000"}
            onChange={(e) => update("color", e.target.value)}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-800 text-white text-[9px] px-2 py-1 rounded">
            Color
          </div>
        </div>
      </div>

      {/* 정밀 타이포그래피 제어 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-50">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex justify-between">
            <span>글꼴 (Font Family)</span>
          </label>
          <select
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs bg-slate-50 focus:border-indigo-500 outline-none"
            value={value.fontFamily || ""}
            onChange={(e) => update("fontFamily", e.target.value)}
          >
            <option value="">글꼴 선택</option>
            {FONT_FAMILY_OPTIONS.map((opt) => (
              <option key={opt} value={opt} style={{ fontFamily: opt }}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex justify-between">
            <span>글꼴 크기 (Font Size)</span>
            <span className="text-indigo-500 opacity-60">px/rem</span>
          </label>
          <div className="flex gap-2">
            <select
              className="flex-1 border border-slate-200 rounded-md px-2 py-2 text-xs bg-slate-50 focus:border-indigo-500 outline-none"
              value={
                FONT_SIZE_OPTIONS.includes(value.fontSize || "")
                  ? value.fontSize
                  : "custom"
              }
              onChange={(e) =>
                e.target.value !== "custom" &&
                update("fontSize", e.target.value)
              }
            >
              <option value="custom">직접 입력</option>
              {FONT_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="예: 1.5rem"
              className="w-24 border border-slate-200 rounded-md px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              value={value.fontSize || ""}
              onChange={(e) => update("fontSize", e.target.value)}
              onBlur={(e) => handleUnitInput("fontSize", e.target.value, "rem")}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex justify-between">
            <span>자간 (Letter Spacing)</span>
            <span className="text-indigo-500 opacity-60">px 명시</span>
          </label>
          <div className="flex gap-2">
            <select
              className="flex-1 border border-slate-200 rounded-md px-2 py-2 text-xs bg-slate-50 focus:border-indigo-500 outline-none"
              value={
                LETTER_SPACING_OPTIONS.includes(value.letterSpacing || "")
                  ? value.letterSpacing
                  : "custom"
              }
              onChange={(e) =>
                e.target.value !== "custom" &&
                update("letterSpacing", e.target.value)
              }
            >
              <option value="custom">직접 입력</option>
              {LETTER_SPACING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="예: 2px"
              className="w-24 border border-slate-200 rounded-md px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              value={value.letterSpacing || ""}
              onChange={(e) => update("letterSpacing", e.target.value)}
              onBlur={(e) =>
                handleUnitInput("letterSpacing", e.target.value, "px")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
