const CognitoExpress = require('cognito-express');
const AWS = require('aws-sdk');


const awsInit = () => {
  let dynamoDb;
  let cognitoExpress;
  if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
    console.log(dynamoDb);
  } else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
    cognitoExpress = new CognitoExpress({
      region: 'us-west-2',
      cognitoUserPoolId: process.env.user_pool_id,
      tokenUse: 'id', // Possible Values: access | id
      tokenExpiration: 3600000, // Up to default expiration of 1 hour (3600000 ms)
    });
  };
  return {dynamoDb, cognitoExpress};
}

module.exports = {awsInit}