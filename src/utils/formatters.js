// 전화번호 포맷팅
export const formatPhoneNumber = (value) => {
    if (!value) return '';
    
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };
  
  // 주민등록번호 포맷팅
  export const formatResidentNumber = (value) => {
    if (!value) return '';
    
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 6) {
      return numbers;
    } else {
      return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
    }
  };
  
  // 주민등록번호로 성별 판단
  export const getGenderFromResidentNumber = (number) => {
    if (!number || number.length < 8) return '';
    
    const genderDigit = number.replace('-', '').charAt(6);
    if (['1', '3', '5'].includes(genderDigit)) {
      return '남성';
    } else if (['2', '4', '6'].includes(genderDigit)) {
      return '여성';
    }
    return '';
  };