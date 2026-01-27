
import React from 'react';
import { AppConfig } from '../../../types';
import { ImageGuide, ImagePreview, SpecGuide } from '../AdminCommon';
import { getDirectImageUrl } from '../../../utils/urlHelper';

interface DesignTabProps {
  config: AppConfig;
  onSetRoot: (newConfig: AppConfig) => void;
}

const DesignTab: React.FC<DesignTabProps> = ({ config, onSetRoot }) => {
  // 방어 코드: 중첩 객체가 undefined인 경우 빈 객체로 대체
  const globalTheme = config?.globalTheme || {};
  const logos = config?.logos || {};
  const backgrounds = config?.backgrounds || {};

  const updateTheme = (field: string, val: any) => onSetRoot({ ...config, globalTheme: { ...globalTheme, [field]: val } });
  const updateLogos = (field: string, val: any) => onSetRoot({ ...config, logos: { ...logos, [field]: val } });
  const updateBg = (field: string, val: any) => onSetRoot({ ...config, backgrounds: { ...backgrounds, [field]: val } });

  const brightness = backgrounds.heroBgBrightness ?? 0.5;
  const contrast = backgrounds.heroBgContrast ?? 1.1;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">디자인 및 테마 설정</h3>
      <div className="grid grid-cols-2 gap-4 border-b pb-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">강조 색상 (Accent Color)</label>
          </div>
          <input type="color" className="w-full h-10 rounded cursor-pointer" value={globalTheme.accentColor || '#B0925A'} onChange={e => updateTheme('accentColor', e.target.value)} />
          <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tight">* 테두리, 구분선, 버튼 등 UI 장식용</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">배경 색상 (Bg Color)</label>
          <input type="color" className="w-full h-10 rounded cursor-pointer" value={globalTheme.bgColor || '#0A0A0A'} onChange={e => updateTheme('bgColor', e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-4 border-b pb-6">
        <h4 className="font-bold">로고 설정</h4>
        <ImageGuide />
        <div className="flex items-center gap-3 mb-4 p-3 bg-yellow-50 rounded border border-yellow-100">
          <input type="checkbox" id="applyFilter" checked={logos.applyFilter || false} onChange={e => updateLogos('applyFilter', e.target.checked)} />
          <label htmlFor="applyFilter" className="text-xs font-bold text-yellow-800">로고 금색 필터 적용 (On/Off)</label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 border rounded bg-white">
            <label className="block text-[10px] font-bold mb-1 uppercase">왼쪽 로고 주소</label>
            <input className="w-full border rounded p-2 text-xs font-mono mb-2" value={logos.leftLogo || ''} onChange={e => updateLogos('leftLogo', e.target.value)} />
            <label className="block text-[10px] font-bold mb-1 uppercase text-indigo-600">클릭 이동 링크</label>
            <input className="w-full border border-indigo-200 rounded p-2 text-xs font-mono" value={logos.leftLink || ''} onChange={e => updateLogos('leftLink', e.target.value)} />
            <SpecGuide spec="600px+ Width, Transparent PNG" />
            <ImagePreview url={logos.leftLogo || ''} label="Left Logo" />
          </div>
          <div className="p-3 border rounded bg-white">
            <label className="block text-[10px] font-bold mb-1 uppercase">오른쪽 로고 주소</label>
            <input className="w-full border rounded p-2 text-xs font-mono mb-2" value={logos.rightLogo || ''} onChange={e => updateLogos('rightLogo', e.target.value)} />
            <label className="block text-[10px] font-bold mb-1 uppercase text-indigo-600">클릭 이동 링크</label>
            <input className="w-full border border-indigo-200 rounded p-2 text-xs font-mono" value={logos.rightLink || ''} onChange={e => updateLogos('rightLink', e.target.value)} />
            <SpecGuide spec="600px+ Width, Transparent PNG" />
            <ImagePreview url={logos.rightLogo || ''} label="Right Logo" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold">배경 이미지 설정</h4>
        <div className="p-4 border rounded bg-white space-y-4">
          <label className="block text-[10px] font-bold mb-1 uppercase">메인 배경 (Hero Bg)</label>
          <input className="w-full border rounded p-2 text-xs font-mono" placeholder="Hero Bg URL" value={backgrounds.heroBg || ''} onChange={e => updateBg('heroBg', e.target.value)} />

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">밝기 (Brightness)</label>
                <span className="text-[10px] font-bold text-indigo-600">{Math.round(brightness * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={brightness} onChange={e => updateBg('heroBgBrightness', parseFloat(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">대비 (Contrast)</label>
                <span className="text-[10px] font-bold text-indigo-600">{Math.round(contrast * 100)}%</span>
              </div>
              <input type="range" min="0.5" max="2" step="0.05" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={contrast} onChange={e => updateBg('heroBgContrast', parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="mt-4">
             <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter block mb-2">실시간 필터 적용 미리보기</span>
             <div className="w-full h-32 rounded border bg-slate-900 overflow-hidden relative">
                {backgrounds.heroBg ? (
                   <img
                    src={getDirectImageUrl(backgrounds.heroBg)}
                    className="w-full h-full object-cover"
                    style={{ filter: `brightness(${brightness}) contrast(${contrast})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">이미지 없음</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTab;
