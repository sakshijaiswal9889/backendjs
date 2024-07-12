// Importing necessary modules
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to read data from db.json
const readData = () => {
  const data = fs.readFileSync('db.json', 'utf-8');
  return JSON.parse(data);
};

// Function to write data to db.json
const writeData = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

// API to get all todos
app.get('/todos', (req, res) => {
  const data = readData();
  res.json(data.todos);
});

// API to add a new todo
app.post('/todos', (req, res) => {
  const data = readData();
  const newTodo = {
    id: data.todos.length + 1,
    title: req.body.title,
    status: false
  };
  data.todos.push(newTodo);
  writeData(data);
  res.status(201).json(newTodo);
});

// API to update the status of todos with even IDs
app.put('/todos/update-even-status', (req, res) => {
  const data = readData();
  data.todos.forEach(todo => {
    if (todo.id % 2 === 0 && !todo.status) {
      todo.status = true;
    }
  });
  writeData(data);
  res.json(data.todos);
});

// API to delete todos with status true
app.delete('/todos/delete-true', (req, res) => {
  let data = readData();
  data.todos = data.todos.filter(todo => !todo.status);
  writeData(data);
  res.json(data.todos);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
