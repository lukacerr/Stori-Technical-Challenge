import axios from 'axios';

export default function AxiosConfig() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

export function SetSessionToken(password: string) {
  sessionStorage.setItem('Authorization', password);
  axios.defaults.headers.common['Authorization'] = `Bearer ${password}`;
}
