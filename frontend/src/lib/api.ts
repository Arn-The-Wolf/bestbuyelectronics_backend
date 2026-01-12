const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: async (phone: string, password: string, fullName?: string) => {
    const data = await apiRequest<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phone, password, fullName }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  login: async (phone: string, password: string) => {
    const data = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return apiRequest<any>('/auth/me');
  },
};

// Products API
export const productsApi = {
  getAll: async (filters?: { category?: string; search?: string; sort?: string; featured?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.featured) params.append('featured', 'true');
    
    const query = params.toString();
    return apiRequest<any[]>(`/products${query ? `?${query}` : ''}`);
  },

  getFeatured: async () => {
    return apiRequest<any[]>('/products/featured');
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/products/${id}`);
  },

  create: async (product: any) => {
    return apiRequest<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id: string, product: any) => {
    return apiRequest<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return apiRequest<any[]>('/categories');
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/categories/${id}`);
  },

  create: async (category: any) => {
    return apiRequest<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (id: string, category: any) => {
    return apiRequest<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    return apiRequest<any[]>('/orders');
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/orders/${id}`);
  },

  create: async (order: any) => {
    return apiRequest<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  updateTracking: async (id: string, tracking: { tracking_number?: string; tracking_url?: string; estimated_delivery?: string | null }) => {
    return apiRequest<any>(`/orders/${id}/tracking`, {
      method: 'PATCH',
      body: JSON.stringify(tracking),
    });
  },
};

// Reviews API
export const reviewsApi = {
  getAll: async () => {
    return apiRequest<any[]>('/reviews');
  },

  getByProduct: async (productId: string) => {
    return apiRequest<any[]>(`/reviews/product/${productId}`);
  },

  create: async (review: any) => {
    return apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Chat API
export const chatApi = {
  getAll: async () => {
    return apiRequest<any[]>('/chat');
  },

  send: async (message: string, receiverId?: string, isFromAdmin?: boolean) => {
    return apiRequest<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, receiver_id: receiverId, is_from_admin: isFromAdmin }),
    });
  },
};

// Coupons API
export const couponsApi = {
  getActive: async () => {
    return apiRequest<any[]>('/coupons/active');
  },

  getAll: async () => {
    return apiRequest<any[]>('/coupons');
  },

  validate: async (code: string, amount: number) => {
    return apiRequest<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    });
  },

  create: async (coupon: any) => {
    return apiRequest<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },
};

// Profiles API
export const profilesApi = {
  getMe: async () => {
    return apiRequest<any>('/profiles/me');
  },

  update: async (profile: any) => {
    return apiRequest<any>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    return apiRequest<any>('/admin/stats');
  },

  getCustomers: async () => {
    return apiRequest<any[]>('/admin/customers');
  },
};

