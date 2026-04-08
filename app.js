// Task 2: pipeline deploy test
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db('lab6');
  console.log('Connected to MongoDB');
}

app.get('/tasks', async (req, res) => {
  const tasks = await db.collection('tasks').find().toArray();
  const grouped = tasks.reduce((acc, task) => {
    (acc[task.status] = acc[task.status] || []).push(task);
    return acc;
  }, {});
  res.json(grouped);
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
});