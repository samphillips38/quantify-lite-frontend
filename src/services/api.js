import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

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

  try {
    const response = await axios.post(`${API_URL}/optimize`, data);
    return response;
  } catch (error) {
    console.error("Error calling optimisation endpoint:", error);
    // Return mock data as a fallback on error
    alert("Could not connect to the backend. Using mock data for demonstration.");
    return Promise.resolve({ data: MOCK_DATA });
  }
}; 