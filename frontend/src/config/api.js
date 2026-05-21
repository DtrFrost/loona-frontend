const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default API_BASE_URL;

// import API_BASE_URL from './config/api';

// const response = await fetch(`${API_BASE_URL}/blog/posts`);

// ${API_BASE_URL} без /api