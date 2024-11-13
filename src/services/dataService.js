const API_BASE_URL = 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'healthInfoData';

// 로컬 스토리지 관련 함수들
const saveToLocalStorage = (data) => {
  try {
    const existingData = getFromLocalStorage();
    const updatedData = [...existingData, data];
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

const searchInLocalStorage = (keyword) => {
  try {
    const allData = getFromLocalStorage();
    return allData.filter(item => 
      item.기본정보.이름.includes(keyword) ||
      item.기본정보.주민번호.includes(keyword) ||
      item.기본정보.연락처.includes(keyword)
    );
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

const searchInMongoDB = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-info/search?keyword=${keyword}`);
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
  const mongoSave = await saveToMongoDB(data);
  return { localSave, mongoSave };
};

const searchData = async (keyword) => {
  const localResults = searchInLocalStorage(keyword);
  const mongoResults = await searchInMongoDB(keyword);
  return { localResults, mongoResults };
};

const getAllData = async () => {
  const localData = getFromLocalStorage();
  const mongoData = await getAllFromMongoDB();
  return { localData, mongoData };
};

export {
  saveData,
  searchData,
  getAllData,
  clearLocalStorage
};