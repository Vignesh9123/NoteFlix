const config = {
    mongoURI: String(process.env.NEXT_PUBLIC_MONGODB_URI),
    jwtSecret: String(process.env.NEXT_PUBLIC_JWT_SECRET),
}

import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 60000,
})

export default config;
