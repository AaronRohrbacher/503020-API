const AWS = require('aws-sdk');
const {sendResponse, validateInput} = require('./functions');
const cors = require('cors');
const {application} = require('express');

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  console.log(event);
  try {
    const isValid = validateInput(event.body);
    if (!isValid) {
      return sendResponse(400, {message: 'Invalid input'});
    }

    const {username, password} = JSON.parse(event.body);
    console.log(username + ' ' + password);
    const {user_pool_id, client_id} = process.env;
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    console.log(response);
    return sendResponse(200, {message: 'Success', token: response});
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error';
    return sendResponse(500, {message});
  }
};
