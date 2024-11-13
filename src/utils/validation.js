export const validateHealthInfo = (data) => {
  // 기본 정보 검증
  if (!data.기본정보.이름) return '이름을 입력해주세요.';
  if (!data.기본정보.주민번호) return '주민번호를 입력해주세요.';
  if (!data.기본정보.연락처) return '연락처를 입력해주세요.';
  
  // 신체 정보 검증
  if (!data.기본정보.신체정보.신장) return '신장을 입력해주세요.';
  if (!data.기본정보.신체정보.체중) return '체중을 입력해주세요.';
  
  // 맥파 분석 검증
  if (!data.맥파분석.수축기혈압) return '수축기 혈압을 입력해주세요.';
  if (!data.맥파분석.이완기혈압) return '이완기 혈압을 입력해주세요.';
  if (!data.맥파분석.맥박수) return '맥박수를 입력해주세요.';
  
  return null;
};
