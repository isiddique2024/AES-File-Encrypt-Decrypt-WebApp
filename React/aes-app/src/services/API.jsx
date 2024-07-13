import axios from "axios";

const port = 8000; 

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:${port}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

const api_routes = {
  encrypt: "api/encrypt/",
  decrypt: "api/decrypt/",
};

export const api_service = async (operation, data) => {
  let response;
  try {
    response = await api.post(api_routes[operation], data);
  } catch (error) {
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error detail:", error.response.data.detail);
      return {
        success: false,
        message: "Error, " + error.response.data.detail,
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return { success: false, message: "Error, " + error.request };
    } else {
      console.error("Error", error.message);
      return { success: false, message: "Error, " + error.message };
    }
  }
  return { success: true, data: response.data };
};

export default api_service;
