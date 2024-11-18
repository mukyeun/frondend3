import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { 약물카테고리 } from '../data/MedicineCategories.js';

// 스타일 컴포넌트들을 파일 상단에 모아서 선언
const FormContainer = styled.div`
  max-width: 800px;
  margin: 1rem auto;
  padding: 0 1rem;
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  padding: 0.5rem 0.75rem;
  background-color: ${props => {
    switch(props.type) {
      case '기본정보': return '#4361ee';
      case '증상선택': return '#7209b7';
      case '맥파분석': return '#f72585';
      case '복용약물': return '#4cc9f0';
      case '메모': return '#4895ef';
      default: return '#4361ee';
    }
  }};
  color: white;
  border-radius: 4px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  padding: 0 0.5rem;

  &.memo-group {
    display: block;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a202c;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    background: white;
  }

  option {
    font-weight: 500;
    color: #1a202c;
  }

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
`;

const BodyInfoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
`;

const BodyInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #4a5568;
    font-weight: 500;
  }

  .bmi-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
`;

const TextArea = styled.textarea`
  width: calc(100% - 1rem);
  min-height: 100px;
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  margin: 0 0.5rem;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const SymptomTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;
  margin: 0.25rem;
  
  button {
    background: none;
    border: none;
    margin-left: 0.3rem;
    color: #a0aec0;
    cursor: pointer;
    padding: 0 0.2rem;
    
    &:hover {
      color: #e53e3e;
    }
  }
`;

const AddButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  height: 32px;
  
  &:hover {
    background-color: #3730a3;
  }
  
  &:disabled {
    background-color: #a5b4fc;
  }
`;

// 맥파 분석을 위한 추가 스타일 컴포넌트
const VitalSignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VitalSignBox = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const VitalSignValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const UnitText = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

// 메모 섹션을 위한 추가 스타일 컴포넌트
const MemoGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const LevelSelect = styled(Select)`
  max-width: 200px;
`;

const SaveButton = styled.button`
  background: #4A90E2;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    background: #357ABD;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const RequiredLabel = styled.span`
  color: #e74c3c;
  margin-left: 4px;
`;

const ValidationMessage = styled.div`
  color: ${props => props.isError ? '#e74c3c' : '#2ecc71'};
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' && css`
    background-color: #4A90E2;
    color: white;
    
    &:hover {
      background-color: #357ABD;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background-color: #93C5FD;
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: #EDF2F7;
    color: #4A5568;
    
    &:hover {
      background-color: #E2E8F0;
      transform: translateY(-1px);
    }
  `}
`;

// 스타일 컴포넌트
const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  
  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SelectedMedicineList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 136px;
  background: white;
`;

const MedicineTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f1f3f5;
  border-radius: 4px;
  font-size: 13px;
  color: #495057;

  button {
    border: none;
    background: none;
    margin-left: 6px;
    padding: 0;
    font-size: 16px;
    cursor: pointer;
    color: #adb5bd;
    
    &:hover {
      color: #495057;
    }
  }
`;

// BMI 계산 및 상태 판정 함수
const calculateBMIStatus = (height, weight) => {
  if (!height || !weight) return { bmi: '', status: '' };
  
  const heightInMeter = height / 100;
  const bmi = (weight / (heightInMeter * heightInMeter)).toFixed(1);
  
  // BMI 상태 판정
  let status = '';
  if (bmi < 16.0) status = '고도저체중';
  else if (bmi < 18.5) status = '저체중';
  else if (bmi < 23.0) status = '정상';
  else if (bmi < 25.0) status = '과체중';
  else if (bmi < 30.0) status = '비만';
  else status = '고도비만';
  
  return { bmi, status };
};

// BMIStatus를 BMIStatusLabel로 이름 변경
const BMIStatusLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.status) {
      case '고도저체중': return '#fed7d7';
      case '저체중': return '#feebc8';
      case '정상': return '#c6f6d5';
      case '과체중': return '#feebc8';
      case '비만': return '#fed7d7';
      case '고도비만': return '#feb2b2';
      default: return '#edf2f7';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case '고도저체중': return '#e53e3e';
      case '저체중': return '#dd6b20';
      case '정상': return '#38a169';
      case '과체중': return '#dd6b20';
      case '비만': return '#e53e3e';
      case '고도비만': return '#822727';
      default: return '#4a5568';
    }
  }};
`;

// 성격 션 배열 추가 (컴포넌트 외부에 선언)
const personalityOptions = [
  '매우 급함',
  '급함',
  '보통',
  '느긋',
  '매우 느긋'
];

// 레벨 옵션 배열 통합 (컴포넌트 외부에 선언)
const levelOptions = [
  '매우 많음',
  '많음',
  '보통',
  '적음',
  '매우 적음'
];

// 기호식품 옵션 배열 수
const favoriteItems = [
  '없음',
  '술',
  '커피',
  '담배',
  '마약',
  '기타'
];

// 새로운 스타일 컴포넌트 추가
const BMIValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
`;

// 추가 버튼을 위한  스타일 컴포넌트
const SymptomAddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3730a3;
  }
  
  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

// 증상 선택 부분의 FormGroup 수정
const SymptomSelectGroup = styled(FormGroup)`
  .select-with-button {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    select {
      flex: 1;
    }
  }
`;

const SymptomSelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

// 카테고리 선택 그리드
const CategorySelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
`;

// 카테고리 폼 룹
const CategoryFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

// 선택된 증상 목록
const SelectedSymptomsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin: 0 0.5rem;
  
  &:empty::before {
    content: '선택된 증상이 없습니다';
    color: #a0aec0;
    font-size: 0.9rem;
  }
`;

const EmptyMessage = styled.div`
  color: #a0aec0;
  font-size: 0.9rem;
  padding: 0.5rem;
  text-align: center;
`;

// 스트레스/노동강도 옵션
const stressLevels = ['낮음', '보통', '높음', '매우 높음'];
const workIntensities = ['가벼움', '보통', '힘듦', '매우 힘듦'];

// 전체 컨테이너 스타일
const ModernFormContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

// 새로운 섹션 스타일
const ModernFormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// 새로운 섹션 타이틀 스타일
const ModernSectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a365d;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => {
    switch(props.type) {
      case '기본정보': return '#4361ee';
      case '증상선택': return '#7209b7';
      case '맥파분석': return '#f72585';
      case '복용약물': return '#4cc9f0';
      case '메모': return '#4895ef';
      default: return '#4361ee';
    }
  }};
`;

// 새로운 입 필드 스타일
const ModernInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    background: white;
  }
`;

// 새로운 선택 필드 스타일
const ModernSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    background: white;
  }
`;

// 새로운 버튼 스타일
const ModernButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #4361ee, #3730a3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.2);
  }
  
  &:disabled {
    background: linear-gradient(to right, #a5b4fc, #93c5fd);
    cursor: not-allowed;
    transform: none;
  }
`;

// 전화번호 하이픈 추가 함수
const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

// 주민등록번호 포맷팅 함수
const formatResidentNumber = (value) => {
  if (!value) return '';
  
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 하이픈 추가
  if (numbers.length <= 6) {
    return numbers;
  } else {
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
  }
};

// 주민등록번호로 성별 판단 함수
const getGenderFromResidentNumber = (number) => {
  if (!number || number.length < 8) return '';
  
  const genderDigit = number.replace('-', '').charAt(6);
  if (['1', '3', '5'].includes(genderDigit)) {
    return '남성';
  } else if (['2', '4', '6'].includes(genderDigit)) {
    return '여성';
  }
  return '';
};

// 기존 styled-components 영역에 RequiredMark 추가
const RequiredMark = styled.span`
  color: #ff4d4f;
  margin-left: 4px;
  font-weight: normal;
`;

// 기존 코드 내에 유효성 검사 함수 추가
const validateResidentNumber = (value) => {
  // 주민번호 형식: 6자리-7자리, 첫자리 1,2,3,4만 가능
  const pattern = /^\d{6}-[1-4]\d{6}$/;
  return pattern.test(value);
};

// 기존 validateResidentNumber 함수 아래에 연락처 검증 함수 추가
const validatePhoneNumber = (value) => {
  // 연락처 형식: 010-XXXX-XXXX
  const pattern = /^010-\d{4}-\d{4}$/;
  return pattern.test(value);
};

// 유효성 검사 함수들 추가
const validateVitalSigns = {
  수축기혈압: (value) => {
    const num = Number(value);
    if (num < 70 || num > 200) {
      return '수축기혈압은 70~200 사이여야 합니다.';
    }
    return '';
  },
  이완기혈압: (value) => {
    const num = Number(value);
    if (num < 40 || num > 130) {
      return '이완기혈압은 40~130 사이여야 합니다.';
    }
    return '';
  },
  맥박수: (value) => {
    const num = Number(value);
    if (num < 40 || num > 200) {
      return '맥박수는 40~200 사이여야 합니다.';
    }
    return '';
  }
};

// handleInputChange 함수 수정
const handleInputChange = (e, section, field, { setFormData }) => {
  const value = e.target.value;

  // 맥파분석 수치 검증
  if (section === '맥파분석' && validateVitalSigns[field]) {
    const errorMessage = validateVitalSigns[field](value);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
  }

  // 기존 검증 로직 유지
  if (field === '주민등록번호') {
    // ... 기존 주민등록번호 검증 코드 ...
  } 
  else if (field === '연락처') {
    // ... 기존 연락처 검증 코드 ...
  }

  setFormData(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
  }));
};

// 필수 입력값 검증 함수 수정
const validateRequiredFields = (data) => {
  const required = {
    기본정보: [
      '이름',
      '주민등록번호',
      '연락처',
      '성별',
      '신장',
      '체중',
      '성격'
    ],
    증상선택: [
      '스트레스수준',
      '노동강도'
    ],
    맥파분석: [
      '수축기혈압',
      '이완기혈압',
      '맥박수'
    ],
    복용약물: [
      '약물',
      '기호식품'
    ]
  };

  const errors = [];
  Object.entries(required).forEach(([section, fields]) => {
    fields.forEach(field => {
      // 배열인 경우 (약물, 기호식품, 증상)
      if (Array.isArray(data[section]?.[field])) {
        if (!data[section]?.[field]?.length) {
          errors.push(`${field}을(를) 하나 이상 선택해주세요.`);
        }
      } 
      // 일반 필드
      else if (!data[section]?.[field]) {
        errors.push(`${field}을(를) 입력해주세요.`);
      }
    });
  });

  // BMI 자동 계산이므로 검증에서 제외

  return errors;
};

function HealthInfoForm(props) {
  const {
    formData,
    setFormData,
    onSubmit,
    onReset,
    isValid,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedCategory,
    setSelectedCategory,
    증상카테고리
  } = props;

  useEffect(() => {
    if (!formData || !formData.기본정보) {
      return;
    }
  }, [formData]);

  // 증 제거 핸들러 추가
  const handleRemoveSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      증상선택: {
        ...prev.증상선택,
        증상: prev.증상선택?.증상.filter(symptom => symptom !== symptomToRemove)
      }
    }));
  };

  // 증상 추가 핸들러 추가
  const handleAddSymptom = (symptom) => {
    if (!symptom) return;

    setFormData(prev => ({
      ...prev,
      증상선택: {
        ...prev.증상선택,
        증상: [...(prev.증상선택?.증상 || []), symptom]
      }
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (e, level) => {
    const { value } = e.target;
    setSelectedCategory(prev => ({
      ...prev,
      [level]: value,
      ...(level === '대분류' ? { 중분류: '', 소분류: '' } : {}),
      ...(level === '중분류' ? { 소분류: '' } : {})
    }));
  };

  // 주민등록번호 입력 처리 함수 수정
  const handleResidentNumberChange = (e) => {
    const formattedNumber = formatResidentNumber(e.target.value);
    
    // 성별 판단 로직
    let gender = '';
    if (formattedNumber.length >= 8) {
      const genderDigit = formattedNumber.replace('-', '').charAt(6);
      if (['1', '3', '5'].includes(genderDigit)) {
        gender = '남성';
      } else if (['2', '4', '6'].includes(genderDigit)) {
        gender = '여성';
      }
    }
    
    // 상태 업데이트
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        주민등록번호: formattedNumber,
        성별: gender || prev.기본정보?.성별  // 성별이 판단되면 업데이트
      }
    }));
  };

  // 약물 목록을 1차원 배열로 변환
  const medicineList = 약물카테고리;

  // 약물 추가 핸들러 정
  const handleAddMedicine = (selectedMedicine) => {
    if (!selectedMedicine) return;
    
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        약물: Array.isArray(prev.복용약물?.약물) 
          ? prev.복용약물.약물.indexOf(selectedMedicine) === -1
            ? [...prev.복용약물.약물, selectedMedicine]
            : prev.복용약물.약물
          : [selectedMedicine]
      }
    }));
  };

  // 약물 제거 핸들러 수정
  const handleRemoveMedicine = (medicineToRemove) => {
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        약물: Array.isArray(prev.복용약물?.약물) 
          ? prev.복용약물.약물.filter(medicine => medicine !== medicineToRemove)
          : []
      }
    }));
  };

  // 기호식품 추가 핸들러
  const handleAddFavoriteItem = (selectedItem) => {
    if (!selectedItem) return;
    
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        기호식품: prev.복용약물?.기호식품?.includes(selectedItem)
          ? prev.복용약물.기호식품
          : [...(prev.복용약물?.기호식품 || []), selectedItem]
      }
    }));
  };

  // 기호식품 거 핸들러
  const handleRemoveFavoriteItem = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        기호식품: prev.복용약물?.기호식품?.filter(item => item !== itemToRemove) || []
      }
    }));
  };

  // 체중/신장 변경 핸들러는 컴포넌트 내부에서만 정의
  const handleInputChange = (e, section, field, { setFormData }) => {
    const value = e.target.value;

    // 주민등록번호 입력 시 유효성 검사
    if (field === '주민등록번호') {
      // 하이픈 자동 추가
      const formattedValue = value.replace(/(\d{6})(\d+)/, '$1-$2');
      
      if (value.length >= 13) {  // 입력이 완료되었을 때
        if (!validateResidentNumber(formattedValue)) {
          alert('올바른 주민등록번호 형식이 아닙니다.');
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: formattedValue
        }
      }));
    } else {
      // 기존 입력 처리 로직 유지
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  // 신장/체중 입력 처리 함수 수정
  const handleBodyInfoChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        [field]: value
      }
    }));
  };

  // 기본정보 입력 처리 함수
  const handleBasicInfoChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        [field]: value
      }
    }));
  };

  // 연락처 입력 처리 함수
  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        연락처: formattedNumber
      }
    }));
  };

  // 혈압/맥박 입력 처리 함수
  const handleVitalSignChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      맥파분석: {
        ...prev.맥파분석,
        [field]: value
      }
    }));
  };

  const handleMedicineSelect = (selectedMedicine) => {
    // "없음"이 선택된 경우 다른 모든 약물을 제거
    if (selectedMedicine === "없음") {
      setFormData(prev => ({
        ...prev,
        복용약물: {
          ...prev.복용약물,
          약물: ["없음"]
        }
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        약물: Array.isArray(prev.복용약물?.약물)
          ? prev.복용약물.약물.includes("없음")  // "없음"이 있었다면 제거
            ? [selectedMedicine]
            : prev.복용약물.약물.indexOf(selectedMedicine) === -1
              ? [...prev.복용약물.약물, selectedMedicine]
              : prev.복용약물.약물
          : [selectedMedicine]
      }
    }));
  };

  const renderContent = () => {
    if (!formData || !formData.기본정보) {
      return <div>Loading...</div>;
    }

    return (
      <ModernFormContainer>
        <FormSection>
          <SectionTitle type="기본정보">기본정보</SectionTitle>
          <FormGroup>
            <label>
              이름
              <RequiredMark>*</RequiredMark>
            </label>
            <Input
              type="text"
              value={formData.기본정보?.이름 || ''}
              onChange={(e) => handleInputChange(e, '기본정보', '이름', { setFormData })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>
              주민등록번호
              <RequiredMark>*</RequiredMark>
            </label>
            <Input
              type="text"
              value={formData.기본정보?.주민등록번호 || ''}
              onChange={(e) => handleInputChange(e, '기본정보', '주민등록번호', { setFormData })}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>연락처</label>
            <Input
              type="tel"
              value={formData.기본정보?.연락처 || ''}
              onChange={(e) => handleInputChange(e, '기본정보', '연락처', { setFormData })}
              placeholder="연락처를 입하세요"
              maxLength={13}  //  길이 설정 (010-1234-5678)
            />
          </FormGroup>

          <FormGroup>
            <label>성별</label>
            <SelectWrapper>
              <Select
                value={formData.기본정보?.성별 || ''}
                onChange={(e) => handleBasicInfoChange(e, '성별')}
                disabled={!!formData.기본정보?.주민등록번호}  // 주민번호 입력시 비활성화
              >
                <option value="">선택하세요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </Select>
            </SelectWrapper>
          </FormGroup>

          <BodyInfoContainer>
            <BodyInfoItem>
              <label>신장</label>
              <Input
                type="number"
                value={formData.기본정보?.신장 || ''}
                onChange={(e) => handleBasicInfoChange(e, '신장')}
                placeholder="cm"
              />
            </BodyInfoItem>
            
            <BodyInfoItem>
              <label>체중</label>
              <Input
                type="number"
                value={formData.기본정보?.체중 || ''}
                onChange={(e) => handleBasicInfoChange(e, '체중')}
                placeholder="kg"
              />
            </BodyInfoItem>
            
            <BodyInfoItem>
              <label>BMI 지수</label>
              <div className="bmi-container">
                <Input
                  type="text"
                  value={calculateBMIStatus(formData.기본정보?.신장, formData.기본정보?.체중).bmi}
                  readOnly
                  placeholder="BMI"
                  style={{ width: '80px' }}
                />
                <BMIStatusLabel status={calculateBMIStatus(formData.기본정보?.신장, formData.기본정보?.체중).status}>
                  {calculateBMIStatus(formData.기본정보?.신장, formData.기본정보?.체중).status}
                </BMIStatusLabel>
              </div>
            </BodyInfoItem>
          </BodyInfoContainer>

          {/* 성격 선택 필드 추가 */}
          <FormGroup>
            <label>
              성격
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Select
              name="성격"
              value={formData?.기본정보?.성격 || ''}
              onChange={(e) => handleInputChange(e, '성격')}
              required
              style={{ width: '200px' }}
            >
              <option value="">선택하세요</option>
              {personalityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormSection>

        {/* 증상 선택 섹션 */}
        <FormSection>
          <SectionTitle type="증상선택">증상 선택</SectionTitle>
          
          {/* 스트레스/노동강도 선택 */}
          <CategorySelectGrid>
            <CategoryFormGroup>
              <label>스트레스 수준</label>
              <Select
                value={formData.증상선택?.스트레스수준 || ''}
                onChange={(e) => handleInputChange(e, '증상선택', '스트레스수준')}
              >
                <option value="">선택하세요</option>
                {stressLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
            </CategoryFormGroup>

            <CategoryFormGroup>
              <label>노동강도</label>
              <Select
                value={formData.증상선택?.노동강도 || ''}
                onChange={(e) => handleInputChange(e, '증상선택', '노동강도')}
              >
                <option value="">선택하세요</option>
                {workIntensities.map(intensity => (
                  <option key={intensity} value={intensity}>{intensity}</option>
                ))}
              </Select>
            </CategoryFormGroup>
          </CategorySelectGrid>

          {/* 구분선 추가 */}
          <Divider />
          
          {/* 증상 카테고리 선택 */}
          <CategorySelectGrid>
            <CategoryFormGroup>
              <label>대분류</label>
              <Select
                value={selectedCategory.대분류 || ''}
                onChange={(e) => handleCategoryChange(e, '대분류')}
              >
                <option value="">선택하세요</option>
                {Object.keys(증상카테고리).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </CategoryFormGroup>

            <CategoryFormGroup>
              <label>중분류</label>
              <Select
                value={selectedCategory.중분류 || ''}
                onChange={(e) => handleCategoryChange(e, '중분류')}
                disabled={!selectedCategory.대분류}
              >
                <option value="">선택하세요</option>
                {selectedCategory.대분류 && 
                  Object.keys(증상카테고리[selectedCategory.대분류] || {}).map(subCategory => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
              </Select>
            </CategoryFormGroup>

            <CategoryFormGroup>
              <label>소분류</label>
              <Select
                value={selectedCategory.소분류 || ''}
                onChange={(e) => handleCategoryChange(e, '소분류')}
                disabled={!selectedCategory.중분류}
              >
                <option value="">선택하세요</option>
                {selectedCategory.중분류 && 
                  (증상카테고리[selectedCategory.대분류]?.[selectedCategory.중분류] || []).map(symptom => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
              </Select>
            </CategoryFormGroup>
          </CategorySelectGrid>

          <AddButtonContainer>
            <AddButton
              type="button"
              onClick={() => {
                if (selectedCategory.소분류) {
                  handleAddSymptom(selectedCategory.소분류);
                  setSelectedCategory(prev => ({
                    ...prev,
                    소분류: ''
                  }));
                }
              }}
              disabled={!selectedCategory.소분류}
            >
              증상 추가
            </AddButton>
          </AddButtonContainer>

          <SelectedSymptomsList>
            {(!formData.증상선택?.증상 || formData.증상선택.증상.length === 0) ? (
              <EmptyMessage>선택된 증상이 없습니다</EmptyMessage>
            ) : (
              formData.증상선택.증상.map((symptom, index) => (
                <SymptomTag key={index}>
                  {symptom}
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(symptom)}
                    aria-label={`${symptom} 제거`}
                  >
                    ×
                  </button>
                </SymptomTag>
              ))
            )}
          </SelectedSymptomsList>
        </FormSection>

        {/* 맥파분석 섹션 */}
        <FormSection>
          <SectionTitle type="맥파분석">맥파분석</SectionTitle>
          <FormGroup>
            <label>
              수축기혈압
              <RequiredMark>*</RequiredMark>
            </label>
            <Input
              type="number"
              value={formData.맥파분석?.수축기혈압 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석', '수축기혈압', { setFormData })}
              required
              min="70"
              max="200"
            />
          </FormGroup>
          <FormGroup>
            <label>
              이완기혈압
              <RequiredMark>*</RequiredMark>
            </label>
            <Input
              type="number"
              value={formData.맥파분석?.이완기혈압 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석', '이완기혈압', { setFormData })}
              required
              min="40"
              max="130"
            />
          </FormGroup>
          <FormGroup>
            <label>
              맥박수
              <RequiredMark>*</RequiredMark>
            </label>
            <Input
              type="number"
              value={formData.맥파분석?.맥박수 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석', '맥박수', { setFormData })}
              required
              min="40"
              max="200"
            />
          </FormGroup>
        </FormSection>

        {/* 복용약물 섹션 */}
        <FormSection>
          <SectionTitle type="복용약물">복용약물</SectionTitle>
          
          {/* 복용 중인 약물 선택 */}
          <FormGroup>
            <label>
              복용 중인 약물
              <RequiredMark>*</RequiredMark>
            </label>
            <Select
              value=""
              onChange={(e) => handleMedicineSelect(e.target.value)}
              required
            >
              <option value="">약물을 선택하세요</option>
              {약물카테고리.map((medicine) => (
                <option key={medicine} value={medicine}>
                  {medicine}
                </option>
              ))}
            </Select>
          </FormGroup>

          {/* 선택된 약물 목록 */}
          <SelectedMedicineList>
            {(!formData.복용약물?.약물 || formData.복용약물.약물.length === 0) ? (
              <div style={{ color: '#868e96' }}>선된 약물이 없습니다</div>
            ) : (
              formData.복용약물.약물.map((medicine, index) => (
                <MedicineTag key={index}>
                  {medicine}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(medicine)}
                    aria-label={`${medicine} 제거`}
                  >
                    ×
                  </button>
                </MedicineTag>
              ))
            )}
          </SelectedMedicineList>

          {/* 기호식품 선택 추가 */}
          <FormGroup style={{ marginTop: '20px' }}>
            <label>기호식품</label>
            <SelectWrapper>
              <StyledSelect
                onChange={(e) => handleAddFavoriteItem(e.target.value)}
                value=""
              >
                <option value="">기호식품을 선택하세요</option>
                {favoriteItems.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </StyledSelect>
            </SelectWrapper>
          </FormGroup>

          <SelectedMedicineList>
            {(!formData.복용약물?.기호식품 || formData.복용약물.기호식품?.length === 0) ? (
              <div style={{ color: '#868e96' }}>선택된 기호식품이 없니다</div>
            ) : (
              formData.복용약물.기호식품?.map((item, index) => (
                <MedicineTag key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavoriteItem(item)}
                    aria-label={`${item} 제거`}
                  >
                    ×
                  </button>
                </MedicineTag>
              ))
            )}
          </SelectedMedicineList>
        </FormSection>

        {/* 메모 섹션 */}
        <FormSection>
          <SectionTitle type="메모">메모</SectionTitle>
          <FormGroup className="memo-group">
            <TextArea
              value={typeof formData.메모 === 'string' ? formData.메모 : ''}
              onChange={(e) => handleInputChange(e, '메모')}
              placeholder="메모를 입력하세요"
            />
          </FormGroup>
        </FormSection>

        {/* 버튼 그룹 */}
        <ButtonGroup>
          <Button type="button" onClick={onReset} variant="secondary">
            초기화
          </Button>
          <Button 
            type="button" 
            onClick={() => {
              // 필수 입력값 검증
              const errors = validateRequiredFields(props.formData);
              if (errors.length > 0) {
                alert(`다음 항목을 확인해주세요:\n${errors.join('\n')}`);
                return;
              }

              // 저장 확인 다이얼로그
              const confirmed = window.confirm(
                '입력하신 정보를 저장하시겠습니까?\n\n' +
                '- 기본정보 (이름, 주민번호 등)\n' +
                '- 증상선택 (스트레스, 노동강도 등)\n' +
                '- 맥파분석 (혈압, 맥박)\n' +
                '- 복용약물 (약물, 기호식품)'
              );
              
              if (!confirmed) return;

              try {
                props.onSubmit(props.formData);
                alert('성공적으로 저장되었습니다.');
              } catch (error) {
                alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('저장 오류:', error);
              }
            }}
            variant="primary"
          >
            저장
          </Button>
        </ButtonGroup>
      </ModernFormContainer>
    );
  };

  return renderContent();
}

HealthInfoForm.defaultProps = {
  formData: {
    기본정보: {
      이름: '',
      연락처: '',
      주민등록번호: '',  // 생년월일 대신 주민등록번호로 변경
      성별: '',
      신장: '',
      체중: '',
      BMI: '',
      성격: '' // 성격 필드 추가
    },
    맥파분석: {},
    메모: '',
    복용약: {
      약물: [],
      기호식품: []  // 기호식품 배열 추가
    }
  },
  selectedSymptoms: [],
  selectedCategory: {
    대분류: '',
    중분류: '',
    소분류: ''
  },
  validationErrors: {},
  증상카테고리: {}
};

// 타일 컴포넌트 추가
const BMIStatus = styled.span`
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background-color: ${props => {
    switch (props.status) {
      case '과도한 저체중': return '#ff6b6b';
      case '저체중': return '#ffd43b';
      case '정상': return '#51cf66';
      case '과체중': return '#ffd43b';
      case '비만': return '#ff922b';
      case '고도비만': return '#ff6b6b';
      default: return '#868e96';
    }
  }};
`;

// 구분선 스타일 추가
const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 1rem 0.5rem;
`;

export default HealthInfoForm;