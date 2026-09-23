import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const searchProducts = async (query, params = {}) => {
  const response = await api.get('/products/search', {
    params: { q: query, ...params },
  });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};