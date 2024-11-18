import React from 'react';
import styled from 'styled-components';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </PageButton>

      {pages.map(page => (
        <PageButton
          key={page}
          onClick={() => onPageChange(page)}
          active={currentPage === page}
        >
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </PageButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#1a73e8' : '#ddd'};
  background-color: ${props => props.active ? '#1a73e8' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#1557b0' : '#f5f5f5'};
  }
`;

export default Pagination;
