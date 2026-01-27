
import React from 'react';
import { AppConfig } from '../../../types';
import { ImageGuide, ImagePreview, SpecGuide } from '../AdminCommon';
import { getDirectImageUrl } from '../../../utils/urlHelper';

interface AdTabProps {
  config: AppConfig;
  onSetRoot: (newConfig: AppConfig) => void;
}

const AdTab: React.FC<AdTabProps> = ({ config, onSetRoot }) => {
  // 방어 코드: 중첩 객체가 undefined인 경우 기본값으로 대체
  const adSettings = config?.adSettings || { ads: [], adDuration: 5, displayMode: 'random' as const };
  const ads = adSettings.ads || [];

  const addAd = () => {
    onSetRoot({ ...config, adSettings: { ...adSettings, ads: [...ads, { id: `ad_${Date.now()}`, imageUrl: '', targetUrl: '' }] } });
  };

  const updateAd = (id: string, field: string, val: string) => {
    onSetRoot({ ...config, adSettings: { ...adSettings, ads: ads.map(a => a.id === id ? { ...a, [field]: val } : a) } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">광고 관리</h3>
        <button onClick={addAd} className="bg-[#B0925A] text-black px-4 py-1 rounded text-sm font-bold">+ 광고 추가</button>
      </div>

      <div className="p-5 bg-white border rounded space-y-4">
        <label className="block text-[10px] font-bold uppercase">노출 방식</label>
        <div className="flex bg-slate-100 p-1 rounded-md w-fit">
          {(['random', 'sequential'] as const).map(mode => (
            <button key={mode} onClick={() => onSetRoot({ ...config, adSettings: { ...adSettings, displayMode: mode } })} className={`px-4 py-1 text-[10px] font-bold rounded ${adSettings.displayMode === mode ? 'bg-[#B0925A] text-black' : 'text-slate-400'}`}>
              {mode === 'random' ? '랜덤' : '순차'}
            </button>
          ))}
        </div>
      </div>

      <ImageGuide />
      <div className="grid md:grid-cols-2 gap-6">
        {ads.map((ad, idx) => (
          <div key={ad.id} className="border rounded-lg bg-white overflow-hidden group relative p-4">
            <button onClick={() => onSetRoot({ ...config, adSettings: { ...adSettings, ads: ads.filter(a => a.id !== ad.id) } })} className="absolute top-2 right-2 text-red-500">✕</button>
            <img src={getDirectImageUrl(ad.imageUrl || '')} className="w-full h-32 object-contain bg-slate-100 rounded mb-2" />
            <input className="w-full text-[10px] border p-1 mb-2" placeholder="이미지 URL" value={ad.imageUrl || ''} onChange={e => updateAd(ad.id, 'imageUrl', e.target.value)} />
            <input className="w-full text-[10px] border p-1" placeholder="이동 링크" value={ad.targetUrl || ''} onChange={e => updateAd(ad.id, 'targetUrl', e.target.value)} />
            <SpecGuide spec="1064x742px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdTab;
