# 503020 API
*Budgeting the way people actually budget*

**Installation:**

*Prerequisites:*

NodeJS/NPM, Java Runtime Environment, AWS CLI

Serverless Framework:

`npm i -g serverless`

**Clone the repository, run:**

`npm i`

run `sls offline start.` This should start a local dynamoDB instance, as well as a local API Gateway, which bypasses authorization for local testing. **API endpoints run from localhost:3000.**

***API endpoints***

```
POST /createBudget
{
  "userId": string,
  "budgetName": string
}

On 200, returns same params.
```

```
POST /readBudgets
{
  "userId": string
}

=>

list of user budgets
```

```
POST /updateBudget
{
  "id": string,
  "userId": string,
  "budgetName": string
}

=> on 200, returns same params
```

```
DELETE /deleteBudget
{
  "id": string,
  "budgetName": string
}

=> on 200, returns same params
```

```
POST /createBudgetItem
{
  "budgetId": string,
  "name": string,
  "cost": float,
  "dueDate": integer (1-31, day of month),
  "balance": float (ONLY USED IF UPDATING BANK BALANCE. IN THIS CASE, SEND ONLY itemId and new balance. Issue is open to make this suck less.)
}

=> on 200, returns same params

```

```
POST /readBudgetItems
{
  "budgetId": string
}
=>
{
  BudgetItems: result.Items,
  budgetTotal: totalBudget(result.Items),
  totalByPayPeriod: totalByPayPeriod(result.Items),
  currentMonth: getCurrentMonth(),
  numberOfDaysUntilNextPay: numberOfDaysUntilNextPay(),
  currentBalance: currentBalance(result.Items),
  dailyBudget: currentBalance(result.Items)/numberOfDaysUntilNextPay(),
}
```

```
POST /updateBudgetItem
{
  "id": string,
  "budgetId": string
  "name": string
  "cost": float (bigdecimal)
  "duedate": integer (1-31, day of month)
}

=> on 200, returns same params
```

```
DELETE /deleteBudgetItem
{
  "id": string
}

=> on 200, returns same params
```

