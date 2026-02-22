import axios from 'axios'

// Configure o baseURL aqui para apontar para seu backend
// Durante o desenvolvimento, use '/api' (proxy do Vite)
// Em produção, atualize para a URL completa do seu backend
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
    return Promise.reject(error)
  }
)

export default api
