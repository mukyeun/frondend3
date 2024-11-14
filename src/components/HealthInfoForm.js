import React from 'react';

function HealthInfoForm({ formData, handleInputChange, selectedSymptoms, setSelectedSymptoms, 증상카테고리 }) {
  return (
    <>
      <section className="form-section">
        <h2>기본 정보</h2>
        <div className="form-group">
          <label>이름:</label>
          <input
            type="text"
            name="이름"
            value={formData.기본정보.이름}
            onChange={(e) => handleInputChange(e, '기본정보')}
          />
        </div>
        {/* ... 나머지 폼 필드들 ... */}
      </section>
    </>
  );
}

export default HealthInfoForm;