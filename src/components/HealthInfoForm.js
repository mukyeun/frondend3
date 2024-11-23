import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { 약물카테고리 } from '../data/MedicineCategories.js';
import { 증상카테고리 } from '../data/SymptomCategories';
import { getHealthInfoList } from '../api/healthInfo';
import { calculateBMI, calculateBMIStatus } from '../utils/bmiCalculator';
import { 
  formatPhoneNumber, 
  formatResidentNumber, 
  getGenderFromResidentNumber 
} from '../utils/formatters';
import { 
  personalityOptions, 
  levelOptions, 
  favoriteItems,
  stressLevels,
  workIntensities 
} from '../constants/healthInfo';
import { useNavigate } from 'react-router-dom';
import { createHealthInfo } from '../api/healthInfo';
import { validateHealthInfo } from '../utils/validation';
import ValidationMessage from './common/ValidationMessage';

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
  align-items: start;
  margin-bottom: 1rem;
  gap: 0.5rem;
  padding: 0 0.5rem;

  &.memo-group {
    display: block;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
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

const ValidationText = styled.div`
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

// BMI 관련  컴포넌트들
const BMIDisplay = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BMIStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  margin-left: 8px;
  background-color: ${props => {
    switch (props.status) {
      case '저체중': return '#ffd43b';
      case '정상': return '#51cf66';
      case '과체중': return '#ff922b';
      case '비만': return '#ff6b6b';
      case '고도비만': return '#c92a2a';
      default: return '#868e96';
    }
  }};
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

// 새로운 섹션 이틀 스타일
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

// 구분선 스타일 추가
const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 1rem 0.5rem;
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

// 추가 버튼 컨테이너
const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
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

// 빈 메시지
const EmptyMessage = styled.div`
  color: #a0aec0;
  font-size: 0.9rem;
  padding: 0.5rem;
  text-align: center;
`;

// BMI 상태 계산 함수
const getBMIStatus = (bmi) => {
  const numBMI = parseFloat(bmi);
  if (isNaN(numBMI)) return '';
  
  if (numBMI < 18.5) return '저체중';
  if (numBMI < 23) return '정상';
  if (numBMI < 25) return '과체중';
  if (numBMI < 30) return '비만';
  return '고도비만';
};

function HealthInfoForm({ 
  formData, 
  setFormData, 
  증상카테고리,
  id
}) {
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const navigate = useNavigate();

  // initialFormData 정의
  const initialFormData = {
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
    맥파분석: {
      수축기혈압: '',
      이완기혈압: '',
      맥박수: ''
    },
    증상선택: {
      증상: []
    },
    복용약물: {
      약물: [],
      기호식품: []
    },
    메모: ''
  };

  // state 선언들
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSymptomCategory, setSelectedSymptomCategory] = useState({
    대분류: '',
    중분류: '',
    증상: ''
  });
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  // 증상 관련 핸들러들
  const handleAddSymptom = (symptom) => {
    if (!symptom) return;
    
    setFormData(prev => ({
      ...prev,
      증상선택: {
        ...prev.증상선택,
        증상: Array.isArray(prev.증상선택?.증상) 
          ? [...prev.증상선택.증상, symptom]
          : [symptom]
      }
    }));
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      증상선택: {
        ...prev.증상선택,
        증상: prev.증상선택?.증상.filter(symptom => symptom !== symptomToRemove) || []
      }
    }));
  };

  // handleSubmit 함수는 다른 이벤트 핸들러들 다음에 위치
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await createHealthInfo(formData);
      alert('성공적으로 저장되었습니다.');
      navigate('/health-info-list');
    } catch (error) {
      console.error('저장 실패:', error);
      alert(`저장 중 오류가 발생했습니다:\n${error.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // useEffect 수정 (loadData 호출 부분 제거)
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getHealthInfoList(id);
        setFormData(prevState => ({
          ...initialFormData, // 초기 상태를 기반으로
          ...data,
          기본정보: { ...initialFormData.기본정보, ...data?.기본정보 },
          맥파분석: { ...initialFormData.맥파분석, ...data?.맥파분석 },
          증상선택: { ...initialFormData.증상선택, ...data?.증상선택 },
          복용약물: { 
            약물: data?.복용약물?.약물 || [],
            기호식품: data?.복용약물?.기호식품 || []
          },
          메모: data?.메모 || ''
        }));
      } catch (error) {
        setLoadError(error.message);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData(); // useEffect 내부에서만 호출
  }, [id]);

  // 폼 초기화 함수
  const resetForm = () => {
    // 모 입력 필드 초기화
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.tagName === 'TEXTAREA') {
          input.value = '';
        } else if (input.type === 'select-one') {
          input.selectedIndex = 0;
        }
      });
    }
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
    
    // 상 업데이트
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        주민등록번호: formattedNumber,
        성별: gender || prev.기본정보?.별  // 성별이 판단되면 업이트
      }
    }));
  };

  // 약물 목록을 1원 배열로 변환
  const medicineList = 약물카테고리;

  // 약물 추가 핸들러 수정
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

  // 호식품 추가 들러
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

  // 성격, 스트레스, 노동강도 처리를 위한 handleFormInputChange 함수 수정
  const handleFormInputChange = (e, field, subField) => {
    const { value } = e.target;
    
    if (field === '성격' || field === '스트레스' || field === '노동강도') {
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          [field]: value
        }
      }));
    } else if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // BMI 계산 함수 수정
  const handleBodyInfoChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => {
      const newFormData = {
        ...prev,
        기본정보: {
          ...prev.기본정보,
          [field]: value
        }
      };

      // 신장과 체중이 모두 있을 때 BMI 동 계산
      if (newFormData.기본정보.신장 && newFormData.기본정보.체중) {
        const height = parseFloat(newFormData.기본정보.신장) / 100; // cm를 m로 변환
        const weight = parseFloat(newFormData.기본정보.체중);
        const bmi = (weight / (height * height)).toFixed(1);
        newFormData.기본정보.BMI = bmi;
      }

      return newFormData;
    });
  };

  // 기본정보 입력 처리 함수
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        [name]: value
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

  // 맥파분석 입력 처리 함수 수정
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

  // 로딩 중 표시
  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  // 에러 표시
  if (loadError) {
    return <div>에러: {loadError}</div>;
  }

  // handleInputChange 함수 정의
  const handleInputChange = (e, section, subField) => {
    const { name, value } = e.target;
    
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subField]: value
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // handleReset 함수 수정
  const handleReset = () => {
    // 사용자 확인
    if (window.confirm('입력한 내용이 모두 초기화됩니다. 계속하시겠습니까?')) {
      const initialState = {
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
        맥파분석: {
          수축기혈압: '',
          이완기혈압: '',
          맥박수: ''
        },
        증상선택: {
          증: []
        },
        복용약물: {
          약물: [],
          기호식품: []
        },
        메모: ''
      };

      setFormData(initialState);
      setValidationErrors({});
      
      // 첫 번째 입력 필드로 포커스 이동
      const firstInput = document.querySelector('input[name="이름"]');
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  // 키드 이벤트 핸들러 추가
  const handleKeyPress = (e) => {
    // Enter 키로 다음 필드로 이동
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = formRef.current.querySelectorAll(
        'input:not([type="hidden"]), select, textarea'
      );
      const index = Array.from(inputs).indexOf(e.target);
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  const renderContent = () => {
    if (!formData || !formData.기본정보) {
      return <div>Loading...</div>;
    }

    const bmiResult = calculateBMI(
      parseFloat(formData.기본정보.체중), 
      parseFloat(formData.기본정보.신장)
    );

    return (
      <FormContainer ref={formRef}>
        <FormSection>
          <SectionTitle type="기본정보">기본 정보</SectionTitle>
          
          <FormGroup>
            <label>이름<RequiredLabel>*</RequiredLabel></label>
            <div className="input-container">
              <Input
                ref={nameInputRef}
                type="text"
                name="이름"
                value={formData.기본정보?.이름 || ''}
                onChange={handleBasicInfoChange}
                onKeyPress={handleKeyPress}
                placeholder="이름을 입력하세요"
              />
              {validationErrors.이름 && (
                <ValidationMessage type="error" message={validationErrors.이름} />
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <label>연락처<RequiredLabel>*</RequiredLabel></label>
            <div className="input-container">
              <Input
                type="tel"
                name="연락처"
                value={formData.기본정보?.연락처 || ''}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                placeholder="연락처를 입력하세요"
                maxLength={13}
              />
              {validationErrors.연락처 && (
                <ValidationMessage type="error" message={validationErrors.연락처} />
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <label>주민등록번호<RequiredLabel>*</RequiredLabel></label>
            <div className="input-container">
              <Input
                type="text"
                name="주민등록번호"
                value={formData.기본정보?.주민등록번호 || ''}
                onChange={handleResidentNumberChange}
                onKeyPress={handleKeyPress}
                placeholder="주민등록번호를 입력하세요"
                maxLength={14}
              />
              {validationErrors.주민등록번호 && (
                <ValidationMessage type="error" message={validationErrors.주민등록번호} />
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <label>성별</label>
            <Select
              value={formData.기본정보?.성별 || ''}
              onChange={(e) => handleBasicInfoChange(e, '성별')}
              disabled={!!formData.기본정보?.주민등록번호}
            >
              <option value="">선택하세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <label>성격</label>
            <Select
              name="성격"
              value={formData.기본정보?.성격 || ''}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  기본정보: {
                    ...prev.기본정보,
                    성격: e.target.value
                  }
                }));
              }}
            >
              <option value="">선택하세요</option>
              <option value="매우급함">매우급함</option>
              <option value="급함">급함</option>
              <option value="원만">원만</option>
              <option value="느긋">느긋</option>
              <option value="매우느긋">매우느긋</option>
            </Select>
          </FormGroup>

          <BodyInfoContainer>
            <BodyInfoItem>
              <label>신장</label>
              <Input
                type="number"
                value={formData.기본정보?.신장 || ''}
                onChange={(e) => handleBodyInfoChange(e, '신장')}
                placeholder="cm"
              />
            </BodyInfoItem>
            
            <BodyInfoItem>
              <label>체중</label>
              <Input
                type="number"
                value={formData.기본정보?.체중 || ''}
                onChange={(e) => handleBodyInfoChange(e, '체중')}
                placeholder="kg"
              />
            </BodyInfoItem>
            
            <BodyInfoItem>
              <label>BMI 지수</label>
              <div className="bmi-container">
                <Input
                  type="text"
                  value={
                    formData.기본정보?.신장 && formData.기본정보?.체중
                      ? (formData.기본정보.체중 / Math.pow(formData.기본정보.신장 / 100, 2)).toFixed(1)
                      : ''
                  }
                  readOnly
                  placeholder="BMI"
                  style={{ width: '80px' }}
                />
                {formData.기본정보?.신장 && formData.기본정보?.체중 && (
                  <BMIStatus 
                    status={getBMIStatus((formData.기본정보.체중 / Math.pow(formData.기본정보.신장 / 100, 2)).toFixed(1))}
                  >
                    {getBMIStatus((formData.기본정보.체중 / Math.pow(formData.기본정보.신장 / 100, 2)).toFixed(1))}
                  </BMIStatus>
                )}
              </div>
            </BodyInfoItem>
          </BodyInfoContainer>
        </FormSection>

        <FormSection>
          <SectionTitle type="맥파분석">맥파분석</SectionTitle>
          <BodyInfoContainer>
            <BodyInfoItem>
              <label>수축기혈압<RequiredLabel>*</RequiredLabel></label>
              <div className="input-container">
                <Input
                  type="number"
                  name="수축기혈압"
                  value={formData.맥파분석?.수축기혈압 || ''}
                  onChange={(e) => handleVitalSignChange(e, '수축기혈압')}
                  onKeyPress={handleKeyPress}
                  placeholder="mmHg"
                />
                {validationErrors.수축기혈압 && (
                  <ValidationMessage type="error" message={validationErrors.수축기혈압} />
                )}
              </div>
            </BodyInfoItem>

            <BodyInfoItem>
              <label>이완기혈압<RequiredLabel>*</RequiredLabel></label>
              <div className="input-container">
                <Input
                  type="number"
                  name="이완기혈압"
                  value={formData.맥파분석?.이완기혈압 || ''}
                  onChange={(e) => handleVitalSignChange(e, '이완기혈압')}
                  onKeyPress={handleKeyPress}
                  placeholder="mmHg"
                />
                {validationErrors.이완기혈압 && (
                  <ValidationMessage type="error" message={validationErrors.이완기혈압} />
                )}
              </div>
            </BodyInfoItem>

            <BodyInfoItem>
              <label>맥박수</label>
              <Input
                type="number"
                name="맥박수"
                value={formData.맥파분석?.맥박수 || ''}
                onChange={(e) => handleVitalSignChange(e, '맥박수')}
                onKeyPress={handleKeyPress}
                placeholder="회/분"
              />
            </BodyInfoItem>
          </BodyInfoContainer>
        </FormSection>

        {/* 증상선택 섹션 */}
        <FormSection>
          <SectionTitle type="증상선택">증상 선택</SectionTitle>
          
          {/* 스트레스/노동강도 선택 */}
          <CategorySelectGrid>
            <CategoryFormGroup>
              <label>스트레스 수준</label>
              <Select
                value={formData.기본정보?.스트레스 || ''}
                onChange={(e) => handleFormInputChange(e, '스트레스')}
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
                value={formData.기본정보?.노동강도 || ''}
                onChange={(e) => handleFormInputChange(e, '노동강도')}
              >
                <option value="">선택하세요</option>
                {workIntensities.map(intensity => (
                  <option key={intensity} value={intensity}>{intensity}</option>
                ))}
              </Select>
            </CategoryFormGroup>
          </CategorySelectGrid>

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
              onClick={() => {
                if (selectedCategory.소분류) {
                  handleAddSymptom(selectedCategory.소분류);
                  setSelectedCategory(prev => ({ ...prev, 소분류: '' }));
                }
              }}
              disabled={!selectedCategory.소분류}
            >
              증상 추가
            </AddButton>
          </AddButtonContainer>

          {/* 선택된 증상 목록 */}
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

        {/* 복용약물 섹션 */}
        <FormSection>
          <SectionTitle type="복용약물">복용약물</SectionTitle>
          
          {/* 복용 인 약물 선택 */}
          <FormGroup>
            <label>복용 중인 약물</label>
            <SelectWrapper>
              <StyledSelect
                onChange={(e) => handleAddMedicine(e.target.value)}
                value=""
              >
                <option value="">약물을 선택하요</option>
                {약물카테고리.map((medicine) => (
                  <option key={medicine} value={medicine}>
                    {medicine}
                  </option>
                ))}
              </StyledSelect>
            </SelectWrapper>
          </FormGroup>

          {/* 선택된 약물 목록 */}
          <SelectedMedicineList>
            {(!formData.복용약물?.약물 || formData.복용약물.약물.length === 0) ? (
              <div style={{ color: '#868e96' }}>선택된 약물이 없습니다</div>
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
                <option value="">기호품을 선택하세요</option>
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
              <div style={{ color: '#868e96' }}>선택된 기호식품이 없습니다</div>
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
              onChange={(e) => handleFormInputChange(e, '메모')}
              onKeyPress={handleKeyPress}
              placeholder="메모를 입력하세요"
            />
          </FormGroup>
        </FormSection>

        {/* 버튼 그룹 */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            초기화
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            저장
          </button>
        </div>
      </FormContainer>
    );
  };

  return renderContent();
}

HealthInfoForm.defaultProps = {
  formData: {
    기본정: {
      이름: '',
      연락처: '',
      주민등록번호: '',
      성별: '',
      신장: '',
      체중: '',
      BMI: '',
      성격: ''
    },
    맥파분석: {},
    메모: '',
    복용약물: {
      약물: [],
      기호식품: []
    }
  },
  selectedSymptoms: [],
  selectedCategory: {
    대분류: '',
    중분류: '',
    소분류: ''
  },
  증상카테고리: {},
  id: null
};

export default HealthInfoForm;