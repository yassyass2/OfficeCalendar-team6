import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

// Export the structure of the response data
export interface LoginResponse {
  token: string;
  message: string;
  role: "admin" | "user";
}

// Define the function's input parameters and return type
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data; // Return the token and message
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      throw error.response?.data || { message: 'Login failed' };
    } else {
      // Handle unexpected errors
      throw { message: 'An unexpected error occurred' };
    }
  }
};