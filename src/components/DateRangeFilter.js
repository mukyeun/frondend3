import DateRangeFilter from './DateRangeFilter';

const HealthInfoList = () => {
  const {
    listStatus,
    listData,
    listError,
    loadList,
    searchTerm,
    setSearchTerm,
    handleSearch,
    filters,
    handleFilterChange,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  } = useHealthInfo();

  useEffect(() => {
    loadList();
  }, [loadList, startDate, endDate]); // 날짜 변경 시 목록 새로고침

  return (
    <ListContainer>
      <FilterSection>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => handleSearch(loadList)}
        />
      </FilterSection>

      {/* ... 기존 테이블 렌더링 코드 유지 ... */}
    </ListContainer>
  );
};

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export default HealthInfoList;
