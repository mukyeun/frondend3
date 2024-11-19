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

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleFormSubmit = (updatedData) => {
    console.log('Form data updated:', updatedData);
    setFormData(updatedData);
  };

  const handleReset = () => {
    setFormData({
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
    setSelectedSymptoms([]);
    setSelectedCategory({
      대분류: '',
      중분류: '',
      소분류: ''
    });
  };

  return (
    <HealthInfoForm 
      formData={formData}
      setFormData={setFormData}
      selectedSymptoms={selectedSymptoms}
      setSelectedSymptoms={setSelectedSymptoms}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      onSubmit={handleFormSubmit}
      onReset={handleReset}
      isValid={isValid}
      validationErrors={validationErrors}
      증상카테고리={증상카테고리}
    />
  );
}

export default HealthInfoPage;
