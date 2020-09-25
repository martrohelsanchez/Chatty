declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_PASS: string;
      JWT_KEY: string;
      CSRF_TOKEN_KEY: string;
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}