import axios from 'axios';

// This is the public URL of your backend.
// It is set at build time by Railway from the REACT_APP_API_URL environment variable.
const API_BASE_URL = process.env.REACT_APP_API_URL;

// In a production build, this variable MUST be set.
// If it's not, the app will not be able to connect to the backend.
if (process.env.NODE_ENV === 'production' && !API_BASE_URL) {
  console.error('FATAL: The REACT_APP_API_URL environment variable is not set.');
  alert('Configuration error: The application is not connected to the backend. Please contact support.');
  // Throwing an error will stop the app from rendering incorrectly.
  throw new Error('REACT_APP_API_URL is not set for production build.');
}

const MOCK_DATA = {
  "investments": [
    {
      "account_name": "Super Saver Account",
      "amount": 5000.00,
      "aer": 5.20,
      "term": "1 Year",
      "is_isa": true,
      "url": "https://www.example.com/super-saver"
    },
    {
      "account_name": "Flexible ISA",
      "amount": 3000.00,
      "aer": 4.80,
      "term": "Variable",
      "is_isa": true,
      "url": "https://www.example.com/flexible-isa"
    },
    {
      "account_name": "High-Yield Bond",
      "amount": 2000.00,
      "aer": 6.50,
      "term": "3 Years",
      "is_isa": false,
      "url": "https://www.example.com/high-yield"
    }
  ],
  "total_return": 674.00,
  "status": "Optimal"
};

export const optimiseSavings = async (data, useMockData = false) => {
  if (useMockData) {
    return Promise.resolve({ data: MOCK_DATA });
  }

  // Use the production API URL or fallback to a local URL for development.
  const apiUrl = `${API_BASE_URL || 'http://localhost:5001'}/optimize`;

  try {
    const response = await axios.post(apiUrl, data);
    return response;
  } catch (error) {
    console.error(`Error calling optimisation endpoint at ${apiUrl}:`, error);
    alert("Could not connect to the backend. Using mock data for demonstration.");
    return Promise.resolve({ data: MOCK_DATA });
  }
}; 