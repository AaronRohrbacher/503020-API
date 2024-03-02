const serverless = require('serverless-http');
const express = require('express');
const app = express();
const CognitoExpress = require('cognito-express');
const AWS = require('aws-sdk');
const moment = require('moment');
const cors = require('cors');
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
let cognitoExpress;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
// } else {
//   app.use(cors({origin: `https://${process.env.STAGE_NAME}.bludget.com`}));
//   dynamoDb = new AWS.DynamoDB.DocumentClient();
//   cognitoExpress = new CognitoExpress({
//     region: 'us-west-2',
//     cognitoUserPoolId: process.env.user_pool_id,
//     tokenUse: 'id', // Possible Values: access | id
//     tokenExpiration: 3600000, // Up to default expiration of 1 hour (3600000 ms)
//   });
}

const totalBudget = (budgetItems) => {
  let total = 0;
  budgetItems.forEach((item) => {
    total += item.cost;
  });
  return parseFloat(total);
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
    wholeMonthTotal: pre15Total + post15Total,
  };
};

const determinePayPeriod = () => {
  return moment().date() >= 15 ? 15 : 1
}

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

const expectedIncome = (budget) => {
  return budget.expectedPaycheckAmount * 2;
};

const getBudget = async (budgetId) => {
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': budgetId,
    },
    Key: {
      id: budgetId,
    },
  };
  let data;
  try {
    data = await dynamoDb.query(params).promise();
  } catch (error) {
    throw new Error(error);
  }
  return data.Items[0];
};

const pendingItemBalance = (budgetItems) => {
  let pendingBalance = 0;
  budgetItems.forEach((item) => {
    if (item.pending === true) {
      pendingBalance += item.cost;
    }
  });
  return pendingBalance;
};

const paidItemBalance = (budgetItems) => {
  let paidBalance = 0;
  budgetItems.forEach((item) => {
    if (item.paid === true) {
      paidBalance += item.cost;
    }
  });
  console.log(paidBalance)
  return paidBalance;
}

app.post(`${process.env.BASE_URL}/userData`, (req, res) => {
  res.json(req.requestContext.authorizer.claims);
});

app.post(`${process.env.BASE_URL}/createBudget`, (req, res) => {
  const {userId, budgetName, currentBankBalance, expectedPaycheckAmount} = JSON.parse(req.apiGateway.event.body);
  const id = (Date.now() + Math.random()).toString();
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Item: {
      id: id,
      userId: userId,
      budgetName: budgetName,
      currentBankBalance: currentBankBalance,
      type: 'budget',
      expectedPaycheckAmount: expectedPaycheckAmount,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.json({params});
  });
});

app.post(`${process.env.BASE_URL}/readBudget`, (req, res) => {
  const {id} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
    Key: {
      id: id,
    },
  };
  dynamoDb.query(params, (error, result) => {
    if (error) {
      res.status(400).json(error);
    }
    if (result) {
      res.json(result);
    }
  });
});

app.post(`${process.env.BASE_URL}/readBudgets`, (req, res) => {
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
    // if (error) {
    //   res.status(400).json(error);
    // }
    // if (result) {
    res.json(result);
    // } else {
    // res.status(404).json({error: 'budgets not found'});
    // }
  });
});

app.post(`${process.env.BASE_URL}/updateBudget`, (req, res) => {
  const {id, userId, budgetName, currentBankBalance, expectedPaycheckAmount} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Key: {
      id: id,
    },
    Item: {
      id: id,
      userId: userId,
      budgetName: budgetName,
      currentBankBalance: currentBankBalance,
      expectedPaycheckAmount: expectedPaycheckAmount,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.delete(`${process.env.BASE_URL}/deleteBudget`, (req, res) => {
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
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.post(`${process.env.BASE_URL}/createBudgetItem`, (req, res) => {
  console.log(req)
  const {budgetId, name, cost, dueDate, balance, pending, paid} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    Item: {
      id: (Date.now() + Math.random()).toString(),
      budgetId: budgetId,
      name: name,
      cost: parseFloat(cost),
      dueDate: dueDate,
      balance: balance,
      pending: pending,
      paid: paid,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.post(`${process.env.BASE_URL}/readBudgetItem`, (req, res) => {
  const {id} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
    Key: {
      id: id,
    },
  };
  dynamoDb.query(params, (error, result) => {
    if (error) {
      res.status(400).json(error);
    }
    if (result) {
      res.json(result);
    }
  });
});

app.post(`${process.env.BASE_URL}/readBudgetItems`, (req, res) => {
  const {budgetId} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
    IndexName: 'budgetId',
    KeyConditionExpression: 'budgetId = :budgetId',
    ExpressionAttributeValues: {
      ':budgetId': budgetId,
    },
  };
  getBudget(budgetId).then((budget) => {
    dynamoDb.query(params, (error, result) => {
      const perPeriod = totalByPayPeriod(result.Items);
      let period
      determinePayPeriod() < 15 ? period = perPeriod.pre15Total : period = perPeriod.post15Total;
      const paidBalance = paidItemBalance(result.Items)
      response = {
        BudgetItems: result.Items,
        budgetTotal: "$" + totalBudget(result.Items).toFixed(2),
        pre15Total: "$" + perPeriod.pre15Total.toFixed(2),
        post15Total: "$" + perPeriod.post15Total.toFixed(2),
        currentMonth: getCurrentMonth(),
        numberOfDaysUntilNextPay: numberOfDaysUntilNextPay(),
        dailyBudget: "$" + ((budget.currentBankBalance - period + paidBalance) / numberOfDaysUntilNextPay()).toFixed(2),
        bankBalance: "$" + parseFloat(budget.currentBankBalance).toFixed(2),
        estimatedMonthlyDailySpending: "$" + ((expectedIncome(budget) - perPeriod.wholeMonthTotal) / 31).toFixed(2),
        expectedIncome: "$" + expectedIncome(budget).toFixed(2),
        pendingItemBalance: "$" + pendingItemBalance(result.Items).toFixed(2),
        paidItemBalance: "$" + paidBalance.toFixed(2)
      };
      return res.json(response);
    });
  });
});

app.post(`${process.env.BASE_URL}/updateBudgetItem`, (req, res) => {
  const {id, budgetId, name, cost, dueDate, balance, pending, paid} = JSON.parse(req.apiGateway.event.body);
  const params = {
    TableName: process.env.BUDGET_ITEMS_TABLE,
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
      pending: pending,
      paid: paid,
    },
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

app.delete(`${process.env.BASE_URL}/deleteBudgetItem`, (req, res) => {
  const {id} = JSON.parse(req.apiGateway.event.body);
  const params = {
    Key: {
      id: id,
    },
    TableName: process.env.BUDGET_ITEMS_TABLE,
  };
  dynamoDb.delete(params, (error) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.json(params);
  });
});

module.exports.handler = serverless(app);
module.exports = {determinePayPeriod}

