import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
