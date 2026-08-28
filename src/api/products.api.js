import client from './client';

export const listProductsRequest = (params) =>
  client.get('/products', { params }).then((r) => r.data);

export const getProductRequest = (id) => client.get(`/products/${id}`).then((r) => r.data.data);

export const listCategoriesRequest = () =>
  client.get('/products/categories').then((r) => r.data.data);
