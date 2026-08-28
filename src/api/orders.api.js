import client from './client';

export const createOrderRequest = (data) => client.post('/orders', data).then((r) => r.data.data);

export const listMyOrdersRequest = (params) =>
  client.get('/orders', { params }).then((r) => r.data);

export const getOrderRequest = (id) => client.get(`/orders/${id}`).then((r) => r.data.data);

export const cancelOrderRequest = (id) =>
  client.post(`/orders/${id}/cancel`).then((r) => r.data.data);
