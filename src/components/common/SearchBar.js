import React from 'react';
import styled from 'styled-components';

const SearchBar = ({ value, onChange, onSearch, placeholder = '검색어를 입력하세요' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <SearchButton type="submit">
        검색
      </SearchButton>
    </SearchForm>
  );
};

const SearchForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1557b0;
  }
`;

export default SearchBar;
