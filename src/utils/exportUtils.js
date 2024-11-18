export const exportToCSV = (data) => {
  // CSV 헤더
  const headers = ['날짜', 'BMI', '체중', '메모'];
  
  // 데이터를 CSV 형식으로 변환
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.bmi,
      item.weight,
      item.memo ? `"${item.memo.replace(/"/g, '""')}"` : ''
    ].join(','))
  ].join('\n');

  // CSV 파일 다운로드
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `health-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            return {
              date: new Date(values[0]).toISOString(),
              bmi: parseFloat(values[1]),
              weight: parseFloat(values[2]),
              memo: values[3]?.replace(/^"|"$/g, '')
            };
          });
        
        resolve(data);
      } catch (error) {
        reject(new Error('CSV 파일 형식이 올바르지 않습니다.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    };
    
    reader.readAsText(file);
  });
};
