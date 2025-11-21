import axios from 'axios';

// Utility function to generate a UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Get or create session ID (persists across page reloads in the same browser session)
export const getSessionId = () => {
  const storageKey = 'quantifyLite_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
};

// Generate a new batch ID (for grouping bulk optimizations)
export const generateBatchId = () => {
  return generateUUID();
};

// This is the public URL of your backend.
// It is set at build time by Railway from the REACT_APP_API_URL environment variable.
let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.20.10.2:5001';

// In a production build, this variable MUST be set.
// If it's not, the app will not be able to connect to the backend.
if (process.env.NODE_ENV === 'production') {
  if (!API_BASE_URL) {
    console.error('FATAL: The REACT_APP_API_URL environment variable is not set.');
    alert('Configuration error: The application is not connected to the backend. Please contact support.');
    // Throwing an error will stop the app from rendering incorrectly.
    throw new Error('REACT_APP_API_URL is not set for production build.');
  }

  // Ensure the URL has a protocol. If not, default to https.
  // This prevents the browser from treating it as a relative path.
  if (!API_BASE_URL.startsWith('http')) {
    API_BASE_URL = `https://${API_BASE_URL}`;
  }
}

export const optimiseSavings = async (data) => {
  // Use the production API URL or fallback to a local URL for development.
  const apiUrl = `${API_BASE_URL}/optimize`;

  try {
    const response = await axios.post(apiUrl, data);
    return response;
  } catch (error) {
    console.error(`Error calling optimisation endpoint at ${apiUrl}:`, error);
    
    // Extract error message from the response if available
    const errorMessage = error.response?.data?.error 
      ? `Backend error: ${error.response.data.error}`
      : error.response?.status 
        ? `Backend returned status ${error.response.status}: ${error.response.statusText || 'Unknown error'}`
        : error.message
          ? `Network error: ${error.message}`
          : 'Unknown error occurred while connecting to the backend';
    
    // Log detailed error information for debugging
    console.error('Full error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: apiUrl,
      config: error.config
    });
    
    // Throw a descriptive error instead of returning mock data
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.apiUrl = apiUrl;
    throw enhancedError;
  }
};

export const submitFeedback = async (feedbackData) => {
  const apiUrl = `${API_BASE_URL}/feedback`;

  try {
    const response = await axios.post(apiUrl, feedbackData);
    return response.data;
  } catch (error) {
    console.error(`Error submitting feedback to ${apiUrl}:`, error);
    throw error;
  }
}; 