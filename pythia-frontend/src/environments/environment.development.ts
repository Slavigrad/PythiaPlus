/**
 * Development Environment Configuration
 * Used during: ng serve (development mode)
 *
 * Note: Use port 8080 for Kotlin Spring Boot backend
 *       Use port 3000 only if using mock json-server
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  apiTimeout: 30000,
  enableDebugLogs: true
};
