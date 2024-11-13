import React, { useState } from 'react';
import './SearchModal.css';

function SearchModal({ onClose, onSearch, searchResults }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>건강 정보 검색</h2>
        <form onSubmit={handleSubmit}>
          <div className="search-input">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="이름, 주민번호, 또는 연락처로 검색"
            />
            <button type="submit">검색</button>
          </div>
        </form>

        <div className="search-results">
          {searchResults.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>주민번호</th>
                  <th>연락처</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.기본정보.이름}</td>
                    <td>{result.기본정보.주민번호}</td>
                    <td>{result.기본정보.연락처}</td>
                    <td>{formatDate(result.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>

        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default SearchModal;