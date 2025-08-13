export const environment = {
  production: false,
  // Note: NOTES_API_URL will be provided via environment variable
  apiUrl: process.env['NOTES_API_URL'] || 'http://localhost:3001/api'
};
