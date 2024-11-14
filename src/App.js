import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { saveData, searchData } from './services/dataService';
import { validateHealthInfo } from './utils/validation';
import SearchModal from './components/SearchModal';
import { 증상카테고리 } from './data/SymptomCategories';
import LoginPage from './components/LoginPage';
import styled from 'styled-components';

// 스타일 컴포넌트 정의
const Section = styled.div`
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const SectionHeader = styled.div`
  padding: 10px 15px;
  color: white;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  
  &.blue { background: #4A90E2; }
  &.green { background: #7ED321; }
  &.red { background: #D0021B; }
  &.purple { background: #9013FE; }
`;

const SectionContent = styled.div`
  padding: 20px;
  background: #F8F9FA;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h1 {
    margin: 0;
    font-size: 24px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #4A90E2;
  cursor: pointer;
  font-size: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#4A90E2' : '#333'};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const FormGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
`;

const Label = styled.label`
  color: #495057;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #DDE2E5;
  border-radius: 4px;
  
  &:focus {
    border-color: #4A90E2;
    outline: none;
  }
`;

const ShortInput = styled(Input)`
  width: 80px;
  flex: none;
`;

const UnitText = styled.span`
  color: #495057;
`;

const BMIText = styled.span`
  color: #495057;
  margin-left: 10px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #DDE2E5;
  border-radius: 4px;
  min-width: 120px;
  
  &:focus {
    border-color: #4A90E2;
    outline: none;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #495057;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const VitalSignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 10px 0;
`;

const VitalSignItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VitalSignLabel = styled.label`
  color: #495057;
  font-size: 14px;
`;

const VitalSignInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VitalSignInput = styled.input`
  width: 80px;
  padding: 8px;
  border: 1px solid #DDE2E5;
  border-radius: 4px;
  text-align: center;
  
  &:focus {
    border-color: #7ED321;
    outline: none;
  }
`;

const VitalSignUnit = styled.span`
  color: #495057;
  font-size: 14px;
`;

const SymptomSelectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SymptomSelectGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const SymptomActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #DDE2E5;
`;

const MemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MemoTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #DDE2E5;
  border-radius: 4px;
  resize: none;
  
  &:focus {
    border-color: #9013FE;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  
  &.blue {
    background: #4A90E2;
    &:hover { background: #357ABD; }
  }
  
  &.green {
    background: #7ED321;
    &:hover { background: #6BB01E; }
  }
  
  &.cyan {
    background: #50E3C2;
    &:hover { background: #3CC8A8; }
  }
  
  &.red {
    background: #D0021B;
    &:hover { background: #B00016; }
  }
`;

// 선택된 증상을 보여주는 스타일 컴포넌트 추가
const SelectedSymptom = styled.div`
  display: inline-flex;
  align-items: center;
  background: #F1F3F5;
  padding: 5px 10px;
  border-radius: 4px;
  margin: 5px;
  font-size: 14px;

  button {
    background: none;
    border: none;
    margin-left: 5px;
    cursor: pointer;
    color: #868E96;
  }
`;

const SelectedSymptomsList = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #DDE2E5;
`;

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    기본정보: {
      이름: '',
      주민번호: '',
      연락처: '',
      신체정보: {
        신장: '',
        체중: ''
      },
      성격: '',
      독용여부: '',
      고지혈증여부: false,
      기초체력: '',
      운동량: '',
      스트레스: ''
    },
    맥파분석: {
      수축기혈압: '',
      이완기혈압: '',
      맥박수: ''
    },
    증상: [],
    메모: ''
  });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          localStorage.setItem('token', data.data.token);
          setIsLoggedIn(true);
          navigate('/');
        } else {
          setMessage('로그인 실패: ' + data.message);
        }
      } else {
        setMessage('서버 오류가 발생했습니다.');
      }
    } catch (error) {
      setMessage('네트워크 오류가 발생했습니다.');
    }
  };

  const handleInputChange = (e, category, subcategory = null) => {
    const { name, value } = e.target;
    
    if (subcategory) {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subcategory]: {
            ...prev[category][subcategory],
            [name]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateHealthInfo(formData);
    if (!validationResult.isValid) {
      setMessage(validationResult.message);
      return;
    }

    try {
      const result = await saveData(formData);
      if (result.success) {
        setMessage('저장되었습니다.');
      } else {
        setMessage('저장 실패: ' + result.message);
      }
    } catch (error) {
      setMessage('저장 중 오류가 발생했습니다.');
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      const results = await searchData(searchTerm);
      setSearchResults(results);
    } catch (error) {
      setMessage('검색 중 오류가 발생했습니다.');
    }
  };

  const handleSymptomSelect = (대분류, 중분류, 소분류) => {
    const newSymptom = { 대분류, 중분류, 소분류 };
    const isDuplicate = selectedSymptoms.some(
      symptom =>
        symptom.대분류 === 대분류 &&
        symptom.중분류 === 중분류 &&
        symptom.소분류 === 소분류
    );
    
    if (!isDuplicate) {
      setSelectedSymptoms(prev => [...prev, newSymptom]);
    }
  };

  const handleRemoveSymptom = (index) => {
    setSelectedSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const calculateBMI = () => {
    const 신장 = parseFloat(formData.기본정보.신체정보.신장);
    const 체중 = parseFloat(formData.기본정보.신체정보.체중);
    
    if (신장 && 체중) {
      const 미터단위신장 = 신장 / 100;
      const bmi = (체중 / (미터단위신장 * 미터단위신장)).toFixed(1);
      
      let 판정 = '';
      if (bmi < 16) 판정 = '심한 저체중';
      else if (bmi < 18.5) 판정 = '저체중';
      else if (bmi < 23) 판정 = '보통';
      else if (bmi < 25) 판정 = '과체중';
      else if (bmi < 30) 판정 = '비만';
      else 판정 = '고도 비만';
      
      return `${bmi} (${판정})`;
    }
    return '0.0';
  };

  // 대분류 변경 핸들러
  const handleMainCategoryChange = (e) => {
    console.log('대분류 선택:', e.target.value);
    console.log('가능한 중분류:', 증상카테고리[e.target.value]);
    setSelectedCategory({
      대분류: e.target.value,
      중분류: '',
      소분류: ''
    });
  };

  // 중분류 변경 핸들러
  const handleSubCategoryChange = (e) => {
    console.log('중분류 선택:', e.target.value);
    console.log('가능한 소분류:', 증상카테고리[selectedCategory.대분류][e.target.value]);
    setSelectedCategory(prev => ({
      ...prev,
      중분류: e.target.value,
      소분류: ''
    }));
  };

  // 소분류 선택 시
  console.log('현재 선택된 카테고리:', selectedCategory);
  console.log('증상카테고리 데이터:', 증상카테고리);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/" element={
          isLoggedIn ? (
            <Container>
              <Header>
                <h1>건강 정보 관리 시스템</h1>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
              </Header>

              <TabContainer>
                <Tab 
                  active={activeTab === 'basic'} 
                  onClick={() => setActiveTab('basic')}
                >
                  기본 정보
                </Tab>
                <Tab 
                  active={activeTab === 'daily'} 
                  onClick={() => setActiveTab('daily')}
                >
                  일일 건강 기록
                </Tab>
              </TabContainer>

              {activeTab === 'basic' && (
                <form onSubmit={handleSubmit}>
                  <Section>
                    <SectionHeader className="blue">기본 정보</SectionHeader>
                    <SectionContent>
                      <FormGrid>
                        <FormRow>
                          <Label>이름</Label>
                          <InputField>
                            <Input
                              type="text"
                              name="이름"
                              value={formData.기본정보.이름}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            />
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>주민등록번호</Label>
                          <InputField>
                            <Input
                              type="text"
                              name="주민번호"
                              value={formData.기본정보.주민번호}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            />
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>연락처</Label>
                          <InputField>
                            <Input
                              type="text"
                              name="연락처"
                              value={formData.기본정보.연락처}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            />
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>신체 정보</Label>
                          <InputField>
                            <ShortInput
                              type="number"
                              name="신장"
                              value={formData.기본정보.신체정보.신장}
                              onChange={(e) => handleInputChange(e, '기본정보', '신체정보')}
                            />
                            <UnitText>cm</UnitText>
                            <ShortInput
                              type="number"
                              name="체중"
                              value={formData.기본정보.신체정보.체중}
                              onChange={(e) => handleInputChange(e, '기본정보', '신체정보')}
                            />
                            <UnitText>kg</UnitText>
                            <BMIText>BMI: {calculateBMI()}</BMIText>
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>성격</Label>
                          <InputField>
                            <Select
                              name="성격"
                              value={formData.성격}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            >
                              <option value="">선택하세요</option>
                              <option value="긍정적">긍정적</option>
                              <option value="보통">보통</option>
                              <option value="부정적">부정적</option>
                            </Select>
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>독용여부</Label>
                          <InputField>
                            <Select
                              name="독용여부"
                              value={formData.독용여부}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            >
                              <option value="">약용상 선택하세요</option>
                              <option value="독용">독용</option>
                              <option value="비독용">비독용</option>
                            </Select>
                            <CheckboxLabel>
                              <Checkbox
                                type="checkbox"
                                name="고지혈증여부"
                                checked={formData.고지혈증여부}
                                onChange={(e) => handleInputChange(e, '기본정보')}
                              />
                              고지혈증여부
                            </CheckboxLabel>
                          </InputField>
                        </FormRow>

                        <FormRow>
                          <Label>기초체력</Label>
                          <InputField>
                            <Select 
                              name="기초체력"
                              value={formData.기초체력}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            >
                              <option value="">보통</option>
                              <option value="약함">약함</option>
                              <option value="강함">강함</option>
                            </Select>
                            <Select 
                              name="운동량"
                              value={formData.운동량}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            >
                              <option value="">약함</option>
                              <option value="보통">보통</option>
                              <option value="많음">많음</option>
                            </Select>
                            <Select 
                              name="스트레스"
                              value={formData.스트레스}
                              onChange={(e) => handleInputChange(e, '기본정보')}
                            >
                              <option value="">보통</option>
                              <option value="낮음">낮음</option>
                              <option value="높음">높음</option>
                            </Select>
                          </InputField>
                        </FormRow>
                      </FormGrid>
                    </SectionContent>
                  </Section>

                  <Section>
                    <SectionHeader className="green">맥파 분석</SectionHeader>
                    <SectionContent>
                      <VitalSignsGrid>
                        <VitalSignItem>
                          <VitalSignLabel>수축기 혈압</VitalSignLabel>
                          <VitalSignInputGroup>
                            <VitalSignInput
                              type="number"
                              name="수축기혈압"
                              value={formData.맥파분석?.수축기혈압 || ''}
                              onChange={(e) => handleInputChange(e, '맥파분석')}
                            />
                            <VitalSignUnit>mmHg</VitalSignUnit>
                          </VitalSignInputGroup>
                        </VitalSignItem>

                        <VitalSignItem>
                          <VitalSignLabel>이완기 혈압</VitalSignLabel>
                          <VitalSignInputGroup>
                            <VitalSignInput
                              type="number"
                              name="이완기혈압"
                              value={formData.맥파분석?.이완기혈압 || ''}
                              onChange={(e) => handleInputChange(e, '맥파분석')}
                            />
                            <VitalSignUnit>mmHg</VitalSignUnit>
                          </VitalSignInputGroup>
                        </VitalSignItem>

                        <VitalSignItem>
                          <VitalSignLabel>맥박수</VitalSignLabel>
                          <VitalSignInputGroup>
                            <VitalSignInput
                              type="number"
                              name="맥박수"
                              value={formData.맥파분석?.맥박수 || ''}
                              onChange={(e) => handleInputChange(e, '맥파분석')}
                            />
                            <VitalSignUnit>회/분</VitalSignUnit>
                          </VitalSignInputGroup>
                        </VitalSignItem>
                      </VitalSignsGrid>
                    </SectionContent>
                  </Section>

                  <Section>
                    <SectionHeader className="red">증상 선택</SectionHeader>
                    <SectionContent>
                      <SymptomSelectorsContainer>
                        <SymptomSelectGroup>
                          <Select 
                            value={selectedCategory.대분류}
                            onChange={handleMainCategoryChange}
                          >
                            <option value="">선택하세요</option>
                            {Object.keys(증상카테고리).map(category => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Select>

                          <Select
                            value={selectedCategory.중분류}
                            onChange={handleSubCategoryChange}
                            disabled={!selectedCategory.대분류}
                          >
                            <option value="">선택하세요</option>
                            {selectedCategory.대분류 &&
                              Object.keys(증상카테고리[selectedCategory.대분류]).map(subCategory => (
                                <option key={subCategory} value={subCategory}>
                                  {subCategory}
                                </option>
                              ))}
                          </Select>

                          <Select
                            value={selectedCategory.소분류}
                            onChange={(e) => {
                              console.log('소분류 선택:', e.target.value);
                              const newSymptom = `${selectedCategory.대분류} > ${selectedCategory.중분류} > ${e.target.value}`;
                              if (!selectedSymptoms.includes(newSymptom)) {
                                setSelectedSymptoms(prev => [...prev, newSymptom]);
                              }
                              setSelectedCategory(prev => ({
                                ...prev,
                                소분류: e.target.value
                              }));
                            }}
                            disabled={!selectedCategory.중분류}
                          >
                            <option value="">선택하세요</option>
                            {selectedCategory.중분류 &&
                              증상카테고리[selectedCategory.대분류][selectedCategory.중분류].map(symptom => (
                                <option key={symptom} value={symptom}>
                                  {symptom}
                                </option>
                              ))}
                          </Select>
                        </SymptomSelectGroup>
                      </SymptomSelectorsContainer>

                      <SelectedSymptomsList>
                        {selectedSymptoms.map((symptom, index) => (
                          <SelectedSymptom key={index}>
                            {symptom}
                            <button onClick={() => handleRemoveSymptom(symptom)}>×</button>
                          </SelectedSymptom>
                        ))}
                      </SelectedSymptomsList>
                    </SectionContent>
                  </Section>

                  <Section>
                    <SectionHeader className="purple">메모</SectionHeader>
                    <SectionContent>
                      <div className="form-group">
                        <label>성격:</label>
                        <input
                          type="text"
                          name="성격"
                          value={formData.성격}
                          onChange={(e) => setFormData({...formData, 성격: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>운동량:</label>
                        <select
                          name="운동량"
                          value={formData.운동량}
                          onChange={(e) => setFormData({...formData, 운동량: e.target.value})}
                        >
                          <option value="">선택하세요</option>
                          <option value="많음">많음</option>
                          <option value="보통">보통</option>
                          <option value="적음">적음</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>스트레스:</label>
                        <select
                          name="스트레스"
                          value={formData.스트레스}
                          onChange={(e) => setFormData({...formData, 스트레스: e.target.value})}
                        >
                          <option value="">선택하세요</option>
                          <option value="높음">높음</option>
                          <option value="보통">보통</option>
                          <option value="낮음">낮음</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>메모:</label>
                        <textarea
                          name="메모"
                          value={formData.메모}
                          onChange={(e) => setFormData({...formData, 메모: e.target.value})}
                        />
                      </div>
                    </SectionContent>
                  </Section>

                  <div className="button-group">
                    <button type="submit" className="submit-button">저장하기</button>
                    <button type="button" onClick={() => setShowSearchModal(true)} className="search-button">
                      검색하기
                    </button>
                  </div>
                </form>
              )}

              {showSearchModal && (
                <SearchModal
                  onClose={() => setShowSearchModal(false)}
                  onSearch={handleSearch}
                  searchResults={searchResults}
                />
              )}
            </Container>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </div>
  );
}

export default App;