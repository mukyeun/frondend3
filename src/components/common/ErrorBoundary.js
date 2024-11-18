import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>오류가 발생했습니다</ErrorTitle>
          <ErrorMessage>{this.state.error?.message}</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 24px;
`;

const RetryButton = styled.button`
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

export default ErrorBoundary;
