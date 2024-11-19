import axios from 'axios';

const API_URL = 'http://localhost:5000/api/health-info';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터에 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // 서버가 응답을 반환한 경우
      throw new Error(error.response.data.message || '서버 오류가 발생했습니다.');
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
);

export const newHealthInfoService = {
  // 건강 정보 생성
  create: async (data) => {
    try {
      // 성격 데이터를 기본정보로 이동
      const formattedData = {
        ...data,
        기본정보: {
          ...data.기본정보,
          성격: data.메모?.성격 || data.기본정보?.성격 || null
        },
        메모: {
          ...data.메모,
          성격: undefined // 메모에서 성격 필드 제거
        }
      };
      
      const response = await api.post('/', formattedData);
      return response.data;
    } catch (error) {
      console.error('Create health info error:', error);
      throw error;
    }
  },

  // 건강 정보 조회
  getAll: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Get all health info error:', error);
      throw error;
    }
  },

  // 건강 정보 수정
  update: async (id, data) => {
    try {
      // 성격 데이터를 기본정보로 이동
      const formattedData = {
        ...data,
        기본정보: {
          ...data.기본정보,
          성격: data.메모?.성격 || data.기본정보?.성격 || null
        },
        메모: {
          ...data.메모,
          성격: undefined // 메모에서 성격 필드 제거
        }
      };
      
      const response = await api.put(`/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Update health info error:', error);
      throw error;
    }
  },

  // 나머지 메서드들은 그대로 유지
  delete: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete health info error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get health info by ID error:', error);
      throw error;
    }
  },

  search: async (keyword) => {
    try {
      const response = await api.get(`/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Search health info error:', error);
      throw error;
    }
  }
};

export default newHealthInfoService;