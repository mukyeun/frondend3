import React from 'react';
import { Container } from '../components/common';
import styled from 'styled-components';

const AboutContainer = styled(Container)`
  padding-top: 2rem;
`;

const AboutTitle = styled.h1`
  font-size: var(--font-size-title);
  margin-bottom: 2rem;
`;

const AboutSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const AboutContent = styled.div`
  line-height: 1.6;
  font-size: var(--font-size-body);
`;

function About() {
  return (
    <AboutContainer>
      <AboutTitle>About Us</AboutTitle>
      
      <AboutSection>
        <AboutContent>
          <h2>서비스 소개</h2>
          <p>건강 정보 관리 서비스는 사용자들의 건강한 생활을 지원합니다.</p>
          {/* 추가 내용 */}
        </AboutContent>
      </AboutSection>

      <AboutSection>
        <AboutContent>
          <h2>주요 기능</h2>
          <ul>
            <li>건강 데이터 추적</li>
            <li>맞춤형 건강 조언</li>
            <li>운동 기록 관리</li>
            {/* 추가 기능 목록 */}
          </ul>
        </AboutContent>
      </AboutSection>
    </AboutContainer>
  );
}

export default About;
