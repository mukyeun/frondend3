import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--section-padding);
  
  @media screen and (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const FlexGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
`;

export default Container;
