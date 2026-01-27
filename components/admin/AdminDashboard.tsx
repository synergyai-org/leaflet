
import React, { useState, useEffect } from 'react';
import { AppConfig, StyledText, LeafletMetadata } from '../../types';
import { gasService } from '../../services/gasService';
import { DEFAULT_CONFIG } from '../../constants';
import GeneralTab from './tabs/GeneralTab';
import DesignTab from './tabs/DesignTab';
import ProgramsTab from './tabs/ProgramsTab';
import AdTab from './tabs/AdTab';
import LeafletList from './LeafletList';
import Toast from '../Toast';

interface AdminDashboardProps {
  config: AppConfig;
  onRefresh: () => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onRefresh, onClose }) => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [leaflets, setLeaflets] = useState<LeafletMetadata[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [originalId, setOriginalId] = useState<string>(''); 
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [localConfig, setLocalConfig] = useState<AppConfig>(JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'programs' | 'ad'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (view === 'list') {
      loadList();
    }
  }, [view]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadList = async () => {
    try {
      const data = await gasService.fetchLeafletList();
      setLeaflets(Array.isArray(data) ? data : []);
    } catch (e) {
      setToast({ message: '목록을 불러오지 못했습니다.', type: 'error' });
    }
  };

  const handleEdit = async (metadata: LeafletMetadata) => {
    setIsSaving(true);
    try {
      const fullConfig = await gasService.fetchConfig(metadata.id);
      setCurrentId(metadata.id);
      setOriginalId(metadata.id);
      setCurrentTitle(metadata.title);
      setLocalConfig(fullConfig);
      setView('editor');
    } catch (e) {
      setToast({ message: '설정을 불러오지 못했습니다.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClone = async (metadata: LeafletMetadata) => {
    if (!confirm(`'${metadata.title}' 리플렛을 복제하시겠습니까?`)) return;
    setIsSaving(true);
    try {
      const targetConfig = await gasService.fetchConfig(metadata.id);
      const newId = `${metadata.id}_copy_${Math.floor(Date.now() / 1000)}`;
      const newTitle = `${metadata.title} (복사본)`;
      
      const result = await gasService.saveLeaflet(newId, newTitle, targetConfig, true);
      
      if (result.success) {
        setToast({ message: '리플렛이 성공적으로 복제되었습니다.', type: 'success' });
        await loadList();
      } else {
        setToast({ message: result.message || '복제에 실패했습니다.', type: 'error' });
      }
    } catch (e) {
      setToast({ message: '복제 과정에서 오류가 발생했습니다.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    const newId = `event_${Math.floor(Date.now() / 1000)}`;
    setCurrentId(newId);
    setOriginalId(''); 
    setCurrentTitle('새 리플렛');
    setLocalConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    setView('editor');
  };

  const handleSave = async () => {
    if (!currentId.trim()) {
      setToast({ message: '리플렛 ID는 필수입니다.', type: 'error' });
      return;
    }

    const idRegex = /^[a-zA-Z0-9-_]+$/;
    if (!idRegex.test(currentId)) {
      setToast({ message: 'ID에는 영문, 숫자, 하이픈(-), 언더바(_)만 가능합니다.', type: 'error' });
      return;
    }

    setIsSaving(true);
    
    const isNew = originalId === '';
    const result = await gasService.saveLeaflet(currentId, currentTitle, localConfig, isNew, originalId || currentId);
    
    if (result.success) {
      setToast({ message: '리플렛이 성공적으로 저장되었습니다.', type: 'success' });
      await loadList();
      
      const currentUrl = new URL(window.location.href);
      const activeId = currentUrl.searchParams.get('p');
      
      if (activeId === originalId || activeId === currentId) {
        if (currentId !== activeId) {
          window.history.replaceState(null, '', `?p=${currentId}`);
        }
        onRefresh();
      }
      
      setTimeout(() => setView('list'), 1000);
    } else {
      setToast({ message: result.message || '저장에 실패했습니다.', type: 'error' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 리플렛을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;
    setIsSaving(true);
    try {
      const success = await gasService.deleteLeaflet(id);
      if (success) {
        setToast({ message: '성공적으로 삭제되었습니다.', type: 'success' });
        await loadList();
      } else {
        setToast({ message: '삭제 요청을 처리하지 못했습니다. ID를 확인해주세요.', type: 'error' });
      }
    } catch (e) {
      setToast({ message: '삭제 중 서버 통신 오류가 발생했습니다.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateStyledField = (section: keyof AppConfig, field: string, value: StyledText) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value }
    }));
  };

  if (view === 'list') {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-50 flex flex-col p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-serif text-slate-800">Leaflet Manager</h2>
                <p className="text-xs text-slate-400 tracking-[3px] uppercase mt-1">Multi-Project Management System</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleCreateNew} disabled={isSaving} className="bg-[#B0925A] text-white px-6 py-3 rounded-sm font-bold text-xs tracking-[2px] hover:bg-[#E1B16A] transition-all uppercase disabled:opacity-50">New Leaflet</button>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-800 uppercase text-[10px] tracking-[2px] px-4">Close</button>
              </div>
           </div>
           
           <LeafletList 
            leaflets={leaflets} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onClone={handleClone}
            isSaving={isSaving}
           />
        </div>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col md:flex-row text-slate-800 animate-in fade-in zoom-in duration-300">
      <div className="w-full md:w-80 bg-slate-900 text-white p-8 flex flex-col shrink-0">
        <button onClick={() => setView('list')} className="mb-8 text-[10px] text-white/30 hover:text-white transition-all uppercase tracking-[2px] flex items-center gap-2">
           <span>← Back to Board</span>
        </button>
        
        <div className="mb-10 space-y-4">
          <div>
            <label className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Leaflet Title</label>
            <input 
              className="bg-transparent border-b border-white/20 text-lg font-serif text-white focus:outline-none focus:border-[#B0925A] w-full pb-1"
              value={currentTitle}
              onChange={e => setCurrentTitle(e.target.value)}
              placeholder="리플렛 제목 입력"
            />
          </div>
          
          <div>
            <label className="text-[9px] text-[#B0925A] uppercase tracking-widest block mb-1">URL Slug (Leaflet ID)</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded">
              <span className="text-[10px] text-white/30">?p=</span>
              <input 
                className="bg-transparent text-sm font-mono text-[#B0925A] focus:outline-none w-full"
                value={currentId}
                onChange={e => setCurrentId(e.target.value)}
                placeholder="event-slug"
              />
            </div>
            <p className="text-[8px] text-white/20 mt-1 uppercase">영문, 숫자, -, _ 만 허용됩니다.</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
          {(['general', 'design', 'programs', 'ad'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left p-4 rounded transition-all uppercase tracking-widest text-[10px] font-bold border-l-2 ${activeTab === tab ? 'bg-[#B0925A]/10 border-[#B0925A] text-[#B0925A]' : 'border-transparent hover:bg-white/5 opacity-50'}`}>
              {tab === 'general' ? '일반 설정' : tab === 'design' ? '디자인 설정' : tab === 'programs' ? '프로그램 관리' : '광고 관리'}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-3">
          <button onClick={handleSave} disabled={isSaving} className="w-full bg-[#B0925A] hover:bg-[#E1B16A] text-black font-bold py-4 rounded-sm transition-all text-xs tracking-[3px] shadow-lg disabled:opacity-50">
            {isSaving ? 'Saving...' : '저장하기'}
          </button>
          <button onClick={() => setLocalConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)))} className="w-full bg-red-900/20 text-red-400 hover:bg-red-900/40 py-3 rounded-sm text-[9px] tracking-[2px] uppercase">초기화</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-slate-50 no-scrollbar">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'general' && <GeneralTab config={localConfig} onUpdate={updateStyledField} onSetRoot={setLocalConfig} />}
          {activeTab === 'design' && <DesignTab config={localConfig} onSetRoot={setLocalConfig} />}
          {activeTab === 'programs' && <ProgramsTab config={localConfig} onSetRoot={setLocalConfig} />}
          {activeTab === 'ad' && <AdTab config={localConfig} onSetRoot={setLocalConfig} />}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminDashboard;
