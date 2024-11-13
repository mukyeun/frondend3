const API_BASE_URL = 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'healthInfoData';

// 로컬 스토리지 관련 함수들
const saveToLocalStorage = (data) => {
  try {
    const existingData = getFromLocalStorage();
    const newData = {
      ...data,
      createdAt: new Date().toISOString()
    };
    const updatedData = [newData, ...existingData];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('로컬 스토리지 저장 실패:', error);
    return false;
  }
};

const getFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('로컬 스토리지 조회 실패:', error);
    return [];
  }
};

const searchInLocalStorage = ({ type, keyword, startDate, endDate }) => {
  try {
    const allData = getFromLocalStorage();
    return allData.filter(item => {
      // 날짜 검색
      if (type === 'date') {
        const itemDate = new Date(item.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
          return itemDate >= start && itemDate <= end;
        }
        return true;
      }
      
      // 이름, 주민번호, 연락처 검색
      if (!keyword) return true;
      
      switch (type) {
        case 'name':
          return item.기본정보.이름.includes(keyword);
        case 'id':
          return item.기본정보.주민번호.includes(keyword);
        case 'phone':
          return item.기본정보.연락처.includes(keyword);
        default:
          return true;
      }
    });
  } catch (error) {
    console.error('로컬 스토리지 검색 실패:', error);
    return [];
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('로컬 스토리지 삭제 실패:', error);
    return false;
  }
};

// MongoDB API 함수들
const saveToMongoDB = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error('MongoDB 저장 실패:', error);
    throw error;
  }
};

const searchInMongoDB = async (searchParams) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${API_BASE_URL}/health-info/search?${queryString}`);
    return response.json();
  } catch (error) {
    console.error('MongoDB 검색 실패:', error);
    throw error;
  }
};

const getAllFromMongoDB = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-info`);
    return response.json();
  } catch (error) {
    console.error('MongoDB 조회 실패:', error);
    throw error;
  }
};

// 통합 함수들
const saveData = async (data) => {
  const localSave = saveToLocalStorage(data);
  try {
    const mongoSave = await saveToMongoDB(data);
    return { success: true, localSave, mongoSave };
  } catch (error) {
    return { success: localSave, localSave, mongoSave: null };
  }
};

const searchData = async (searchParams) => {
  const localResults = searchInLocalStorage(searchParams);
  try {
    const mongoResults = await searchInMongoDB(searchParams);
    return [...localResults, ...mongoResults];
  } catch (error) {
    return localResults;
  }
};

const getAllData = async () => {
  const localData = getFromLocalStorage();
  try {
    const mongoData = await getAllFromMongoDB();
    return [...localData, ...mongoData];
  } catch (error) {
    return localData;
  }
};

export {
  saveData,
  searchData,
  getAllData,
  clearLocalStorage
};