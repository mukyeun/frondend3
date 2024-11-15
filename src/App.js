import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { searchData } from './utils/dataManager';
import { validateHealthInfo } from './utils/validation';
import SearchModal from './components/SearchModal';
import HealthInfoForm from './components/HealthInfoForm';
import { 증상카테고리 } from './data/SymptomCategories';

// 초기 상태 정의
const initialFormData = {
  기본정보: {
    이름: '',
    생년월일: '',
    성별: '',
    신장: '',
    체중: '',
    BMI: ''
  },
  맥파분석: {
    수축기혈압: '',
    이완기혈압: '',
    맥박수: ''
  },
  메모: {
    성격: '',
    운동량: '',
    스트레스: '',
    메모: ''
  }
};

function App() {
  // 상태 관리
  const [formData, setFormData] = useState(initialFormData);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // 입력 핸들러
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
    console.log('Updated formData:', section, name, value); // 디버깅용
  };

  // 제출 핸들러
  const handleSubmit = () => {
    // 제출 로직 구현
    console.log('Form submitted:', formData);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedSymptoms([]);
    setSelectedCategory({
      대분류: '',
      중분류: '',
      소분류: ''
    });
  };

  // 검색 핸들러 추가
  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    try {
      const results = await searchData(searchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      // 에러 처리 로직 추가 가능
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HealthInfoForm 
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        selectedSymptoms={selectedSymptoms}
        setSelectedSymptoms={setSelectedSymptoms}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSubmit={handleSubmit}
        onReset={handleReset}
        isValid={isValid}
        validationErrors={validationErrors}
        증상카테고리={증상카테고리}
      />
      
      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onSearch={handleSearch}
          searchResults={searchResults}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;