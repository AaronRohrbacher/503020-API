const serverless = require('serverless-http');
const express = require('express'),
  CognitoExpress = require('cognito-express')
const app = express()
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
let cognitoExpress;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
  cognitoExpress = new CognitoExpress({
    region: "us-west-2",
    cognitoUserPoolId: process.env.user_pool_id,
    tokenUse: "id", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
  });

};


app.post('/', function (req, res) {
  const params = {
    TableName: process.env.BUDGETS_TABLE,
    Key: {
      budgetId: req.params.budgetId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get budgets' });
    }
    if (result.Item) {
      const { budgetName } = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "budgets not found" });
    }
  });
})

app.post('/budgets', function (req, res) {
  const { userId, budgetName } = req.body;
  if (typeof userId !== 'string') {
    console.log(userId)
    return res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    return res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: "budgetsTable",
    Item: {
      userId: userId,
      budgetName: budgetName,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json( error );
    }
    res.json({ userId, budgetName });
  });
});



module.exports.handler = serverless(app);