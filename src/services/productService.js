import api from "./api";

export const getProducts = async (params = {}) => {
  // Adding delay=2000 to test race conditions
  const response = await api.get("/products", {
    params: { delay: 2000, ...params },
  });
  return response.data;
};

export const searchProducts = async (query, params = {}) => {
  const response = await api.get("/products/search", {
    params: { q: query, delay: 2000, ...params },
  });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post("/products/add", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
