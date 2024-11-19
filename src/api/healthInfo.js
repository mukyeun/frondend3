import axios from 'axios';

// 백엔드 서버 주소 설정
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 건강정보 목록 조회
export const getHealthInfoList = async (searchParams = {}) => {
  try {
    const response = await axios.get('/api/health-info', { params: searchParams });
    console.log('조회 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('조회 오류:', error);
    throw error;
  }
};

// 건강정보 저장
export const createHealthInfo = async (data) => {
  try {
    console.log('저장 요청 데이터:', data);
    const response = await axios.post('/api/health-info', data);
    console.log('저장 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('저장 오류:', error);
    throw error;
  }
};

// 단일 건강정보 조회 추가
export const getHealthInfo = async (id) => {
  try {
    const response = await axios.get(`/health-info/${id}`);
    return response.data;
  } catch (error) {
    console.error('조회 오류:', error);
    throw error;
  }
};

// 건강정보 검색
export const searchHealthInfo = async (searchParams) => {
  try {
    const response = await axios.get('/api/health-info/search', { params: searchParams });
    console.log('검색 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('검색 오류:', error);
    throw error;
  }
};
