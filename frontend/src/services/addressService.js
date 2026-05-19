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
  }
};

export default addressService;