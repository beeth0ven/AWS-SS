const corsHeaders = {
  'Access-Control-Allow-Origin': '*'
};

class Response {

  success = (data) => {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data)
    }
  };

  internalError = (error) => {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.toString()
      })
    }
  };

  notFoundError = () => {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Not Found'
      })
    }
  };
}

export default Response;