import React, { useState, useEffect } from 'react';
import { newHealthInfoService } from '../services/newHealthInfoService';
import './HealthInfo.css';

const HealthInfoList = () => {
  const [healthInfos, setHealthInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    fetchHealthInfos();
  }, []);

  const fetchHealthInfos = async () => {
    try {
      const data = await newHealthInfoService.getAll();
      setHealthInfos(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('건강 정보를 불러오는데 실패했습니다.');
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 건강 정보를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await newHealthInfoService.delete(id);
      setMessage('건강 정보가 삭제되었습니다.');
      // 목록 새로고침
      fetchHealthInfos();
      // 3초 후 메시지 제거
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('삭제 중 오류가 발생했습니다.');
      console.error('Delete error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="health-info-container">
      <div className="health-info-list">
        {message && <div className={message.includes('오류') ? 'error' : 'success'}>{message}</div>}
        <h2>건강 정보 목록</h2>
        {healthInfos.length === 0 ? (
          <p className="no-data">등록된 건강 정보가 없습니다.</p>
        ) : (
          <table className="health-info-table">
            <thead>
              <tr>
                <th>등록일시</th>
                <th>이름</th>
                <th>주민번호</th>
                <th>연락처</th>
                <th>키/체중/BMI</th>
                <th>혈압</th>
                <th>혈당</th>
                <th>체온</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {healthInfos.map((info) => (
                <tr key={info._id}>
                  <td>{formatDate(info.createdAt)}</td>
                  <td>{info.기본정보.이름}</td>
                  <td>{info.기본정보.주민번호}</td>
                  <td>{info.기본정보.연락처}</td>
                  <td>
                    {info.기본정보.키}cm / {info.기본정보.체중}kg
                    <br />
                    BMI: {info.기본정보.BMI}
                  </td>
                  <td>{info.건강정보.혈압.수축기}/{info.건강정보.혈압.이완기}</td>
                  <td>{info.건강정보.혈당}</td>
                  <td>{info.건강정보.체온}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedInfo(info)}
                      className="button view-button"
                    >
                      상세
                    </button>
                    <button 
                      onClick={() => handleDelete(info._id)}
                      className="button delete-button"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedInfo && (
        <div className="modal-overlay" onClick={() => setSelectedInfo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>상세 정보</h3>
              <button className="close-icon" onClick={() => setSelectedInfo(null)}>&times;</button>
            </div>
            <div className="detail-content">
              <h4>기본 정보</h4>
              <p>이름: {selectedInfo.기본정보.이름}</p>
              <p>주민번호: {selectedInfo.기본정보.주민번호}</p>
              <p>연락처: {selectedInfo.기본정보.연락처}</p>
              <p>성별: {selectedInfo.기본정보.성별}</p>
              <p>나이: {selectedInfo.기본정보.나이}</p>
              <p>키: {selectedInfo.기본정보.키}cm</p>
              <p>체중: {selectedInfo.기본정보.체중}kg</p>
              <p>BMI: {selectedInfo.기본정보.BMI}</p>

              <h4>건강 정보</h4>
              <p>혈압: {selectedInfo.건강정보.혈압.수축기}/{selectedInfo.건강정보.혈압.이완기}</p>
              <p>혈당: {selectedInfo.건강정보.혈당}</p>
              <p>체온: {selectedInfo.건강정보.체온}</p>
              <p>산소포화도: {selectedInfo.건강정보.산소포화도}</p>

              {selectedInfo.증상?.length > 0 && (
                <>
                  <h4>증상</h4>
                  <p>{selectedInfo.증상.join(', ')}</p>
                </>
              )}

              {selectedInfo.메모 && (
                <>
                  <h4>메모</h4>
                  <p>{selectedInfo.메모}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInfoList;