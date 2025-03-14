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
    const lat = event.queryStringParameters.lat;
    const lon = event.queryStringParameters.lon;
    
    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Latitude and longitude parameters are required' })
      };
    }
    
    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    
    const response = await axios.get(url);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Geocode API Error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch location data' })
    };
  }
}; 