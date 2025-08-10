const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let todos = []; 

app.get('/', (req, res) => {
  const filter = req.query.priority || '';
  const filtered = filter ? todos.filter(todo => todo.priority === filter) : todos;

  res.render("list", {
    todos: filtered,
    allTodos: todos,
    error: null,
    editingIndex: null,
    selectedPriority: filter
  });
});

app.post('/', (req, res) => {
  const { task, priority } = req.body;
  if (!task || task.trim() === "") {
    const filter = '';
    const filtered = todos;
    return res.render("list", {
      todos: filtered,
      allTodos: todos,
      error: "Task cannot be empty!",
      editingIndex: null,
      selectedPriority: filter
    });
  }
  todos.push({ task: task.trim(), priority, done: false });
  res.redirect('/');
});


app.post('/toggle', (req, res) => {
    const index = parseInt(req.body.index);
    if (!isNaN(index) && todos[index]) {
        todos[index].done = !todos[index].done;
    }
    res.redirect('/');
});

app.post('/edit-mode', (req, res) => {
  const index = parseInt(req.body.index);
  const priorityFilter = req.body.filter || '';

  const filteredTodos = priorityFilter
    ? todos.filter(todo => todo.priority === priorityFilter)
    : todos;

  res.render("list", {
    todos: filteredTodos,
    allTodos: todos,
    error: null,
    editingIndex: index,
    selectedPriority: priorityFilter
  });
});


app.post('/edit', (req, res) => {
  const { index, updatedTask } = req.body;
  const i = parseInt(index);
  if (!isNaN(i) && updatedTask.trim()) {
    todos[i].task = updatedTask.trim();
  }
  res.redirect('/');
});

app.post('/delete', (req, res) => {
    const index = parseInt(req.body.index);
    if (!isNaN(index)) {
        todos.splice(index, 1);
    }
    res.redirect('/');
});

app.listen(8000, () => console.log("Server is running"));
