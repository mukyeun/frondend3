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

// 혈압 유효성 검사 함수 추가
const isValidBloodPressure = (systolic, diastolic) => {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  
  if (isNaN(sys) || isNaN(dia)) return false;
  if (sys < 70 || sys > 200) return false;
  if (dia < 40 || dia > 130) return false;
  if (sys <= dia) return false;
  
  return true;
};

// 전체 건강 정보 유효성 검사
export const validateHealthInfo = (formData) => {
  const errors = {};

  // 기본정보 검사
  if (!formData.기본정보?.이름?.trim()) {
    errors.이름 = '이름을 입력해주세요';
  }

  if (!formData.기본정보?.연락처?.trim()) {
    errors.연락처 = '연락처를 입력해주세요';
  } else if (!isValidPhoneNumber(formData.기본정보.연락처)) {
    errors.연락처 = '올바른 연락처 형식이 아닙니다';
  }

  if (!formData.기본정보?.주민등록번호?.trim()) {
    errors.주민등록번호 = '주민등록번호를 입력해주세요';
  } else if (!isValidResidentNumber(formData.기본정보.주민등록번호)) {
    errors.주민등록번호 = '올바른 주민등록번호 형식이 아닙니다';
  }

  // 신장/체중 검사
  const height = Number(formData.기본정보?.신장);
  const weight = Number(formData.기본정보?.체중);

  if (!height || height < 100 || height > 250) {
    errors.신장 = '올바른 신장을 입력해주세요 (100-250cm)';
  }

  if (!weight || weight < 30 || weight > 200) {
    errors.체중 = '올바른 체중을 입력해주세요 (30-200kg)';
  }

  // 혈압 검사 추가
  const systolic = formData.맥파분석?.수축기혈압;
  const diastolic = formData.맥파분석?.이완기혈압;

  if (!systolic) {
    errors.수축기혈압 = '수축기 혈압을 입력해주세요';
  }

  if (!diastolic) {
    errors.이완기혈압 = '이완기 혈압을 입력해주세요';
  }

  if (systolic && diastolic && !isValidBloodPressure(systolic, diastolic)) {
    errors.혈압 = '올바른 혈압을 입력해주세요';
  }

  return errors;
};
