import client from './client';

export const listAddressesRequest = () => client.get('/addresses').then((r) => r.data.data);

export const createAddressRequest = (data) =>
  client.post('/addresses', data).then((r) => r.data.data);

export const updateAddressRequest = (id, data) =>
  client.patch(`/addresses/${id}`, data).then((r) => r.data.data);

export const deleteAddressRequest = (id) => client.delete(`/addresses/${id}`).then((r) => r.data);
