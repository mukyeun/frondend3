export const healthInfoService = {
  create: async (data) => {
    try {
      // 데이터 구조화
      const formattedData = {
        기본정보: {
          ...data.기본정보,
          createdAt: new Date().toISOString()
        },
        증상선택: data.증상선택 || {},
        맥파분석: data.맥파분석 || {},
        복용약물: data.복용약물 || {},
        메모: data.메모 || ''
      };

      // 로컬 스토리지에 저장
      const existingData = JSON.parse(localStorage.getItem('healthInfo') || '[]');
      existingData.push({
        ...formattedData,
        id: Date.now()
      });
      
      localStorage.setItem('healthInfo', JSON.stringify(existingData));
      console.log('Saved data:', formattedData);  // 저장된 데이터 확인
      
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('Storage error:', error);
      throw new Error('저장에 실패했습니다.');
    }
  },
  
  getList: async () => {
    try {
      return JSON.parse(localStorage.getItem('healthInfo') || '[]');
    } catch (error) {
      console.error('Retrieval error:', error);
      throw new Error('데이터 조회에 실패했습니다.');
    }
  }
};
