const config = {
    mongoURI: String(process.env.NEXT_PUBLIC_MONGODB_URI),
    jwtSecret: String(process.env.NEXT_PUBLIC_JWT_SECRET),
    youtubeApiKey: String(process.env.NEXT_PUBLIC_YOUTUBE_API_KEY),
    geminiApiKey: String(process.env.NEXT_PUBLIC_GEMINI_API_KEY),
    deepgramApiKey: String(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY),
    firebaseApiKey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    firebaseMessagingSenderId: String(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    firebaseAppId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    firebaseMeasurementId: String(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
}

import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 60000,
})

export default config;
