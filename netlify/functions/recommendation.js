require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

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
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { model, messages, temperature, max_tokens } = requestBody;
    
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }
    
    // Initialize OpenAI client
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: model || 'gpt-3.5-turbo',
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 150
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate recommendation',
        details: error.message
      })
    };
  }
}; 