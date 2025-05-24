import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = localStorage.getItem("token");

    // // Add authorization header if token exists
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // console.log("config", config);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Network error
      console.error("Network Error");
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - user not logged in or token expired
        console.error("Unauthorized - Token is invalid or expired", error);
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        break;

      case 403:
        // Forbidden - user doesn't have permission
        console.error(
          "Forbidden - You do not have permission to access this resource",
          error
        );
        // Handle forbidden error (e.g., show error message)
        break;

      case 404:
        // Not Found - resource doesn't exist
        console.error(
          "Not Found - The requested resource does not exist",
          error
        );
        // Handle not found error (e.g., redirect to 404 page)
        break;

      default:
        // Handle other errors
        console.error(`Error ${status}: ${error.message || "Unknown error"}`);
    }

    return Promise.reject(error);
  }
);

export default api;
