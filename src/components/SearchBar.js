import React from 'react';
import styled from 'styled-components';

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchLabel>이름 검색:</SearchLabel>
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="이름을 입력하세요"
      />
      <SearchButton onClick={onSearch}>
        검색
      </SearchButton>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchLabel = styled.label`
  font-weight: 500;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  flex: 1;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default SearchBar;
