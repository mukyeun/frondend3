import React, { useState } from 'react';
import HealthInfoForm from '../components/HealthInfoForm';
import { 증상카테고리 } from '../data/SymptomCategories';

function HealthInfoPage() {
  const [formData, setFormData] = useState({
    기본정보: {
      이름: '',
      연락처: '',
      주민등록번호: '',
      성별: '',
      신장: '',
      체중: '',
      BMI: '',
      성격: ''
    },
    증상선택: {
      스트레스수준: '',
      노동강도: '',
      증상: []
    },
    맥파분석: {},
    메모: '',
    복용약물: {
      약물: [],
      기호식품: []
    }
  });

  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  const handleFormSubmit = (updatedData) => {
    console.log('Form data updated:', updatedData);
    setFormData(updatedData);
  };

  return (
    <HealthInfoForm 
      formData={formData}
      onSubmit={(data) => {
        console.log('제출된 데이터:', data);  // 데이터 확인용 로그
        // 여기서 데이터 처리
        setFormData(data);  // 상태 업데이트
        // API 호출 등 추가 처리
      }}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      증상카테고리={증상카테고리}
    />
  );
}

export default HealthInfoPage;
