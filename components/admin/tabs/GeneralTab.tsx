import React from "react";
import { AppConfig, StyledText } from "../../../types";
import { RichTextEditor } from "../AdminCommon";

interface GeneralTabProps {
  config: AppConfig;
  onUpdate: (
    section: keyof AppConfig,
    field: string,
    value: StyledText,
  ) => void;
  onSetRoot: (newConfig: AppConfig) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  config,
  onUpdate,
  onSetRoot,
}) => {
  // 방어 코드: 중첩 객체가 undefined인 경우 빈 객체로 대체
  const heroSection = config?.heroSection || {};
  const footer = config?.footer || {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">기본 정보 설정</h3>

      {/* 1. 최상단 서브 제목 (Hero Subtitle) */}
      <RichTextEditor
        label="최상단 서브 제목 (Subtitle)"
        value={heroSection.subtitle}
        onChange={(v) => onUpdate("heroSection", "subtitle", v)}
      />

      {/* 2. 메인 제목 (Hero Main Title) */}
      <RichTextEditor
        label="메인 제목 (Main Title)"
        multiline
        value={heroSection.title}
        onChange={(v) => onUpdate("heroSection", "title", v)}
      />

      {/* 3. 메인 부제목 (Hero Main Subtitle) */}
      <RichTextEditor
        label="메인 부제목 (Main Subtitle)"
        value={heroSection.mainSubtitle}
        onChange={(v) => onUpdate("heroSection", "mainSubtitle", v)}
      />

      {/* 4. 날짜 및 장소 (Hero Date & Place) */}
      <RichTextEditor
        label="날짜 및 장소 (Date & Place)"
        value={heroSection.datePlace}
        onChange={(v) => onUpdate("heroSection", "datePlace", v)}
      />

      {/* 5. 프로그램 섹션 제목 (Program Section Title) */}
      <RichTextEditor
        label="프로그램 섹션 제목"
        value={config?.programTitle}
        onChange={(v) => onSetRoot({ ...config, programTitle: v })}
      />

      {/* 6. 푸터 슬로건 (Footer Slogan) */}
      <RichTextEditor
        label="푸터 슬로건 (Slogan)"
        value={footer.text}
        onChange={(v) => onUpdate("footer", "text", v)}
      />

      {/* 7. 푸터 카피라이트 (Footer Copyright) */}
      <RichTextEditor
        label="푸터 카피라이트 (Copyright)"
        multiline
        value={footer.copyright}
        onChange={(v) => onUpdate("footer", "copyright", v)}
      />
    </div>
  );
};

export default GeneralTab;
