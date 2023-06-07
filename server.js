const express = require('express');
const app = express();
const fs = require('fs');

const parentData = require('./parent.json');
const childData = require('./child.json');

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/parents', (req, res) => {
  const { page = 1, pageSize = 2 } = req.query;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + Number(pageSize);
  const paginatedParents = parentData.slice(startIndex, endIndex);
  
  const parentsWithTotalPaidAmount = paginatedParents.map((parent) => {
    const totalPaidAmount = childData
      .filter((child) => child.parentId === parent.id)
      .reduce((sum, child) => sum + child.paidAmount, 0);
    return { ...parent, totalPaidAmount };
  });

  res.json({ data: parentsWithTotalPaidAmount });
});

app.get('/api/child', (req, res) => {
  const { parentId } = req.query;
  const childTransactions = childData.filter((child) => child.parentId === Number(parentId));
  res.json(childTransactions);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
