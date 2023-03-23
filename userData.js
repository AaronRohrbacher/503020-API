const serverless = require('serverless-http');
const express = require('express');
const app = express();
const CognitoExpress = require('cognito-express');
const AWS = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
let cognitoExpress;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
  userData = {
    email: 'offlineUser@offline.com',
    firstName: 'Aaron',
    lastName: 'Rohrbacher',
  };
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
  cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: process.env.user_pool_id,
    tokenUse: 'id', // Possible Values: access | id
    tokenExpiration: 3600000, // Up to default expiration of 1 hour (3600000 ms)
  });
}

const totalBudget = (budgetItems) => {
  let total = 0;
  budgetItems.forEach((item) => {
    total += item.cost;
  });
  return total;
};

app.post('/userData', (req, res) => {
  res.json(req.requestContext.authorizer.claims);
});

app.post('/userBudgets', (req, res) => {
  console.log(dynamoDb);
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
      res.status(400).json(error);
    }
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({error: 'budgets not found'});
    }
  });
});

app.post('/budgets', (req, res) => {
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
      return res.status(400).json(error);
    }
    res.json({userId, budgetName});
  });
});

app.post('/budgetItem', (req, res) => {
  const {budgetId, name, cost, dueDate} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Item: {
      id: (Date.now() + Math.random()).toString(),
      budgetId: budgetId,
      name: name,
      cost: cost,
      dueDate: dueDate,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.post('/budgetItems', (req, res) => {
  const {budgetId} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    IndexName: 'budgetId',
    KeyConditionExpression: 'budgetId = :budgetId',
    ExpressionAttributeValues: {
      ':budgetId': budgetId,
    },
  };
  dynamoDb.query(params, (error, result) => {
    response = {
      BudgetItems: result.Items,
      budgetTotal: totalBudget(result.Items),
    };
    return res.json(response);
  });
});

module.exports.handler = serverless(app);
