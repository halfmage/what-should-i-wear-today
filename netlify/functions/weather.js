require('dotenv').config();
const axios = require('axios');

exports.handler = async function(event, context) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }
  
  try {
    const city = event.queryStringParameters.city;
    const lang = event.queryStringParameters.lang || 'en';
    
    if (!city) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'City parameter is required' })
      };
    }
    
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=${lang}&appid=${API_KEY}`;
    
    const response = await axios.get(url);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    // Return appropriate error response
    if (error.response?.status === 404) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Location not found' })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch weather data' })
    };
  }
}; 