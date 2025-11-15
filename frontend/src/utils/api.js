import axios from 'axios'

// Use configurable API base URL with sensible default so dev/prod both work
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const quizAPI = {
  submit: (quizData) =>
    api.post('/quiz/submit', quizData),

  getResults: () =>
    api.get('/quiz/results'),
}

export const housingAPI = {
  predict: (housingData) =>
    api.post('/predict', housingData),

  getNeighborhood: (name) =>
    api.get(`/neighborhood/${encodeURIComponent(name)}`),
}

export const portfolioAPI = {
  get: () =>
    api.get('/portfolio'),
}

export default api
