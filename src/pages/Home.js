import React from 'react';
import { Container } from '../components/common';
import styled from 'styled-components';

const HomeContainer = styled(Container)`
  padding-top: 2rem;
`;

const Title = styled.h1`
  font-size: var(--font-size-title);
  margin-bottom: 1rem;
`;

const ContentSection = styled.section`
  margin: 2rem 0;
`;

function Home() {
  return (
    <HomeContainer>
      <Title>건강 정보 대시보드</Title>
      <ContentSection>
        {/* 여기에 건강 정보 컴포넌트들을 추가 */}
      </ContentSection>
    </HomeContainer>
  );
}

export default Home;
