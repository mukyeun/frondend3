// 주민등록번호 유효성 검사
const isValidResidentNumber = (number) => {
  const regex = /^(\d{6})-?(\d{7})$/;
  if (!regex.test(number)) return false;

  const numbers = number.replace('-', '').split('').map(n => parseInt(n));
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += numbers[i] * multipliers[i];
  }

  const remainder = (11 - (sum % 11)) % 10;
  return remainder === numbers[12];
};

// 전화번호 유효성 검사
const isValidPhoneNumber = (number) => {
  const regex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return regex.test(number);
};

// 신체 정보 유효성 검사
export const isValidPhysicalInfo = (physicalInfo) => {
  if (!physicalInfo) return false;
  const { 신장, 체중 } = physicalInfo;
  return (
    신장 > 0 && 신장 < 300 &&
    체중 > 0 && 체중 < 300
  );
};

// 혈압 유효성 검사
export const isValidBloodPressure = (systolic, diastolic) => {
  return (
    systolic >= 70 && systolic <= 200 &&
    diastolic >= 40 && diastolic <= 130 &&
    systolic > diastolic
  );
};

// 맥박 유효성 검사
export const isValidPulse = (pulse) => {
  return pulse >= 40 && pulse <= 200;
};

// 전체 건강 정보 유효성 검사
export const validateHealthInfo = (data) => {
  const errors = {};

  // 필수 입력 필드 검사
  if (!data.기본정보.이름) {
    errors.이름 = '이름을 입력해주세요.';
  }

  if (!data.기본정보.주민번호) {
    errors.주민번호 = '주민등록번호를 입력해주세요.';
  }

  if (!isValidResidentNumber(data.기본정보.주민번호)) {
    errors.주민번호 = '올바른 주민등록번호 형식이 아닙니다.';
  }

  if (data.기본정보.연락처 && !isValidPhoneNumber(data.기본정보.연락처)) {
    errors.연락처 = '올바른 전화번호 형식이 아닙니다.';
  }

  // 신체 정보 검증
  if (!data.기본정보.신체정보.신장) return '신장을 입력해주세요.';
  if (!data.기본정보.신체정보.체중) return '체중을 입력해주세요.';
  
  // 맥파 분석 검증
  if (!data.맥파분석.수축기혈압) return '수축기 혈압을 입력해주세요.';
  if (!data.맥파분석.이완기혈압) return '이완기 혈압을 입력해주세요.';
  if (!data.맥파분석.맥박수) return '맥박수를 입력해주세요.';
  
  // 추가 검사
  if (!isValidPhysicalInfo(data.기본정보?.신체정보)) {
    errors.신체정보 = '올바른 신체 정보를 입력해주세요';
  }

  if (!isValidBloodPressure(data.맥파분석?.수축기혈압, data.맥파분석?.이완기혈압)) {
    errors.혈압 = '올바른 혈압 값을 입력해주세요';
  }

  if (!isValidPulse(data.맥파분석?.맥박수)) {
    errors.맥박 = '올바른 맥박수를 입력해주세요';
  }

  return errors;
};
