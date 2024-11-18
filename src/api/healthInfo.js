import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 건강정보 생성
export const createHealthInfo = async (data) => {
  const response = await api.post('/health-info', data);
  return response.data;
};

// 건강정보 조회
export const getHealthInfo = async (id) => {
  const response = await api.get(`/health-info/${id}`);
  return response.data;
};

// 건강정보 목록 조회
export const getHealthInfoList = async (params) => {
  const response = await api.get('/health-info', { params });
  return response.data;
};

// 건강정보 수정
export const updateHealthInfo = async (id, data) => {
  const response = await api.put(`/health-info/${id}`, data);
  return response.data;
};

// 건강정보 삭제
export const deleteHealthInfo = async (id) => {
  const response = await api.delete(`/health-info/${id}`);
  return response.data;
};
