import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://buddy-appifylab-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject({ message, ...error.response?.data });
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Post API
export const postAPI = {
  createPost: (formData) => {
    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/posts/${id}`),
  deletePost: (id) => api.delete(`/posts/${id}`)
};

// Comment API
export const commentAPI = {
  createComment: (data) => api.post('/comments', data),
  getComments: (postId, page = 1, limit = 20) => 
    api.get(`/comments/${postId}?page=${page}&limit=${limit}`),
  createReply: (commentId, data) => api.post(`/comments/${commentId}/reply`, data),
  getReplies: (commentId, page = 1, limit = 20) => 
    api.get(`/comments/${commentId}/replies?page=${page}&limit=${limit}`)
};

// Like API
export const likeAPI = {
  toggleLike: (data) => api.post('/likes', data),
  getLikes: (targetType, targetId) => api.get(`/likes/${targetType}/${targetId}`)
};

// User API
export const userAPI = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  updateUserProfile: (userId, formData) => {
    return api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getUserPosts: (userId, page = 1, limit = 10) => 
    api.get(`/users/${userId}/posts?page=${page}&limit=${limit}`),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
  getFollowers: (userId, page = 1, limit = 20) => 
    api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`),
  getFollowing: (userId, page = 1, limit = 20) => 
    api.get(`/users/${userId}/following?page=${page}&limit=${limit}`)
};

export default api;
