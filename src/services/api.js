import axios from 'axios';

// baseURL 수정 (api가 중복되지 않도록)
const BASE_URL = 'http://localhost:5000';  // 하드코딩으로 먼저 테스트

// axios 기본 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const healthInfoService = {
  // 목록 조회
  async getList(params = {}) {
    try {
      const response = await axios.get('/api/health-info', { params });
      console.log('API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('API 에러:', error);
      throw new Error(error.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    }
  },

  // 생성
  async create(data) {
    try {
      console.log('요청 데이터:', data);  // 디버깅용
      const response = await axios.post('/api/health-info', data);
      console.log('응답 데이터:', response.data);  // 디버깅용
      return response.data;
    } catch (error) {
      console.error('저장 에러:', error);
      throw new Error(error.response?.data?.message || '저장에 실패했습니다.');
    }
  },

  // 수정
  async update(id, data) {
    try {
      const response = await axios.put(`/api/health-info/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '수정에 실패했습니다.');
    }
  },

  // 삭제
  async delete(id) {
    try {
      await axios.delete(`/api/health-info/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || '삭제에 실패했습니다.');
    }
  }
};
