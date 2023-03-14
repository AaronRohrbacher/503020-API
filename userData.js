const serverless = require('serverless-http');
const express = require('express');
const app = express();
const IS_OFFLINE = process.env.IS_OFFLINE;
import awsInit from './awsInitializers/cognitoDynamo'

const {dynamoDb, cognitoExpress} = awsInit();

app.post('/userBudgets', function(req, res) {
  const {userId} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGETS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json( 'FUCK' );
    }
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({error: 'budgets not found'});
    }
  });
});

app.post('/budgets', function(req, res) {
  const {userId, budgetName} = JSON.parse(req.apiGateway.event.body);
  if (typeof userId !== 'string') {
    console.log(userId);
    return res.status(400).json({error: '"userId" must be a string'});
  } else if (typeof budgetName !== 'string') {
    return res.status(400).json({error: '"name" must be a string'});
  }
  const params = {
    TableName: process.env.BUDGETS_TABLE,
    Item: {
      userId: userId,
      budgetName: budgetName,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json( budgetName );
    }
    res.json({userId, budgetName});
  });
});

module.exports.handler = serverless(app);
