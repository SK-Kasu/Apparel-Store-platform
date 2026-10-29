declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      email: string;
      name: string;
      role: 'customer' | 'admin';
    }

    interface Request {
      user?: AuthUser;
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
