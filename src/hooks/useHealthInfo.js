import { useState, useCallback } from 'react';
import { healthInfoService } from '../services/api';

export const useHealthInfo = () => {
  const [listStatus, setListStatus] = useState('idle');
  const [listData, setListData] = useState({ items: [], currentPage: 1, totalPages: 1 });
  const [listError, setListError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  // 메모 객체를 문자열로 변환하는 함수
  const formatMemo = (memo) => {
    if (!memo) return '-';
    if (typeof memo === 'string') return memo;
    if (typeof memo === 'object') {
      const memoValues = [];
      if (memo.성격) memoValues.push(`성격: ${memo.성격}`);
      if (memo.운동량) memoValues.push(`운동량: ${memo.운동량}`);
      if (memo.스트레스) memoValues.push(`스트레스: ${memo.스트레스}`);
      if (memo.메모) memoValues.push(`메모: ${memo.메모}`);
      return memoValues.join(', ') || '-';
    }
    return '-';
  };

  // BMI 계산 함수 추가
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return '-';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);  // 소수점 1자리까지만 표시
  };

  // 나이 계산 함수 추가
  const calculateAge = (주민등록번호) => {
    if (!주민등록번호 || 주민등록번호.length !== 14) return '-';
    
    const birthYear = 주민등록번호.substring(0, 2);
    const genderDigit = 주민등록번호.charAt(7);
    
    // 1900년대생(1,2) 또는 2000년대생(3,4) 구분
    const fullYear = (genderDigit === '1' || genderDigit === '2') 
      ? `19${birthYear}` 
      : `20${birthYear}`;
      
    const age = new Date().getFullYear() - parseInt(fullYear);
    return age;
  };

  // 성별 판단 함수 추가
  const getGender = (주민등록번호) => {
    if (!주민등록번호 || 주민등록번호.length !== 14) return '-';
    
    const genderDigit = 주민등록번호.charAt(7);
    return (genderDigit === '1' || genderDigit === '3') ? '남' : '여';
  };

  const loadList = useCallback(async (options = {}) => {
    try {
      setListStatus('loading');
      
      // searchTerm이 명시적으로 전달된 경우에만 사용
      const params = {
        ...(options.name && { searchTerm: options.name }),
        ...(options.startDate && { startDate: options.startDate }),
        ...(options.endDate && { endDate: options.endDate }),
        ...(options.sortOption && { sortOption: options.sortOption }),
        ...filters
      };
      
      console.log('API 요청 파라미터:', params);
      const response = await healthInfoService.getList(params);
      
      // 응답 데이터 확인
      console.log('API 응답:', response);

      let items = Array.isArray(response) ? response : [];

      const formattedData = {
        items: items.map(item => {
          const 기본정보 = item.기본정보 || {};
          const 증상선택 = item.증상선택 || {};
          const 맥파분석 = item.맥파분석 || {};
          
          return {
            id: item._id || item.id || new Date().getTime(),  // MongoDB _id 지원
            날짜: new Date(item.createdAt || Date.now()).toLocaleDateString('ko-KR'),
            이름: 기본정보.이름 || '-',
            연락처: 기본정보.연락처 || '-',
            나이: calculateAge(기본정보.주민등록번호),
            성별: getGender(기본정보.주민등록번호),
            성격: 기본정보.성격 || '-',
            BMI: calculateBMI(
              parseFloat(기본정보.신장),
              parseFloat(기본정보.체중)
            ),
            스트레스: 기본정보.스트레스 || '-',
            노동강도: 기본정보.노동강도 || '-',
            증상: Array.isArray(증상선택.증상) 
              ? 증상선택.증상.join(', ') 
              : 증상선택.증상 || '-',
            혈압: 맥파분석.수축기혈압 && 맥파분석.이완기혈압
              ? `${맥파분석.수축기혈압}/${맥파분석.이완기혈압}`
              : '-',
            복용약물: Array.isArray(item.복용약물?.약물) 
              ? item.복용약물.약물.join(', ') 
              : item.복용약물?.약물 || '-',
            원본데이터: item  // 원본 데이터 보존
          };
        }),
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || items.length
      };

      console.log('변환된 데이터:', formattedData);
      setListData(formattedData);
      setListStatus('success');
      
    } catch (error) {
      console.error('목록 로딩 실패:', error);
      setListError(error.message || '데이터를 불러오는데 실패했습니다.');
      setListStatus('error');
    }
  }, [filters]);

  const handleSearchTermChange = useCallback((value) => {
    console.log('검색어 변경:', value);
    setSearchTerm(value);
  }, []);

  const handleSearch = useCallback(() => {
    console.log('검색 실행:', searchTerm);
    if (searchTerm.trim()) {
      loadList({ name: searchTerm.trim() });
    }
  }, [searchTerm, loadList]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    loadList();
  }, [loadList]);

  const handleEdit = useCallback(async (id) => {
    try {
      const item = listData.items.find(item => item.id === id);
      setSelectedItem(item);
      // 여기서 수정 모달을 열거나 수정 페이지로 이동할 수 있습니다
    } catch (error) {
      console.error('Edit error:', error);
      alert('수정 준비 중 오류가 발생했습니다.');
    }
  }, [listData]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await healthInfoService.delete(id);
      loadList(); // 목록 새로고침
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  }, [loadList]);

  return {
    listStatus,
    listData,
    listError,
    loadList,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    handleSearch,
    filters,
    handleFilterChange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    sortOption,
    setSortOption,
    handleEdit,
    handleDelete,
    selectedItem,
    setSelectedItem
  };
};
