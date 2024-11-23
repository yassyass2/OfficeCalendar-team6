import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data; // Token and message
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Login failed' };
  }
};
