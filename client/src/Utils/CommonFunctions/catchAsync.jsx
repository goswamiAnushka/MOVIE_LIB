const catchAsync = (fn) => {
    return async (...rest) => {
      try {
        const result = await fn(...rest);
        return result.data;  // Axios response data is stored in the 'data' field
      } catch (error) {
        if (error.response) {
          return error.response.data;  // Handle the case where the server responds with an error
        }
        return error;  // If there's no response, return the error itself
      }
    };
  };
  
  export default catchAsync;
  