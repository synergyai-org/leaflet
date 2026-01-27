
import React, { useState, useEffect, useMemo } from 'react';
import { AdSettings, AdItem } from '../types';
import { getDirectImageUrl } from '../utils/urlHelper';

interface AdModalProps {
  settings: AdSettings;
  bgColor: string;
  onComplete: () => void;
  onCancel: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ settings, bgColor, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(settings.adDuration);
  
  const selectedAd = useMemo(() => {
    if (!settings.ads || settings.ads.length === 0) return null;

    if (settings.displayMode === 'sequential') {
      const storageKey = 'last_ad_index';
      const lastIndexStr = localStorage.getItem(storageKey);
      let nextIndex = 0;
      
      if (lastIndexStr !== null) {
        const lastIndex = parseInt(lastIndexStr, 10);
        nextIndex = (lastIndex + 1) % settings.ads.length;
      }
      
      localStorage.setItem(storageKey, nextIndex.toString());
      return settings.ads[nextIndex];
    } else {
      // Default to Random
      const randomIndex = Math.floor(Math.random() * settings.ads.length);
      return settings.ads[randomIndex];
    }
  }, [settings.ads, settings.displayMode]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const handleAdClick = () => {
    if (selectedAd) {
      window.open(selectedAd.targetUrl, '_blank');
    }
  };

  if (!selectedAd) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-4xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
        style={{ backgroundColor: bgColor }}
      >
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 z-50 text-[10px] tracking-[2px] text-white/40 hover:text-[#B0925A] transition-colors uppercase"
        >
          Close [X]
        </button>

        <div className="pt-10 pb-4 text-center">
           <h4 className="font-['Merriweather'] text-[#B0925A] text-sm tracking-[2px] font-light">SESSION DETAILS</h4>
        </div>

        <div className="relative group cursor-pointer flex-1 flex flex-col justify-center min-h-0" onClick={handleAdClick}>
          <div className="flex items-center justify-center overflow-hidden border-y border-white/5">
            <img 
              src={getDirectImageUrl(selectedAd.imageUrl)} 
              alt="Advertisement" 
              className="w-full h-auto block max-h-[60vh] object-contain"
            />
          </div>
          <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full border border-[#B0925A] flex items-center justify-center bg-black/60 text-[#B0925A] text-xl transition-all group-hover:bg-[#B0925A] group-hover:text-black group-hover:scale-110">
            ➜
          </div>
        </div>

        <div className="p-8 flex items-center justify-center shrink-0">
            <div className="text-center space-y-2">
                <p className="text-[10px] tracking-[4px] text-white/30 uppercase">Redirecting in</p>
                <div className="text-4xl font-light text-[#B0925A] font-mono tracking-tighter">
                   {timeLeft > 0 ? `00:0${timeLeft}` : 'OPENING...'}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
