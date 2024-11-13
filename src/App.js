import React, { useState } from 'react';
import './App.css';
import { saveData, searchData, getAllData } from './services/dataService';
import { validateHealthInfo } from './utils/validation';
import SearchModal from './components/SearchModal';
import { 증상카테고리 } from './data/SymptomCategories';
import HealthInfoForm from './components/HealthInfoForm';
import HealthInfoList from './components/HealthInfoList';

function App() {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' 또는 'daily'
  const [formData, setFormData] = useState({
    기본정보: {
      이름: '',
      주민번호: '',
      연락처: '',
      신체정보: {
        신장: '',
        체중: ''
      }
    },
    맥파분석: {
      수축기혈압: '',
      이완기혈압: '',
      맥박수: ''
    },
    증상: [],
    성격: '',
    운동량: '',
    스트레스: '',
    메모: ''
  });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [message, setMessage] = useState('');

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
  // 첫 번째 부분에 이어서...
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      증상: selectedSymptoms
    };

    const validationError = validateHealthInfo(dataToSave);
    if (validationError) {
      setMessage(validationError);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const result = await saveData(dataToSave);
      if (result.success) {
        setMessage('데이터가 성공적으로 저장되었습니다.');
        setFormData({
          기본정보: {
            이름: '',
            주민번호: '',
            연락처: '',
            신체정보: {
              신장: '',
              체중: ''
            }
          },
          맥파분석: {
            수축기혈압: '',
            이완기혈압: '',
            맥박수: ''
          },
          증상: [],
          성격: '',
          운동량: '',
          스트레스: '',
          메모: ''
        });
        setSelectedSymptoms([]);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      setMessage('데이터 저장 중 오류가 발생했습니다.');
      console.error('저장 오류:', error);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleSearch = async (keyword) => {
    try {
      const results = await searchData(keyword);
      setSearchResults(results);
      if (results.length === 0) {
        setMessage('검색 결과가 없습니다.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setMessage('검색 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 5000);
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
  // 두 번째 부분에 이어서...
  return (
    <div className="App">
      <h1>건강 정보 관리 시스템</h1>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          기본 정보
        </button>
        <button 
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          일일 건강 기록
        </button>
      </div>

      {message && <div className="message">{message}</div>}
      
      {activeTab === 'basic' ? (
        <form onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>기본 정보</h2>
            <div className="form-group">
              <label>이름:</label>
              <input
                type="text"
                name="이름"
                value={formData.기본정보.이름}
                onChange={(e) => handleInputChange(e, '기본정보')}
              />
            </div>
            <div className="form-group">
              <label>주민번호:</label>
              <input
                type="text"
                name="주민번호"
                value={formData.기본정보.주민번호}
                onChange={(e) => handleInputChange(e, '기본정보')}
              />
            </div>
            <div className="form-group">
              <label>연락처:</label>
              <input
                type="text"
                name="연락처"
                value={formData.기본정보.연락처}
                onChange={(e) => handleInputChange(e, '기본정보')}
              />
            </div>
            
            <div className="form-subgroup">
              <h3>신체 정보</h3>
              <div className="form-group">
                <label>신장 (cm):</label>
                <input
                  type="number"
                  name="신장"
                  value={formData.기본정보.신체정보.신장}
                  onChange={(e) => handleInputChange(e, '기본정보', '신체정보')}
                />
              </div>
              <div className="form-group">
                <label>체중 (kg):</label>
                <input
                  type="number"
                  name="체중"
                  value={formData.기본정보.신체정보.체중}
                  onChange={(e) => handleInputChange(e, '기본정보', '신체정보')}
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>맥파 분석</h2>
            <div className="form-group">
              <label>수축기 혈압:</label>
              <input
                type="number"
                name="수축기혈압"
                value={formData.맥파분석.수축기혈압}
                onChange={(e) => handleInputChange(e, '맥파분석')}
              />
            </div>
            <div className="form-group">
              <label>이완기 혈압:</label>
              <input
                type="number"
                name="이완기혈압"
                value={formData.맥파분석.이완기혈압}
                onChange={(e) => handleInputChange(e, '맥파분석')}
              />
            </div>
            <div className="form-group">
              <label>맥박수:</label>
              <input
                type="number"
                name="맥박수"
                value={formData.맥파분석.맥박수}
                onChange={(e) => handleInputChange(e, '맥파분석')}
              />
            </div>
          </section>

          <section className="form-section">
            <h2>증상</h2>
            <div className="symptom-selectors">
              {Object.entries(증상카테고리).map(([대분류, 중분류객체]) => (
                <div key={대분류} className="symptom-category">
                  <h3>{대분류}</h3>
                  {Object.entries(중분류객체).map(([중분류, 소분류배열]) => (
                    <div key={중분류} className="symptom-subcategory">
                      <h4>{중분류}</h4>
                      <div className="symptom-items">
                        {소분류배열.map(소분류 => (
                          <button
                            key={소분류}
                            type="button"
                            onClick={() => handleSymptomSelect(대분류, 중분류, 소분류)}
                            className="symptom-button"
                          >
                            {소분류}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="selected-symptoms">
              <h3>선택된 증상</h3>
              {selectedSymptoms.map((symptom, index) => (
                <div key={index} className="selected-symptom">
                  {`${symptom.대분류} > ${symptom.중분류} > ${symptom.소분류}`}
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(index)}
                    className="remove-symptom"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2>추가 정보</h2>
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
          </section>

          <div className="button-group">
            <button type="submit" className="submit-button">저장하기</button>
            <button type="button" onClick={() => setShowSearchModal(true)} className="search-button">
              검색하기
            </button>
          </div>
        </form>
      ) : (
        <div className="daily-health-section">
          <HealthInfoForm />
          <HealthInfoList />
        </div>
      )}

      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onSearch={handleSearch}
          searchResults={searchResults}
        />
      )}
    </div>
  );
}

export default App;  