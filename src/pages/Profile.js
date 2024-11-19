import React from 'react';
import { Container } from '../components/common';
import styled from 'styled-components';

const ProfileContainer = styled(Container)`
  padding-top: 2rem;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  font-size: var(--font-size-title);
  margin-bottom: 1rem;
`;

const ProfileSection = styled.section`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

function Profile() {
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>프로필</ProfileTitle>
      </ProfileHeader>
      
      <ProfileSection>
        {/* 프로필 정보 */}
        <h2>개인 정보</h2>
        {/* 여기에 프로필 정보 컴포넌트 추가 */}
      </ProfileSection>

      <ProfileSection>
        {/* 건강 정보 요약 */}
        <h2>건강 정보 요약</h2>
        {/* 여기에 건강 정보 요약 컴포넌트 추가 */}
      </ProfileSection>
    </ProfileContainer>
  );
}

export default Profile;
