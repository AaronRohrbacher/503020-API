#!/usr/bin/node

const axios = require('axios');
items = [
  {
    "budgetId": "1709434314802.641",
    "cost": 85,
    "pending": false,
    "dueDate": "1",
    "id": "1709434424990.091",
    "name": "Internet"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 1600,
    "pending": false,
    "dueDate": "1",
    "id": "1709434365908.3157",
    "name": "Rent"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 45,
    "pending": false,
    "dueDate": "10",
    "id": "1709434482836.2664",
    "name": "Electricity"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 50,
    "pending": false,
    "dueDate": "11",
    "id": "1709434517055.015",
    "name": "Milestone2"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 130,
    "pending": false,
    "dueDate": "15",
    "id": "1709434543566.4314",
    "name": "Cell"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 10,
    "pending": false,
    "dueDate": "15",
    "id": "1709434598436.1978",
    "name": "Spotify"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 100,
    "pending": false,
    "dueDate": "15",
    "id": "1709434627019.4026",
    "name": "Avenue 5"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 10,
    "pending": false,
    "dueDate": "16",
    "id": "1709434686464.11",
    "name": "Dashpass"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 14.99,
    "pending": false,
    "dueDate": "16",
    "id": "1709434706700.6619",
    "name": "Amazon"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 40,
    "pending": false,
    "dueDate": "16",
    "id": "1709434740117.9294",
    "name": "Milestone"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 35,
    "pending": false,
    "dueDate": "18",
    "id": "1709434776065.269",
    "name": "Merrick Bank"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 40,
    "pending": false,
    "dueDate": "19",
    "id": "1709434860685.8813",
    "name": "Mission Lane"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 0,
    "pending": false,
    "dueDate": "19",
    "id": "1709434793874.2073",
    "name": "Renter's insurance"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 40,
    "pending": false,
    "dueDate": "21",
    "id": "1709434875025.1174",
    "name": "Indigo"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 30,
    "pending": false,
    "dueDate": "22",
    "id": "1709434888116.3108",
    "name": "Credit One"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 17,
    "pending": false,
    "dueDate": "240",
    "id": "1709434756043.5505",
    "name": "Car Insurance"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 353.35,
    "pending": false,
    "dueDate": "28",
    "id": "1709434905768.42",
    "name": "Ally Auto"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 25,
    "pending": false,
    "dueDate": "7",
    "id": "1709434451647.8499",
    "name": "avant"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 250,
    "pending": false,
    "dueDate": "8",
    "id": "1709434954026.8438",
    "name": "cleaning"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 688,
    "pending": false,
    "dueDate": "8",
    "id": "1709434946089.5864",
    "name": "Mover"
  },
  {
    "budgetId": "1709434314802.641",
    "cost": 1699,
    "pending": false,
    "dueDate": "8",
    "id": "1709434933039.2937",
    "name": "Deposit"
  }
]

items.forEach((item) => {
  item.dueDate = parseInt(item.dueDate)
  console.log(item);
  axios({
    method: 'post',
    url: 'https://94j3vbm2if.execute-api.us-west-2.amazonaws.com/dev/updateBudgetItem',
    data: JSON.stringify(item),
    headers: {
      Authorization: "eyJraWQiOiJGNFhPbE44bG0xZHR4ZlNjODRVUUhFWEl0T2tRK3dBXC9SKytSaStJNEJTTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxZjk5ZWNmYS1jNTI1LTRkNWItOWM5MC1lNmE3NmU4MzZmZjciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfRE1MTVd2S25GIiwiY29nbml0bzp1c2VybmFtZSI6IjFmOTllY2ZhLWM1MjUtNGQ1Yi05YzkwLWU2YTc2ZTgzNmZmNyIsIm9yaWdpbl9qdGkiOiJjZDdmNTIwMi1hZjE0LTQ4ZGYtYmZmZC04ZDUzY2NjNzEyYTQiLCJhdWQiOiJqMzlhdnFxcTlkZ2I4b3YwZ2ZwYW1lYTJwIiwiZXZlbnRfaWQiOiIyMDFiMTcwNS00NDMzLTQyZTYtYmUzNy05ZTljNGU1ZmRmMjYiLCJjdXN0b206Zmlyc3ROYW1lIjoiQWFyb24iLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwOTQ0MTk3NywiZXhwIjoxNzA5NDU5OTc3LCJpYXQiOjE3MDk0NDE5NzcsImp0aSI6ImFjYmIzOTE3LTIyOTQtNDhkOS05NWExLTM3YTE4NzU3ZGU5NiIsImVtYWlsIjoiYUBhLmNvbSJ9.k8b9YNGILMbFLh2B3XffDB6tckgZ3WWSkF5uAh9c4Gi87qChvuMKN14IeNC184FCxl25YZxKwTR_mR0ctNgD9Ja7wG0MvWRAszWa44YfwWKsP3iX81WzPRTgWxG8FdqrV-_dpQ4NmjcQ1Caiw-oWVQ-veTCz57NU76Fel6DruLtWIZlD9rBX9DC1rhA-RX6xRa2MhJwyHCxEdm6WpeqIipBITJXAYzggoUIamVgqT39mRMCwEbdfkB_Vqg5T4fEpe_YCiLqAq-dTl8UzYzk7X-MLSGpGDErmELpGX3GPIQE1yRHwfhJAFUh03Cv6YoeYgyt-X2TcwA0xNwz2OmSPEg"
    }
  });
});
