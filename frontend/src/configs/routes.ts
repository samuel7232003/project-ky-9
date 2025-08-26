// Cấu hình routing
export const ROUTING_CONFIG = {
  
  // Cấu hình redirect
  redirects: {
    default: '/',
    login: '/login',
    afterLogin: '/',
    afterLogout: '/',
  },
  
  // Cấu hình route protection
  protection: {
    public: ['/', '/login', '/register'],
    protected: ['/profile', '/dashboard', '/settings'],
    admin: ['/admin', '/users'],
  },
} as const;
