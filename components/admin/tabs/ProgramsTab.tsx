
import React from 'react';
import { AppConfig, Program, Speaker } from '../../../types';
import { ImageGuide, ImagePreview, RichTextEditor, SpecGuide } from '../AdminCommon';

interface ProgramsTabProps {
  config: AppConfig;
  onSetRoot: (newConfig: AppConfig) => void;
}

const ProgramsTab: React.FC<ProgramsTabProps> = ({ config, onSetRoot }) => {
  const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // 방어 코드: 중첩 객체가 undefined인 경우 빈 배열/객체로 대체
  const programList = config?.programList || [];
  const globalTheme = config?.globalTheme || {};

  const addSession = () => {
    const newSession: Program = {
      id: generateId('session'),
      defaultOpen: false,
      sessionTag: {
        text: `SESSION ${programList.length + 1}`,
        fontFamily: 'Pretendard',
        isBold: true,
        fontSize: '0.7rem',
        letterSpacing: '4px',
        textAlign: 'left'
      },
      sessionName: {
        text: '새 세션 제목을 입력하세요',
        fontFamily: 'Merriweather',
        isBold: false,
        fontSize: '1.3rem',
        color: '#FFFFFF',
        textAlign: 'left'
      },
      speakers: []
    };
    onSetRoot({ ...config, programList: [...programList, newSession] });
  };

  const updateProgram = (id: string, field: string, value: any) => {
    onSetRoot({ ...config, programList: programList.map(p => p.id === id ? { ...p, [field]: value } : p) });
  };

  const updateSpeaker = (pId: string, sId: string, field: string, value: any) => {
    onSetRoot({ ...config, programList: programList.map(p => p.id === pId ? { ...p, speakers: (p.speakers || []).map(s => s.id === sId ? { ...s, [field]: value } : s) } : p) });
  };

  const moveProgram = (index: number, direction: 'up' | 'down') => {
    const newList = [...programList];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    onSetRoot({ ...config, programList: newList });
  };

  const addSpeaker = (pId: string) => {
    const newSpeaker: Speaker = {
      id: generateId('sp'),
      time: {
        text: '00:00 - 00:00',
        fontFamily: 'Merriweather',
        isBold: true,
        fontSize: '0.75rem',
        letterSpacing: '0px'
      },
      name: {
        text: '성함 직책 (소속)',
        fontFamily: 'Pretendard',
        fontSize: '0.85rem',
        color: globalTheme.textColor || '#8E8E8E',
        letterSpacing: '0px'
      },
      org: {
        text: '발표 주제를 입력하세요',
        fontFamily: 'Pretendard',
        fontSize: '1.15rem',
        color: '#FFFFFF',
        letterSpacing: '0px'
      },
      photoUrl: '',
      detailUrl: '',
      showDetail: true
    };
    onSetRoot({ ...config, programList: programList.map(p => p.id === pId ? { ...p, speakers: [...(p.speakers || []), newSpeaker] } : p) });
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">프로그램 관리</h3>
        <button onClick={addSession} className="bg-[#B0925A] text-black px-4 py-1 rounded text-sm font-bold tracking-widest hover:bg-[#E1B16A] transition-colors">+ 세션 추가</button>
      </div>
      <ImageGuide />
      <div className="space-y-12">
        {programList.map((p, idx) => (
          <div key={p.id} className="border-t-4 border-[#B0925A] p-6 rounded-lg bg-white shadow-xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">SESSION {idx + 1}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id={`defaultOpen-${p.id}`}
                      checked={p.defaultOpen || false}
                      onChange={e => updateProgram(p.id, 'defaultOpen', e.target.checked)}
                      className="w-3 h-3 accent-[#B0925A]"
                    />
                    <label htmlFor={`defaultOpen-${p.id}`} className="text-[9px] font-bold text-[#B0925A] uppercase cursor-pointer">기본으로 열어두기</label>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveProgram(idx, 'up')} disabled={idx === 0} className="w-6 h-6 border rounded hover:bg-slate-50 disabled:opacity-20 transition-all">▲</button>
                  <button onClick={() => moveProgram(idx, 'down')} disabled={idx === programList.length - 1} className="w-6 h-6 border rounded hover:bg-slate-50 disabled:opacity-20 transition-all">▼</button>
                </div>
              </div>
              <button onClick={() => onSetRoot({ ...config, programList: programList.filter(item => item.id !== p.id) })} className="text-red-400 text-[10px] font-bold uppercase hover:underline">삭제</button>
            </div>
            <div className="space-y-4">
              <RichTextEditor label="세션 태그" value={p.sessionTag} onChange={v => updateProgram(p.id, 'sessionTag', v)} />
              <RichTextEditor label="세션명" value={p.sessionName} onChange={v => updateProgram(p.id, 'sessionName', v)} />
            </div>
            <div className="mt-8 space-y-6 pl-4 border-l-2 border-slate-50">
               <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">연사 리스트</h4>
                  <button onClick={() => addSpeaker(p.id)} className="text-[#B0925A] text-[10px] font-bold uppercase hover:underline">+ 연사 추가</button>
               </div>
               {(p.speakers || []).map(s => (
                 <div key={s.id} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4 relative group">
                    <button onClick={() => updateProgram(p.id, 'speakers', (p.speakers || []).filter(sp => sp.id !== s.id))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors">✕</button>
                    <RichTextEditor label="발표 시간" value={s.time} onChange={v => updateSpeaker(p.id, s.id, 'time', v)} />
                    <RichTextEditor label="연사 정보 (성함 직책 소속)" value={s.name} onChange={v => updateSpeaker(p.id, s.id, 'name', v)} />
                    <RichTextEditor label="발표 주제" value={s.org} onChange={v => updateSpeaker(p.id, s.id, 'org', v)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">사진 URL</label>
                        <input className="w-full text-[10px] border p-2 rounded bg-white font-mono" placeholder="URL 또는 구글 드라이브 링크" value={s.photoUrl} onChange={e => updateSpeaker(p.id, s.id, 'photoUrl', e.target.value)} />
                        <SpecGuide spec="400x400px (1:1 Square)" />
                        <ImagePreview url={s.photoUrl} label="Speaker" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">상세 링크</label>
                        <input className="w-full text-[10px] border p-2 rounded bg-white font-mono" placeholder="https://..." value={s.detailUrl} onChange={e => updateSpeaker(p.id, s.id, 'detailUrl', e.target.value)} />
                        <div className="mt-2 flex items-center gap-2">
                           <input type="checkbox" id={`showDetail-${s.id}`} checked={s.showDetail} onChange={e => updateSpeaker(p.id, s.id, 'showDetail', e.target.checked)} />
                           <label htmlFor={`showDetail-${s.id}`} className="text-[9px] font-bold text-slate-500 uppercase">상세 버튼 노출</label>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsTab;
