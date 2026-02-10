// API 설정
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = process.env.REACT_APP_API_URL ||
  (isDevelopment
    ? 'http://localhost:8000'
    : 'https://seoul-youth-policies-api-green-tree-894.fly.dev');

export const config = {
  apiUrl: API_URL,
};
