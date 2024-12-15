const config = {
    mongoURI: String(process.env.NEXT_PUBLIC_MONGODB_URI),
    jwtSecret: String(process.env.NEXT_PUBLIC_JWT_SECRET),
}

export default config;
