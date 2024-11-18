export const handleError = (error) => {
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 400:
        return '입력한 정보를 확인해주세요.';
      case 401:
        return '로그인이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 정보를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  }
  if (error.request) {
    return '서버와 통신할 수 없습니다.';
  }
  return '요청 처리 중 오류가 발생했습니다.';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isValidationError = (error) => {
  return error.response?.status === 400;
};

export const getValidationErrors = (error) => {
  if (!isValidationError(error)) return {};
  return error.response?.data?.errors || {};
};

export const formatErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  if (isValidationError(error)) {
    return '입력한 정보를 확인해주세요.';
  }
  
  return error.response?.data?.message || '오류가 발생했습니다.';
};
