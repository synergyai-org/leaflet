import React from 'react';

import { StyledText } from '../../types';

interface RenderStyledProps {
  data: StyledText;
  defaultColor?: string;
  className?: string;
  fontSize?: string;
  isFluid?: boolean; // 수동 오버라이드 가능
}

const RenderStyled: React.FC<RenderStyledProps> = ({
  data,
  defaultColor,
  className,
  fontSize,
  isFluid,
}) => {
  // 부모 컴포넌트에서 명시적으로 false를 주면 데이터 설정을 무시함
  const applyFluid = isFluid ?? data.isFluid;

  // 가변 폰트 계산 로직 (1920px 기준 선형 스케일링)
  const getFluidSize = (baseSize: string) => {
    if (!applyFluid || !baseSize || baseSize === 'inherit') return baseSize;

    const match = baseSize.match(/^([\d.]+)([a-z%]+)$/);
    if (!match) return baseSize;

    const val = parseFloat(match[1]);
    const unit = match[2];

    // 픽셀 단위로 환산 (rem 기준 16px 가정)
    let pxVal = val;
    if (unit === 'rem') pxVal = val * 16;
    else if (unit === 'em') pxVal = val * 16;

    // 1920px 해상도에서의 vw 값 계산 (이 비율을 유지해야 라인 수가 보존됨)
    const vwVal = (pxVal / 1920) * 100;

    /**
     * [라인 수 유지를 위한 최적화]
     * 모바일(약 390px)은 PC(1920px)의 약 20% 수준입니다.
     * 따라서 최소 크기가 원래의 25% 이하로 떨어질 수 있어야 줄바꿈이 추가로 발생하지 않습니다.
     */
    const minPx = Math.max(pxVal * 0.25, 9); // 최소 9px 보장

    // clamp(최소, 가변비율, 최대)
    return `clamp(${minPx.toFixed(2)}px, ${vwVal.toFixed(3)}vw, ${pxVal}px)`;
  };

  const finalFontSize = fontSize || data.fontSize;

  // Optical Sizing: 폰트 크기에 따른 자간 미세 조정
  const getOpticalLetterSpacing = () => {
    if (data.letterSpacing && data.letterSpacing !== 'inherit')
      return data.letterSpacing;
    if (!finalFontSize) return 'inherit';

    const match = finalFontSize.match(/^([\d.]+)([a-z%]+)$/);
    if (!match) return 'inherit';

    const val = parseFloat(match[1]);
    const unit = match[2];
    let pxVal = val;
    if (unit === 'rem') pxVal = val * 16;

    if (pxVal >= 32) return '-0.025em'; // 큰 제목은 더 촘촘하게
    if (pxVal <= 14) return '0.05em';
    return 'inherit';
  };

  const styles: React.CSSProperties = {
    color: data.color || defaultColor,
    fontWeight: data.isBold ? 'bold' : 'normal',
    fontStyle: data.isItalic ? 'italic' : 'normal',
    textDecoration: data.isUnderline ? 'underline' : 'none',
    fontSize: getFluidSize(finalFontSize || 'inherit'),
    letterSpacing: getOpticalLetterSpacing(),
    fontFamily: data.fontFamily || 'inherit',
    textAlign: data.textAlign || 'inherit',
    display: data.textAlign ? 'block' : 'inline-block',
    width: data.textAlign ? '100%' : 'auto',
    lineHeight: '1.4', // 가독성을 위해 리스트 텍스트는 약간 더 넓은 여백 제공
    wordBreak: 'keep-all', // 단어 단위 끊김 방지
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-line',
  };

  return (
    <span style={styles} className={className}>
      {data.text}
    </span>
  );
};

export default RenderStyled;
