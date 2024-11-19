import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  margin-bottom: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4361ee;
  }
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3730a3;
  }
`;

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={value || ''}
          onChange={handleChange}
          placeholder="이름으로 검색"
        />
        <SearchButton type="submit">
          검색
        </SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchBar;
