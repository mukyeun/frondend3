import React, { useState } from 'react';
import styled from 'styled-components';

const SearchModal = ({ onClose, onSearch, searchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>환자 검색</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SearchForm onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름 또는 주민번호로 검색"
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>

        <ResultsContainer>
          {searchResults.length > 0 ? (
            <ResultsList>
              {searchResults.map((result, index) => (
                <ResultItem key={index}>
                  <ResultInfo>
                    <div>
                      <strong>{result.이름}</strong>
                      <span>{result.주민번호}</span>
                    </div>
                    <div>{result.연락처}</div>
                  </ResultInfo>
                  <SelectButton onClick={() => onClose(result)}>
                    선택
                  </SelectButton>
                </ResultItem>
              ))}
            </ResultsList>
          ) : (
            <NoResults>검색 결과가 없습니다.</NoResults>
          )}
        </ResultsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dde2e5;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #495057;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #495057;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
  padding: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #dde2e5;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #4A90E2;
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #357ABD;
  }
`;

const ResultsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #dde2e5;
  border-radius: 4px;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    margin-left: 10px;
    color: #868e96;
  }
`;

const SelectButton = styled.button`
  padding: 8px 16px;
  background: #7ED321;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #6BB01E;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: #868e96;
`;

export default SearchModal;