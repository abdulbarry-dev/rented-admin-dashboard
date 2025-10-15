import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    // Don't add token to login/register endpoints
    const publicEndpoints = ["/login", "/register", "/admin/register"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Adding Bearer token to request:", config.url);
      }
    } else {
      console.log("🚪 Public endpoint, no token needed:", config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes("/login");

    // Only redirect to login on 401 if it's NOT the login endpoint itself
    // (login endpoint 401 means wrong credentials, not expired token)
    if (error.response?.status === 401 && !isLoginEndpoint) {
      console.log("🔒 Token expired or invalid, clearing session...");

      // Clear invalid token
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Redirect to login if not already there
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 401 && isLoginEndpoint) {
      console.log("❌ Login failed: Invalid credentials");
    }

    return Promise.reject(error);
  },
);

export default api;
