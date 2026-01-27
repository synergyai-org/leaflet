
import { AppConfig, LeafletMetadata } from '../types';
import { API_URL } from '../constants';

// 디버깅 로그 유틸리티
const DEBUG = true; // 프로덕션에서는 false로 변경

const log = {
  request: (method: string, action: string, url: string, body?: any) => {
    if (!DEBUG) return;
    console.group(`🚀 [API Request] ${method} - ${action}`);
    console.log('URL:', url);
    if (body) console.log('Body:', body);
    console.log('Time:', new Date().toISOString());
    console.groupEnd();
  },
  response: (action: string, status: number, data: any, duration: number) => {
    if (!DEBUG) return;
    const icon = status >= 200 && status < 300 ? '✅' : '❌';
    console.group(`${icon} [API Response] ${action}`);
    console.log('Status:', status);
    console.log('Data:', data);
    console.log('Duration:', `${duration}ms`);
    console.groupEnd();
  },
  error: (action: string, error: any) => {
    if (!DEBUG) return;
    console.group(`💥 [API Error] ${action}`);
    console.error('Error:', error);
    console.log('Time:', new Date().toISOString());
    console.groupEnd();
  }
};

export const gasService = {
  // 특정 슬러그의 설정을 가져오거나 기본 설정을 가져옴
  async fetchConfig(slug: string = ""): Promise<AppConfig> {
    const action = 'fetchConfig';
    const url = `${API_URL}?p=${encodeURIComponent(slug)}&t=${Date.now()}`;
    const startTime = performance.now();

    log.request('GET', action, url);

    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', redirect: 'follow' });
      const data = await response.json();

      log.response(action, response.status, data, Math.round(performance.now() - startTime));

      if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);
      return data;
    } catch (error) {
      log.error(action, error);
      throw error;
    }
  },

  // 전체 리플렛 목록 가져오기 (게시판용)
  async fetchLeafletList(): Promise<LeafletMetadata[]> {
    const action = 'fetchLeafletList';
    const url = `${API_URL}?action=list&t=${Date.now()}`;
    const startTime = performance.now();

    log.request('GET', action, url);

    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', redirect: 'follow' });
      const data = await response.json();

      log.response(action, response.status, data, Math.round(performance.now() - startTime));

      return Array.isArray(data) ? data : [];
    } catch (error) {
      log.error(action, error);
      return [];
    }
  },

  async authenticate(id: string, pw: string): Promise<boolean> {
    const action = 'authenticate';
    const url = `${API_URL}?action=login&id=${encodeURIComponent(id.trim())}&pw=${encodeURIComponent('***')}&t=${Date.now()}`;
    const actualUrl = `${API_URL}?action=login&id=${encodeURIComponent(id.trim())}&pw=${encodeURIComponent(pw.trim())}&t=${Date.now()}`;
    const startTime = performance.now();

    log.request('GET', action, url); // 비밀번호는 마스킹하여 로깅

    try {
      const response = await fetch(actualUrl, { method: 'GET', mode: 'cors', redirect: 'follow' });

      if (!response.ok) {
        log.response(action, response.status, { success: false, reason: 'HTTP Error' }, Math.round(performance.now() - startTime));
        return false;
      }

      const result = await response.json();
      log.response(action, response.status, result, Math.round(performance.now() - startTime));

      return result.success === true;
    } catch (error) {
      log.error(action, error);
      return false;
    }
  },

  // 리플렛 저장 (신규 생성 또는 업데이트)
  // ID 변경을 위해 oldId 파라미터 추가
  async saveLeaflet(id: string, title: string, config: AppConfig, isNew: boolean = false, oldId?: string): Promise<{ success: boolean; message?: string }> {
    const action = isNew ? 'createLeaflet' : 'saveLeaflet';
    const url = `${API_URL}?t=${Date.now()}`;
    const startTime = performance.now();

    const payload = {
      action: isNew ? 'create' : 'save',
      id: id.trim(),
      oldId: oldId ? oldId.trim() : id.trim(),
      title,
      config
    };

    log.request('POST', action, url, {
      ...payload,
      config: `[AppConfig object - ${Object.keys(config).length} keys]` // config는 요약하여 로깅
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow'
      });

      if (!response.ok) {
        log.response(action, response.status, { success: false, reason: 'HTTP Error' }, Math.round(performance.now() - startTime));
        return { success: false, message: '네트워크 응답 오류' };
      }

      const result = await response.json();
      log.response(action, response.status, result, Math.round(performance.now() - startTime));

      return {
        success: result.status === 'success',
        message: result.message
      };
    } catch (error) {
      log.error(action, error);
      return { success: false, message: '서버 통신 중 오류 발생' };
    }
  },

  async deleteLeaflet(id: string): Promise<boolean> {
    const action = 'deleteLeaflet';
    const url = `${API_URL}?t=${Date.now()}`;
    const startTime = performance.now();
    const payload = { action: 'delete', id };

    log.request('POST', action, url, payload);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow'
      });

      if (!response.ok) {
        log.response(action, response.status, { success: false, reason: 'HTTP Error' }, Math.round(performance.now() - startTime));
        return false;
      }

      const result = await response.json();
      log.response(action, response.status, result, Math.round(performance.now() - startTime));

      return result.status === 'success';
    } catch (error) {
      log.error(action, error);
      return false;
    }
  }
};
