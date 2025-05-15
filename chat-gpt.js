const axios = require('axios');

// Your API key - will be securely stored in Netlify environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async function(event, context) {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body format' })
      };
    }

    const { messages } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages must be provided as an array' })
      };
    }

    console.log('Sending request to OpenAI with messages:', JSON.stringify(messages.slice(0, 2)));
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log('Error details:', error);
    
    // Handle OpenAI API errors
    let errorMessage = 'An error occurred';
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('OpenAI API error response:', error.response.data);
      errorMessage = error.response.data.error?.message || 'Error from OpenAI API';
      statusCode = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from OpenAI API';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Error setting up the request';
    }

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
