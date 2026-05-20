// NOTE: The backend does not currently have /addresses routes.
// This service is ready to use once you add the address routes/controller to the backend.
// Until then, calls to these methods will return 404 errors.

import api from './api';

const addressService = {
  getAddresses: async () => {
    const res = await api.get('/addresses');
    return res.data;
  },

  addAddress: async (addressData) => {
    const res = await api.post('/addresses', addressData);
    return res.data;
  },

  updateAddress: async (id, addressData) => {
    const res = await api.put(`/addresses/${id}`, addressData);
    return res.data;
  },

  deleteAddress: async (id) => {
    await api.delete(`/addresses/${id}`);
  },
};

export default addressService;