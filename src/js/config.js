/**
 * Kost Shukoh Management System - Configuration
 */
export const CONFIG = {
  APP_NAME: 'Kost Shukoh',
  APP_TAGLINE: 'Hunian Nyaman, Tertib, dan Terpercaya',
  // Backend API URL (Laravel REST API endpoint)
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://127.0.0.1:8000/api' 
    : '/api',
  // Storage keys
  AUTH_TOKEN_KEY: 'kost_shukoh_token',
  AUTH_USER_KEY: 'kost_shukoh_user',
  SETTINGS_KEY: 'kost_shukoh_settings',
  // Fallback / Mock mode when backend server is offline
  USE_MOCK_FALLBACK: true,
};
