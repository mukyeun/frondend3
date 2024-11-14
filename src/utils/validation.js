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
const isValidPhysicalInfo = (height, weight) => {
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);

  return (
    !isNaN(heightNum) &&
    !isNaN(weightNum) &&
    heightNum > 0 &&
    heightNum < 300 &&
    weightNum > 0 &&
    weightNum < 300
  );
};

// 혈압 유효성 검사
const isValidBloodPressure = (systolic, diastolic) => {
  const systolicNum = parseInt(systolic);
  const diastolicNum = parseInt(diastolic);

  return (
    !isNaN(systolicNum) &&
    !isNaN(diastolicNum) &&
    systolicNum >= 60 &&
    systolicNum <= 250 &&
    diastolicNum >= 40 &&
    diastolicNum <= 150 &&
    systolicNum > diastolicNum
  );
};

// 맥박 유효성 검사
const isValidPulse = (pulse) => {
  const pulseNum = parseInt(pulse);
  return !isNaN(pulseNum) && pulseNum >= 40 && pulseNum <= 200;
};

// 전체 건강 정보 유효성 검사
export const validateHealthInfo = (formData) => {
  // 필수 입력 필드 검사
  if (!formData.기본정보.이름) {
    return {
      isValid: false,
      message: '이름을 입력해주세요.'
    };
  }

  if (!formData.기본정보.주민번호) {
    return {
      isValid: false,
      message: '주민등록번호를 입력해주세요.'
    };
  }

  if (!isValidResidentNumber(formData.기본정보.주민번호)) {
    return {
      isValid: false,
      message: '올바른 주민등록번호 형식이 아닙니다.'
    };
  }

  if (formData.기본정보.연락처 && !isValidPhoneNumber(formData.기본정보.연락처)) {
    return {
      isValid: false,
      message: '올바른 전화번호 형식이 아닙니다.'
    };
  }

  // 신체 정보 검증
  if (!formData.기본정보.신체정보.신장) return '신장을 입력해주세요.';
  if (!formData.기본정보.신체정보.체중) return '체중을 입력해주세요.';
  
  // 맥파 분석 검증
  if (!formData.맥파분석.수축기혈압) return '수축기 혈압을 입력해주세요.';
  if (!formData.맥파분석.이완기혈압) return '이완기 혈압을 입력해주세요.';
  if (!formData.맥파분석.맥박수) return '맥박수를 입력해주세요.';
  
  return null;
};
