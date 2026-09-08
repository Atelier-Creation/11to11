import { apiClient, setAuthToken, getAuthToken } from './api-client';

export interface CustomerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: CustomerUser;
}

export const CustomerService = {
  async login(email: string, password: string): Promise<CustomerUser> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.accessToken) {
      setAuthToken(res.accessToken);
    }
    return res.user;
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<CustomerUser> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.accessToken) {
      setAuthToken(res.accessToken);
    }
    return res.user;
  },

  logout(): void {
    setAuthToken(null);
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  async getProfile(): Promise<CustomerUser | null> {
    if (!this.isAuthenticated()) return null;
    try {
      return await apiClient<CustomerUser>('/auth/me');
    } catch (e) {
      return null;
    }
  },
};
