import React, { useState } from 'react';
import { newHealthInfoService } from '../services/newHealthInfoService';
import './HealthInfo.css';

const HealthInfoForm = () => {
  const [formData, setFormData] = useState({
    기본정보: {
      이름: '',
      주민번호: '',
      연락처: '',
      성별: '',
      나이: '',
      키: '',
      체중: '',
      BMI: ''
    },
    건강정보: {
      혈압: {
        수축기: '',
        이완기: ''
      },
      혈당: '',
      체온: '',
      산소포화도: ''
    },
    증상: [],
    메모: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const calculateBMI = () => {
    const height = parseFloat(formData.기본정보.키) / 100;
    const weight = parseFloat(formData.기본정보.체중);
    
    if (height > 0 && weight > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          BMI: bmi
        }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }));

      if (category === '기본정보' && (field === '키' || field === '체중')) {
        setTimeout(calculateBMI, 100);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.기본정보.이름) newErrors['기본정보.이름'] = '이름을 입력해주세요';
    if (!formData.기본정보.주민번호) newErrors['기본정보.주민번호'] = '주민번호를 입력해주세요';
    if (!formData.기본정보.연락처) newErrors['기본정보.연락처'] = '연락처를 입력해주세요';

    const numericFields = [
      '키', '체중', '혈압.수축기', '혈압.이완기', '혈당', '체온', '산소포화도'
    ];
    
    numericFields.forEach(field => {
      const value = field.includes('.')
        ? formData.건강정보[field.split('.')[0]][field.split('.')[1]]
        : formData.기본정보[field];
        
      if (value && (isNaN(value) || value < 0)) {
        newErrors[field] = '유효한 숫자를 입력해주세요';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('입력 정보를 확인해주세요.');
      return;
    }

    try {
      const response = await newHealthInfoService.create(formData);
      setMessage('건강 정보가 성공적으로 저장되었습니다.');
      setFormData({
        기본정보: {
          이름: '',
          주민번호: '',
          연락처: '',
          성별: '',
          나이: '',
          키: '',
          체중: '',
          BMI: ''
        },
        건강정보: {
          혈압: {
            수축기: '',
            이완기: ''
          },
          혈당: '',
          체온: '',
          산소포화도: ''
        },
        증상: [],
        메모: ''
      });
    } catch (error) {
      setMessage('건강 정보 저장 중 오류가 발생했습니다.');
      console.error('Error saving health info:', error);
    }
  };

  return (
    <div className="health-info-container">
      <form onSubmit={handleSubmit} className="health-info-form">
        {message && <div className={message.includes('오류') ? 'error' : 'success'}>{message}</div>}
        
        <div className="form-section">
          <h3>기본 정보</h3>
          <div className="form-group">
            <label>이름:</label>
            <input
              type="text"
              name="기본정보.이름"
              value={formData.기본정보.이름}
              onChange={handleChange}
              className={errors['기본정보.이름'] ? 'form-control error' : 'form-control'}
            />
            {errors['기본정보.이름'] && <div className="error-message">{errors['기본정보.이름']}</div>}
          </div>

          <div className="form-group">
            <label>주민번호:</label>
            <input
              type="text"
              name="기본정보.주민번호"
              value={formData.기본정보.주민번호}
              onChange={handleChange}
              className={errors['기본정보.주민번호'] ? 'form-control error' : 'form-control'}
            />
            {errors['기본정보.주민번호'] && <div className="error-message">{errors['기본정보.주민번호']}</div>}
          </div>

          <div className="form-group">
            <label>연락처:</label>
            <input
              type="text"
              name="기본정보.연락처"
              value={formData.기본정보.연락처}
              onChange={handleChange}
              className={errors['기본정보.연락처'] ? 'form-control error' : 'form-control'}
            />
            {errors['기본정보.연락처'] && <div className="error-message">{errors['기본정보.연락처']}</div>}
          </div>
        </div>

        <div className="form-section">
          <h3>건강 정보</h3>
          <div className="form-group">
            <label>혈압:</label>
            <div className="blood-pressure-inputs">
              <input
                type="number"
                name="건강정보.혈압.수축기"
                value={formData.건강정보.혈압.수축기}
                onChange={handleChange}
                placeholder="수축기"
                className="form-control"
              />
              <input
                type="number"
                name="건강정보.혈압.이완기"
                value={formData.건강정보.혈압.이완기}
                onChange={handleChange}
                placeholder="이완기"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>혈당:</label>
            <input
              type="number"
              name="건강정보.혈당"
              value={formData.건강정보.혈당}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>체온:</label>
            <input
              type="number"
              name="건강정보.체온"
              value={formData.건강정보.체온}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>산소포화도:</label>
            <input
              type="number"
              name="건강정보.산소포화도"
              value={formData.건강정보.산소포화도}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">저장</button>
      </form>
    </div>
  );
};

export default HealthInfoForm;