export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const isLoading = (status) => status === LOADING_STATES.LOADING;
export const isSuccess = (status) => status === LOADING_STATES.SUCCESS;
export const isError = (status) => status === LOADING_STATES.ERROR;
export const isIdle = (status) => status === LOADING_STATES.IDLE;

export const getLoadingMessage = (action) => {
  switch (action) {
    case 'save':
      return '저장 중입니다...';
    case 'load':
      return '데이터를 불러오는 중입니다...';
    case 'delete':
      return '삭제 중입니다...';
    default:
      return '처리 중입니다...';
  }
};
