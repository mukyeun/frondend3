import { useState, useEffect } from 'react';
import { useAsync } from './useAsync';
import { healthInfoService } from '../services/api';
import { sortData, SORT_OPTIONS } from '../utils/filterUtils';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    data: [],
    stats: {
      averageBMI: 0,
      averageWeight: 0,
      totalRecords: 0,
      lastMeasureDate: '-'
    }
  });

  const [filters, setFilters] = useState({
    sortOption: SORT_OPTIONS.DATE_DESC
  });

  const { 
    execute: fetchDashboardData,
    status,
    error 
  } = useAsync(async () => {
    const response = await healthInfoService.getList();
    return response;
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        if (data) {
          const sortedData = sortData(data, filters.sortOption);
          const stats = {
            averageBMI: data.reduce((sum, item) => sum + item.bmi, 0) / data.length,
            averageWeight: data.reduce((sum, item) => sum + item.weight, 0) / data.length,
            totalRecords: data.length,
            lastMeasureDate: data[0]?.date ? new Date(data[0].date).toLocaleDateString() : '-'
          };

          setDashboardData({
            data: sortedData,
            stats
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [fetchDashboardData, filters.sortOption]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const refreshDashboard = async () => {
    await fetchDashboardData();
  };

  return {
    data: dashboardData.data,
    stats: dashboardData.stats,
    filters,
    updateFilters,
    status,
    error,
    refreshDashboard
  };
};
