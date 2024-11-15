import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    margin: 0;
    color: #2c3e50;
  }
`;

const SearchForm = styled.form`
  margin-bottom: 2rem;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background: #4A90E2;
    color: white;
    
    &:hover {
      background: #357ABD;
    }
  }
  
  &.secondary {
    background: #e9ecef;
    color: #495057;
    
    &:hover {
      background: #dee2e6;
    }
  }
`;

const SearchModal = ({ onClose, onSearch, searchResults }) => {
  const [searchParams, setSearchParams] = useState({
    이름: '',
    생년월일: '',
    연락처: '',
    시작일: '',
    종료일: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>환자 검색</h2>
          <Button className="secondary" onClick={onClose}>닫기</Button>
        </ModalHeader>

        <SearchForm onSubmit={handleSubmit}>
          <SearchGrid>
            <div>
              <label>이름</label>
              <input
                type="text"
                name="이름"
                value={searchParams.이름}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label>생년월일</label>
              <input
                type="date"
                name="생년월일"
                value={searchParams.생년월일}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>연락처</label>
              <input
                type="tel"
                name="연락처"
                value={searchParams.연락처}
                onChange={handleChange}
                placeholder="연락처를 입력하세요"
              />
            </div>
          </SearchGrid>
          <Button type="submit" className="primary">검색</Button>
        </SearchForm>

        {searchResults && searchResults.length > 0 && (
          <div>
            <h3>검색 결과</h3>
            {/* 검색 결과 목록 렌더링 */}
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SearchModal;