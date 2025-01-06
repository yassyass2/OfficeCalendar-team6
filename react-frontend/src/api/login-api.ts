// login-api.tsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

// ====== Existing Login Interfaces & Function ======
interface LoginResponse {
  token: string;
  message: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
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

// ====== New Registration Interfaces & Function ======
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  // If your API returns additional fields, add them here.
  message?: string;
}

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/login/register`,
      data
    );
    return response.data; // Likely { message: 'Registration successful!' }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // The backend may return a plain string or { message: string }
      throw error.response?.data || { message: 'Registration failed' };
    } else {
      // Handle any non-Axios errors
      throw { message: 'An unexpected error occurred' };
    }
  }
};
