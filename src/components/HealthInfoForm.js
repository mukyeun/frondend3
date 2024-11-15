import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { 약물카테고리 } from '../data/MedicineCategories.js';

// 스타일 컴포넌트들을 파일 상단에 모아서 선언
const FormContainer = styled.div`
  max-width: 800px;
  margin: 1.5rem auto;
  padding: 0 20px;
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding: 0.5rem 1rem;
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
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;

  label {
    color: #2d3748;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4a5568;
  
  &::placeholder {
    color: #a0aec0;
  }
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const CategorySelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  label {
    color: #2d3748;
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-block;
    margin-right: 0.5rem;
  }
`;

const CategoryFormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;

  label {
    color: #2d3748;
    font-size: 0.9rem;
    font-weight: 600;
    margin-right: 0.5rem;
  }

  select {
    flex: 1;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4a5568;
  margin-top: 0.25rem;
  
  option {
    color: #4a5568;
  }
  
  &:disabled {
    background-color: #f7fafc;
    color: #a0aec0;
  }
`;

const SelectedSymptomsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 3rem;
  background: #f8fafc;
`;

const SymptomTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a5568;
  transition: all 0.2s;
  
  button {
    background: none;
    border: none;
    margin-left: 0.5rem;
    color: #a0aec0;
    cursor: pointer;
    padding: 0 0.25rem;
    font-size: 1.1rem;
    
    &:hover {
      color: #e53e3e;
    }
  }
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #4a5568;
  resize: vertical;
  
  &::placeholder {
    color: #a0aec0;
  }
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

// BMI 관련 함수들은 컴포넌트 외부에 선언
const getBmiStatus = (bmi) => {
  if (bmi < 16) return '과도한 저체중';
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '비만';
  return '고도비만';
};

const calculateBMI = (weight, height) => {
  if (!weight || !height) return '';
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  return bmi;
};

// 성격 ���션 배열 추가 (컴포넌트 외부에 선언)
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

// 기호식품 옵션 배열 추가 (컴포넌트 외부에 선언)
const favoriteItems = [
  '술',
  '담배',
  '커피',
  '마약',
  '기타'
];

// 새로운 스타일 컴포넌트 추가
const BodyInfoContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const BodyInfoItem = styled.div`
  flex: 1;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 4px 6px rgba(74, 144, 226, 0.1);
  }

  label {
    display: block;
    color: #2d3748;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 0.4rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: #4A90E2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
  }
`;

const BMIValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
`;

// 추가 버튼을 위한 새로운 스타일 컴포넌트
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

function HealthInfoForm(props) {
  const {
    formData = {},
    setFormData,
    selectedSymptoms = [],
    setSelectedSymptoms = () => {},
    selectedCategory = {},
    setSelectedCategory = () => {},
    onSubmit = () => {},
    onReset = () => {},
    isValid = false,
    validationErrors = {},
    증상카테고리 = {}
  } = props;

  useEffect(() => {
    if (!formData || !formData.기본정보) {
      return;
    }
  }, [formData]);

  // 증 제거 핸들러 추가
  const handleRemoveSymptom = (symptomToRemove) => {
    setSelectedSymptoms(prev => 
      prev.filter(symptom => symptom !== symptomToRemove)
    );
  };

  // 증상 추가 핸들러 추가
  const handleAddSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => [...prev, symptom]);
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

  // 주민등록번호로 성별 결정하는 함수
  const determineGender = (residentNumber) => {
    if (!residentNumber || residentNumber.length < 8) return '';
    
    const genderDigit = residentNumber.replace('-', '').charAt(6);
    return ['1','3','5','7'].includes(genderDigit) ? '' : 
           ['2','4','6','8'].includes(genderDigit) ? '여' : '';
  };

  // 주민등록번호 입력 핸들러
  const handleResidentNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    
    // 형식화된 주민등록번호 (하이픈 추가)
    const formattedValue = value.length > 6 
      ? `${value.slice(0, 6)}-${value.slice(6)}`
      : value;

    // 주민등록번호와 성별 동시 업데이트
    setFormData(prev => ({
      ...prev,
      기본정보: {
        ...prev.기본정보,
        주민등록번호: formattedValue,
        성별: value.length >= 7 ? determineGender(formattedValue) : prev.기본정보.성별
      }
    }));
  };

  // 약물 목록을 1차원 배열로 변환
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

  // 기호식품 제거 핸들러
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
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    
    if (field === '체중' || field === '신장') {
      const weight = field === '체중' ? value : formData.기본정보.체중;
      const height = field === '신장' ? value : formData.기본정보.신장;
      const bmi = calculateBMI(weight, height);
      
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          [field]: value,
          BMI: bmi
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          [field]: value
        }
      }));
    }
  };

  const renderContent = () => {
    if (!formData || !formData.기본정보) {
      return <div>Loading...</div>;
    }

    return (
      <FormContainer>
        <FormSection>
          <SectionTitle type="기본정보">기본 정보</SectionTitle>
          
          {/* 이름 입력 필드 추가 */}
          <FormGroup>
            <label>
              이름
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="text"
              name="이름"
              value={formData.기본정보?.이름 || ''}
              onChange={(e) => handleInputChange(e, '이름')}
              placeholder="이름을 입력하세요"
              required
              style={{ width: '200px' }}
            />
          </FormGroup>

          {/* 연락처 입력 필드 추가 */}
          <FormGroup>
            <label>
              연락처
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="tel"
              name="연락처"
              value={formData.기본정보?.연락처 || ''}
              onChange={(e) => {
                // 숫자와 이픈만 입력 가능하도록
                const value = e.target.value.replace(/[^0-9-]/g, '');
                // 자동으로 하이픈 추가
                const formattedValue = value
                  .replace(/[^0-9]/g, '')
                  .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
                  .replace(/(\-{1,2})$/g, "");
                
                handleInputChange({ target: { value: formattedValue } }, '연락처');
              }}
              placeholder="예: 010-1234-5678"
              required
              style={{ width: '200px' }}
            />
          </FormGroup>

          {/* 주민등록번호 입력 필드 */}
          <FormGroup>
            <label>
              주민등록번호
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="text"
              name="주민등록번호"
              value={formData.기본정보?.주민등록번호 || ''}
              onChange={handleResidentNumberChange}
              placeholder="예: 000000-0000000"
              maxLength="14"
              required
              style={{ width: '200px' }}
            />
          </FormGroup>

          {/* 성 필드 */}
          <FormGroup>
            <label>
              성별
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="text"
              name="성별"
              value={formData.기본정보?.성별 || ''}
              readOnly
              style={{ 
                width: '100px',
                backgroundColor: '#f8f9fa',
                cursor: 'not-allowed'
              }}
            />
          </FormGroup>

          {/* 신장, 체중, BMI를 한 줄로 정렬 */}
          <BodyInfoContainer>
            <BodyInfoItem>
              <label>
                신장(cm)
                <RequiredLabel>*</RequiredLabel>
              </label>
              <Input
                type="number"
                name="신장"
                value={formData.기본정보?.신장 || ''}
                onChange={(e) => handleInputChange(e, '신장')}
                placeholder="예: 170"
                required
              />
            </BodyInfoItem>

            <BodyInfoItem>
              <label>
                체중(kg)
                <RequiredLabel>*</RequiredLabel>
              </label>
              <Input
                type="number"
                name="체중"
                value={formData.기본정보?.체중 || ''}
                onChange={(e) => handleInputChange(e, '체중')}
                placeholder="예: 65"
                required
              />
            </BodyInfoItem>

            <BodyInfoItem>
              <label>BMI</label>
              <Input
                type="text"
                value={formData.기본정보?.BMI || ''}
                readOnly
                placeholder="BMI 자동계산"
              />
              {formData.기본정보?.BMI && (
                <BMIValue>
                  <span>상태:</span>
                  <BMIStatus status={getBmiStatus(parseFloat(formData.기본정보.BMI))}>
                    {getBmiStatus(parseFloat(formData.기본정보.BMI))}
                  </BMIStatus>
                </BMIValue>
              )}
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
              value={formData.기본정보?.성격 || ''}
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
          
          {/* 스트레스/노동 레벨 그리드 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* 스트레스 레벨 선택 필드 */}
            <FormGroup>
              <label>
                스트레스 수준
                <RequiredLabel>*</RequiredLabel>
              </label>
              <Select
                name="스트레스"
                value={formData.증상선택?.스트레스 || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  증상선택: {
                    ...prev.증상선택,
                    스트레스: e.target.value
                  }
                }))}
                required
              >
                <option value="">선택하세요</option>
                {levelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* 노동 강도 선택 필드 추가 */}
            <FormGroup>
              <label>
                노동 강도
                <RequiredLabel>*</RequiredLabel>
              </label>
              <Select
                name="노동"
                value={formData.증상선택?.노동 || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  증상선택: {
                    ...prev.증상선택,
                    노동: e.target.value
                  }
                }))}
                required
              >
                <option value="">선택세요</option>
                {levelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </div>

          {/* 증상 선택 그리드 */}
          <SymptomSelectContainer>
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
              <SymptomAddButton
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
              </SymptomAddButton>
            </AddButtonContainer>
          </SymptomSelectContainer>

          {/* 선택된 증상 목록 */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#666' }}>선택된 증상</label>
            <SelectedSymptomsList>
              {selectedSymptoms.length === 0 ? (
                <div style={{ color: '#868e96' }}>선택된 증상이 없습니다</div>
              ) : (
                selectedSymptoms.map((symptom, index) => (
                  <SymptomTag key={index}>
                    {symptom}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSymptom(symptom)}
                      aria-label={`${symptom} 제거`}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#868e96',
                        cursor: 'pointer',
                        padding: '0 5px',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </SymptomTag>
                ))
              )}
            </SelectedSymptomsList>
          </div>
        </FormSection>

        {/* 맥파분석 섹션 */}
        <FormSection>
          <SectionTitle type="맥파분석">맥파분석</SectionTitle>
          <FormGroup>
            <label>
              수축기혈압
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="number"
              name="수축기혈압"
              value={formData.맥파분석?.수축기혈압 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석')}
              placeholder="예: 120"
              required
              style={{ width: '100px' }}
            />
          </FormGroup>

          <FormGroup>
            <label>
              이완기혈압
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="number"
              name="이완기혈압"
              value={formData.맥파분석?.이완기혈압 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석')}
              placeholder="예: 80"
              required
              style={{ width: '100px' }}
            />
          </FormGroup>

          <FormGroup>
            <label>
              맥박수
              <RequiredLabel>*</RequiredLabel>
            </label>
            <Input
              type="number"
              name="맥박수"
              value={formData.맥파분석?.맥박수 || ''}
              onChange={(e) => handleInputChange(e, '맥파분석')}
              placeholder="예: 75"
              required
              style={{ width: '100px' }}
            />
          </FormGroup>
        </FormSection>

        {/* 복용약물 섹션 */}
        <FormSection>
          <SectionTitle type="복용약물">복용약물</SectionTitle>
          
          {/* 복용 중인 약물 선택 */}
          <FormGroup>
            <label>복용 중인 약물</label>
            <SelectWrapper>
              <StyledSelect
                onChange={(e) => handleAddMedicine(e.target.value)}
                value=""
              >
                <option value="">약물을 선택하세요</option>
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
          <TextArea
            name="내용"
            value={formData.메모?.내용 || ''}
            onChange={(e) => handleInputChange(e, '메모')}
            placeholder="추가적인 증상이나 특이사항을 입력하세요."
            rows={4}
          />
        </FormSection>

        {/* 버튼 그룹 */}
        <ButtonGroup>
          <Button type="button" onClick={onReset} variant="secondary">
            초기화
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit} 
            variant="primary"
            disabled={!isValid}
          >
            저장
          </Button>
        </ButtonGroup>
      </FormContainer>
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
    메모: {},
    복용약물: {
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
      case '고도��만': return '#ff6b6b';
      default: return '#868e96';
    }
  }};
`;

export default HealthInfoForm;