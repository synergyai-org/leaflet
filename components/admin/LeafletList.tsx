
import React from 'react';
import { LeafletMetadata } from '../../types';

interface LeafletListProps {
  leaflets: LeafletMetadata[];
  onEdit: (l: LeafletMetadata) => void;
  onDelete: (id: string) => void;
  onClone: (l: LeafletMetadata) => void;
  isSaving: boolean;
}

const LeafletList: React.FC<LeafletListProps> = ({ leaflets, onEdit, onDelete, onClone, isSaving }) => {
  const getShareLink = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('p', id);
    return url.toString();
  };

  const handlePreview = (id: string) => {
    const link = getShareLink(id);
    window.location.href = link;
  };

  const copyLink = async (id: string) => {
    const link = getShareLink(id);

    try {
      // 최신 Clipboard API 시도 (HTTPS/localhost 필요)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        alert('공유 링크가 클립보드에 복사되었습니다.');
      } else {
        // Fallback: execCommand 사용 (deprecated but works in HTTP)
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (success) {
          alert('공유 링크가 클립보드에 복사되었습니다.');
        } else {
          // 복사 실패 시 링크 직접 표시
          prompt('아래 링크를 복사하세요:', link);
        }
      }
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      // 에러 발생 시 링크 직접 표시
      prompt('아래 링크를 복사하세요:', link);
    }
  };

  if (!Array.isArray(leaflets) || leaflets.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-lg">
        <p className="text-slate-400 text-sm">등록된 리플렛이 없습니다. 상단 'New Leaflet' 버튼을 눌러 첫 프로젝트를 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leaflets.map(l => (
        <div key={l.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold uppercase tracking-widest">{l.id}</span>
               <button 
                 onClick={() => onDelete(l.id)} 
                 disabled={isSaving}
                 className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all text-xs disabled:opacity-50"
               >
                 삭제
               </button>
            </div>
            <h3 className="text-xl font-serif text-slate-800 mb-2 truncate" title={l.title}>{l.title}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight mb-6">
              Last Updated: {l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : '-'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onEdit(l)}
              disabled={isSaving}
              className="w-full bg-slate-900 text-white py-3 rounded text-[11px] font-bold uppercase tracking-[2px] hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              Edit Design
            </button>
            <button 
              onClick={() => onClone(l)}
              disabled={isSaving}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded text-[11px] font-bold uppercase tracking-[2px] hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Clone Leaflet
            </button>
            <div className="grid grid-cols-2 gap-2">
               <button 
                onClick={() => handlePreview(l.id)}
                className="bg-slate-50 text-slate-600 py-2 rounded text-[9px] font-bold uppercase tracking-[1px] hover:bg-slate-100 transition-all border border-slate-200"
               >
                 Preview
               </button>
               <button 
                onClick={() => copyLink(l.id)}
                className="bg-indigo-50 text-indigo-600 py-2 rounded text-[9px] font-bold uppercase tracking-[1px] hover:bg-indigo-100 transition-all border border-indigo-100"
               >
                 Copy Link
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeafletList;
