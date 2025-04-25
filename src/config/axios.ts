import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://147.79.82.207:3003', // Cambia a tu URL base
  baseURL: 'http://localhost:3003', // Cambia a tu URL base
  timeout: 1000,
})

// Puedes agregar interceptores si lo necesitas
instance.interceptors.request.use(
  (config) => {
    // Agrega cabeceras si es necesario
    // config.headers['Authorization'] = 'Bearer token';
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default instance
