const sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://dev.bludget.com',
      'Access-Control-Allow-Credentials': true,
    },
  };
  return response;
};

const validateInput = (data) => {
  const body = JSON.parse(data);
  const {username, password} = body;
  if (!username || !password || password.length < 6) {
    return false;
  }
  return true;
};

module.exports = {
  sendResponse, validateInput,
};
