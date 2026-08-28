import client from './client';

export const registerRequest = (data) => client.post('/auth/register', data).then((r) => r.data.data);

export const loginRequest = (data) => client.post('/auth/login', data).then((r) => r.data.data);

export const meRequest = () => client.get('/auth/me').then((r) => r.data.data);

export const forgotPasswordRequest = (data) =>
  client.post('/auth/forgot-password', data).then((r) => r.data);

export const resetPasswordRequest = (data) =>
  client.post('/auth/reset-password', data).then((r) => r.data);

