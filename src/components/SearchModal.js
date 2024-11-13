import React, { useState } from 'react';
import './SearchModal.css';

function SearchModal({ onClose, onSearch, searchResults }) {
  const [searchType, setSearchType] = useState('name'); // 'name', 'id', 'phone', 'date'
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      type: searchType,
      keyword,
      startDate,
      endDate
    };
    onSearch(searchParams);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>건강 정보 검색</h2>
          <button className="close-icon" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="search-controls">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
            >
              <option value="name">이름</option>
              <option value="id">주민번호</option>
              <option value="phone">연락처</option>
              <option value="date">날짜</option>
            </select>

            {searchType === 'date' ? (
              <div className="date-range">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="date-input"
                />
                <span>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
            ) : (
              <div className="search-input">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={`${
                    searchType === 'name' ? '이름' : 
                    searchType === 'id' ? '주민번호' : '연락처'
                  }로 검색`}
                />
                <button type="submit" className="search-button">검색</button>
              </div>
            )}
          </div>
        </form>

        <div className="search-results">
          {searchResults.length > 0 ? (
            <table className="results-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>주민번호</th>
                  <th>연락처</th>
                  <th>등록일</th>
                  <th>증상</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.기본정보.이름}</td>
                    <td>{result.기본정보.주민번호}</td>
                    <td>{result.기본정보.연락처}</td>
                    <td>{formatDate(result.createdAt)}</td>
                    <td>{result.증상.join(', ')}</td>
                    <td>{result.메모}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">검색 결과가 없습니다.</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;