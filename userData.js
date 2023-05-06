const serverless = require('serverless-http');
const express = require('express');
const app = express();
const CognitoExpress = require('cognito-express');
const AWS = require('aws-sdk');
const moment = require('moment');
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
let cognitoExpress;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
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

const totalByPayPeriod = (budgetItems) => {
  let pre15Total = 0;
  let post15Total = 0;
  budgetItems.forEach((item) => {
    if (item.dueDate < 15) {
      pre15Total += item.cost;
    } else {
      post15Total += item.cost;
    }
  });
  return {
    pre15Total: pre15Total,
    post15Total: post15Total,
  };
};

const getCurrentMonth = () => {
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return month[new Date().getMonth()];
};

const numberOfDaysUntilNextPay = () => {
  if (moment().date() < 15) {
    const the15th = moment([moment().year(), moment().month(), 15]);
    const currentDate = moment([moment().year(), moment().month(), moment().date()]);
    return the15th.diff(currentDate, 'days');
  } else {
    const lastDayOfTheMonth = moment(moment().endOf('month'));
    const currentDate = moment([moment().year(), moment().month(), moment().date()]);
    return lastDayOfTheMonth.diff(currentDate, 'days') + 1;
  }
};

const currentBalance = (budgetItems) => {
  let id = 0;
  let balance;
  budgetItems.forEach((item) => {
    if (item.balance && item.id > id) {
      id = item.id;
      balance = item.balance;
    }
  });
  return balance;
};

app.post('/userData', (req, res) => {
  res.json(req.requestContext.authorizer.claims);
});

app.post('/createBudget', (req, res) => {
  const {userId, budgetName, currentBankBalance} = JSON.parse(req.apiGateway.event.body);
  const id = (Date.now() + Math.random()).toString();
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Item: {
      id: id,
      userId: userId,
      budgetName: budgetName,
      currentBankBalance: currentBankBalance,
      type: 'budget',
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json(error);
    }
    res.json({params});
  });
});

app.post('/readBudgets', (req, res) => {
  console.log(dynamoDb);
  const {userId} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    IndexName: 'userId',
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

app.post('/updateBudget', (req, res) => {
  const {id, userId, budgetName, currentBankBalance} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    // UpdateExpression : "SET",
    Key: {
      id: id,
    },
    Item: {
      id: id,
      userId: userId,
      budgetName: budgetName,
      currentBankBalance: currentBankBalance,
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

app.delete('/deleteBudget', (req, res) => {
  const {id, budgetName} = JSON.parse(req.apiGateway.event.body);
  const params = {
    Key: {
      id: id,
      budgetName: budgetName,
    },
    TableName: process.env.BUDGET_ITEMS_TABLE,
  };
  dynamoDb.delete(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.post('/createBudgetItem', (req, res) => {
  const {budgetId, name, cost, dueDate, balance} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Item: {
      id: (Date.now() + Math.random()).toString(),
      budgetId: budgetId,
      name: name,
      cost: cost,
      dueDate: dueDate,
      balance: balance,
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

app.post('/readBudgetItems', (req, res) => {
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
      totalByPayPeriod: totalByPayPeriod(result.Items),
      currentMonth: getCurrentMonth(),
      numberOfDaysUntilNextPay: numberOfDaysUntilNextPay(),
      currentBalance: currentBalance(result.Items),
      dailyBudget: currentBalance(result.Items)/numberOfDaysUntilNextPay(),
    };
    return res.json(response);
  });
});

app.post('/updateBudgetItem', (req, res) => {
  const {id, budgetId, name, cost, dueDate, balance} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    // UpdateExpression : "SET",
    Key: {
      id: id,
    },
    Item: {
      id: id,
      budgetId: budgetId,
      name: name,
      cost: cost,
      dueDate: dueDate,
      balance: balance,
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

app.delete('/deleteBudgetItem', (req, res) => {
  const {id} = JSON.parse(req.apiGateway.event.body);
  const params = {
    Key: {
      id: id,
    },
    TableName: process.env.BUDGET_ITEMS_TABLE,
  };
  dynamoDb.delete(params, (error) => {
    if (error) {
      console.log(error);
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

module.exports.handler = serverless(app);
