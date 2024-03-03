#!/usr/bin/node

const axios = require('axios');
items = [
  {
    "budgetId": "1709447807201.0083",
    "cost": 85,
    "pending": false,
    "dueDate": "1",
    "name": "Internet"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 1600,
    "pending": false,
    "dueDate": "1",
    "name": "Rent"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 45,
    "pending": false,
    "dueDate": "10",
    "name": "Electricity"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 50,
    "pending": false,
    "dueDate": "11",
    "name": "Milestone2"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 130,
    "pending": false,
    "dueDate": "15",
    "name": "Cell"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 10,
    "pending": false,
    "dueDate": "15",
    "name": "Spotify"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 100,
    "pending": false,
    "dueDate": "15",
    "name": "Avenue 5"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 10,
    "pending": false,
    "dueDate": "16",
    "name": "Dashpass"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 14.99,
    "pending": false,
    "dueDate": "16",
    "name": "Amazon"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 40,
    "pending": false,
    "dueDate": "16",
    "name": "Milestone"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 35,
    "pending": false,
    "dueDate": "18",
    "name": "Merrick Bank"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 40,
    "pending": false,
    "dueDate": "19",
    "name": "Mission Lane"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 0,
    "pending": false,
    "dueDate": "19",
    "name": "Renter's insurance"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 40,
    "pending": false,
    "dueDate": "21",
    "name": "Indigo"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 30,
    "pending": false,
    "dueDate": "22",
    "name": "Credit One"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 17,
    "pending": false,
    "dueDate": "240",
    "name": "Car Insurance"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 353.35,
    "pending": false,
    "dueDate": "28",
    "name": "Ally Auto"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 25,
    "pending": false,
    "dueDate": "7",
    "name": "avant"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 250,
    "pending": false,
    "dueDate": "8",
    "name": "cleaning"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 688,
    "pending": false,
    "dueDate": "8",
    "name": "Mover"
  },
  {
    "budgetId": "1709447807201.0083",
    "cost": 1699,
    "pending": false,
    "dueDate": "8",
    "name": "Deposit"
  }
]

items.forEach((item) => {
  item.dueDate = parseInt(item.dueDate)
  console.log(JSON.stringify(item));
  axios({
    method: 'post',
    url: 'https://raluhmgk8l.execute-api.us-west-2.amazonaws.com/dev/createBudgetItem',
    data: JSON.stringify(item),
    headers: {
      Authorization: "eyJraWQiOiJMczRTQmFlQ0pSOVlWVmh3eHhyQ0U1eUZ2dGdnaGFHNmxUZWErVGd4N3VFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2YTdmNmQ4YS05NWMxLTQ3NWUtOGVhOC04YTAzMDQyNDU4ODAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfalJ3Z1lWZzFsIiwiY29nbml0bzp1c2VybmFtZSI6IjZhN2Y2ZDhhLTk1YzEtNDc1ZS04ZWE4LThhMDMwNDI0NTg4MCIsIm9yaWdpbl9qdGkiOiIyZjUzMTYwZS1hNjAwLTQ2OWQtOTFiNi0yMjAxNjZkZjMwNWUiLCJhdWQiOiI1YTZ1dGJtY2tzbG9uM2d0bTQ5aHJwODkxIiwiZXZlbnRfaWQiOiIxZTA4NWUwZS1iNzNmLTQ2NWYtOTIxNy05NzdjZDM1NDRjYWIiLCJjdXN0b206Zmlyc3ROYW1lIjoiQWFyb24iLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwOTQ0NzcyMCwiZXhwIjoxNzA5NDY1NzIwLCJpYXQiOjE3MDk0NDc3MjAsImp0aSI6IjhkZGE1OGY2LTJiMmUtNDhhOC04Y2Q3LTZiYTdjYjBlYTdkYSIsImVtYWlsIjoiYUBhLmNvbSJ9.fy5NdqWpGwMn5Mx6t06Xoi8a5N7HltNh3hP3sHLMZ2OEXi9KPO_6VCB53mwAcIlEuMUpDwfH78I9fUAOZYA3aZhJGvxduEbJ30CSFgSxrVYC66utvV2aB6fgdOFQMvFbGLar-ESwO_m3I1hOAb8e5HFwYvSb5-srljFM9bWMzI_l3ruJyDInAkCCFf6HtuO9atvSAk-t_pau6NyyxAyNmO6Ydu5OtM5dGfjdwTq2glm1lgHRfgHFxZFgBInhtmsYO8ZYgn5zdYFEJuD0IvS1ld6xKp3O7kgH9L_skv276BBL_v_FSVHbzo4EMjIHIpRZbUCdaB6tbdg-MI8RBuP9sw"
    }
  });
});
