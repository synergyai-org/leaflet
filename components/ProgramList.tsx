
import React, { useState } from 'react';
import { Program, Speaker, StyledText } from '../types';
import { getDirectImageUrl } from '../utils/urlHelper';
import RenderStyled from './common/RenderStyled';

interface ProgramListProps {
  programs: Program[];
  onSpeakerClick: (speaker: Speaker) => void;
  accentColor: string;
  boxColor: string;
  programTitle: StyledText;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, onSpeakerClick, accentColor, boxColor, programTitle }) => {
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  const toggleSession = (id: string) => {
    setOpenSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-4xl mx-auto py-24 px-6 md:px-10">
      <div className="text-center mb-20">
        <RenderStyled 
          data={programTitle} 
          isFluid={false}
          className="opacity-70 uppercase block"
        />
      </div>

      <div className="space-y-12">
        {programs.map((program, idx) => {
          // defaultOpen 값이 있으면 그 값을 따르고, 없으면 idx === 0 (첫 번째 세션)을 기본으로 함
          const isOpen = openSessions[program.id] ?? (program.defaultOpen ?? (idx === 0));
          const isOpening = idx === 0;
          const defaultTag = isOpening ? "INTRODUCTION" : `SESSION ${idx}`;
          const currentTag = program.sessionTag || { text: defaultTag };
          const sessionBgColor = `${accentColor}0d`; 

          return (
            <div 
              key={program.id} 
              className="session-block-premium overflow-hidden"
              style={{ 
                borderColor: `${accentColor}33`, 
                backgroundColor: sessionBgColor 
              }}
            >
              <div 
                onClick={() => toggleSession(program.id)}
                className="p-8 md:px-12 md:py-10 cursor-pointer flex justify-between items-center group"
              >
                <div className="space-y-2 flex-1">
                  <h4 className="text-[0.7rem] font-bold tracking-[4px] uppercase">
                    <RenderStyled data={currentTag} fontSize="0.7rem" isFluid={false} />
                  </h4>
                  <div className="group-hover:opacity-80 transition-opacity">
                    <RenderStyled data={program.sessionName} defaultColor="#FFFFFF" isFluid={false} />
                  </div>
                </div>
                <div className="text-[0.7rem] tracking-[2px] font-bold flex-shrink-0 ml-4" style={{ color: accentColor }}>
                  {isOpen ? 'CLOSE' : 'VIEW MORE'}
                </div>
              </div>

              <div className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {program.speakers.map((speaker) => (
                  <div 
                    key={speaker.id} 
                    className="p-10 md:px-12 md:py-10 border-t flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-8 relative"
                    style={{ borderTopColor: `${accentColor}33` }}
                  >
                    {/* Speaker Profile Photo - Mobile Enlarged (Card Centric) */}
                    <div 
                      className="w-[240px] h-[240px] md:w-[85px] md:h-[85px] overflow-hidden border-[0.5px] flex-shrink-0 shadow-2xl md:shadow-none" 
                      style={{ borderColor: accentColor }}
                    >
                      <img 
                        src={getDirectImageUrl(speaker.photoUrl)} 
                        alt={speaker.name.text} 
                        className="w-full h-full object-cover grayscale-[0.2] brightness-[1.1]"
                        loading="lazy"
                      />
                    </div>

                    {/* Speaker Info Container - Mobile Centered */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-1 w-full">
                      {/* Time Badge - Styled for Mobile & Desktop context */}
                      <div className="text-[0.85rem] md:text-[0.75rem] font-medium block px-5 py-2 md:px-3 md:py-1 border-2 md:border-0 md:border-l-2 rounded-full md:rounded-none w-fit mb-2 transition-all shadow-lg md:shadow-none" 
                        style={{ 
                          backgroundColor: `${accentColor}26`, 
                          borderColor: `${accentColor}44`,
                          borderLeftColor: accentColor 
                        }}>
                        <RenderStyled data={speaker.time} isFluid={false} />
                      </div>

                      <div className="space-y-3 md:space-y-1">
                        <h5 className="text-white leading-tight text-xl md:text-[1.15rem]">
                          <RenderStyled data={speaker.org} isFluid={false} />
                        </h5>
                        <p className="text-[#8E8E8E] font-light text-base md:text-[0.85rem]">
                          <RenderStyled data={speaker.name} isFluid={false} />
                        </p>
                      </div>

                      {/* Details Button for Mobile */}
                      {speaker.showDetail && (
                        <div className="pt-6 md:hidden w-full flex justify-center">
                          <button
                            onClick={() => onSpeakerClick(speaker)}
                            className="border px-10 py-3 text-[0.75rem] tracking-[3px] uppercase transition-all active:scale-95 active:bg-white/10"
                            style={{ color: accentColor, borderColor: `${accentColor}66` }}
                          >Details</button>
                        </div>
                      )}
                    </div>

                    {/* Details Button for Desktop (PC Original) */}
                    {speaker.showDetail && (
                      <button
                        onClick={() => onSpeakerClick(speaker)}
                        className="hidden md:block border px-6 py-2 text-[0.6rem] tracking-[2px] uppercase transition-all hover:text-white flex-shrink-0"
                        style={{ color: accentColor, borderColor: `${accentColor}44` }}
                      >Details</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProgramList;
