# 503020 API
*Budgeting the way people actually budget*

**Installation:**

*Prerequisites:*

NodeJS, NPM

Serverless Framework:

`npm i -g serverless`

**Clone the repository, run:**

`npm i`

run `sls offline start.` This should start a local dynamoDB instance, as well as a local API Gateway, which bypasses authorization for local testing. **API endpoints run from localhost:3000."

***API endpoints***

```
POST /createBudget
{
  "userId": "userId,
  "budgetName": "budgetName",
}

On 200, returns same params.
```
