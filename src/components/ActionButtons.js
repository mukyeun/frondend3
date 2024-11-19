import React from 'react';
import styled from 'styled-components';

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <ButtonGroup>
      <EditButton onClick={onEdit}>수정</EditButton>
      <DeleteButton onClick={onDelete}>삭제</DeleteButton>
    </ButtonGroup>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
`;

const EditButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover {
    background-color: #218838;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

export default ActionButtons;