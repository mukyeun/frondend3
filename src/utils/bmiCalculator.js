// BMI 계산 및 판정 함수
export const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    if (bmi < 16.5) return { value: bmi.toFixed(1), status: '과도저체중', color: '#3498db' };
    if (bmi < 18.5) return { value: bmi.toFixed(1), status: '저체중', color: '#2ecc71' };
    if (bmi < 23) return { value: bmi.toFixed(1), status: '보통', color: '#27ae60' };
    if (bmi < 25) return { value: bmi.toFixed(1), status: '과체중', color: '#f1c40f' };
    if (bmi < 30) return { value: bmi.toFixed(1), status: '비만', color: '#e67e22' };
    return { value: bmi.toFixed(1), status: '과도비만', color: '#e74c3c' };
  };
  
  export const calculateBMIStatus = (height, weight) => {
    if (!height || !weight) return { bmi: '', status: '' };
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let status = '';
    if (bmi < 16.5) status = '과도한 저체중';
    else if (bmi < 18.5) status = '저체중';
    else if (bmi < 23) status = '정상';
    else if (bmi < 25) status = '과체중';
    else if (bmi < 30) status = '비만';
    else status = '고도비만';
    
    return {
      bmi: bmi.toFixed(1),
      status
    };
  };