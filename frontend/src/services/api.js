import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

// Package services
export const packageService = {
  getAll: async () => {
    const response = await api.get('/packages');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  create: async (packageData) => {
    const response = await api.post('/packages', packageData);
    return response.data;
  },
};

// Car services
export const carService = {
  getAll: async () => {
    const response = await api.get('/cars');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
  create: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },
};

// Service Package services
export const servicePackageService = {
  getAll: async () => {
    const response = await api.get('/service-packages');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/service-packages/${id}`);
    return response.data;
  },
  create: async (servicePackageData) => {
    const response = await api.post('/service-packages', servicePackageData);
    return response.data;
  },
  update: async (id, servicePackageData) => {
    const response = await api.put(`/service-packages/${id}`, servicePackageData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/service-packages/${id}`);
    return response.data;
  },
};

// Payment services
export const paymentService = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
};

// Report services
export const reportService = {
  getPaymentsByDateRange: async (startDate, endDate) => {
    const response = await api.get(`/reports/payments?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  getServicesByPlateNumber: async (plateNumber) => {
    const response = await api.get(`/reports/services/${plateNumber}`);
    return response.data;
  },
};

export default api;
