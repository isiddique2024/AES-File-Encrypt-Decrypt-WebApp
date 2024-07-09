import axios from 'axios';

const api = axios.create({
  baseURL: window.location.origin, // http://localhost:8000/
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_routes = {
  encrypt: "api/encrypt/",
  decrypt: "api/decrypt/",
};

export const api_service = {
  encrypt(data) {
    return api.post(api_routes.encrypt, data);
  },

  decrypt(data) {
    return api.post(api_routes.decrypt, data);
  },

};

export default api_service;