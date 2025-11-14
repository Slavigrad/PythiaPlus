/**
 * Production Environment Configuration
 * Used during: ng build --configuration production
 */
export const environment = {
  production: true,
  apiUrl: '/api/v1',  // Relative URL for same-origin deployment
  apiTimeout: 30000,
  enableDebugLogs: false
};
