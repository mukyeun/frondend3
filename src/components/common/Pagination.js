import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#007bff' : '#dee2e6'};
  background-color: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#212529'};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
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
          active={page === currentPage}
          onClick={() => onPageChange(page)}
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
}

export default Pagination;
