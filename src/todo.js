const fs = require('fs');

function loadTodos(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTodos(filePath, todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

function addTodo(filePath, text) {
  const todos = loadTodos(filePath);
  const maxId = todos.reduce((max, t) => Math.max(max, t.id), 0);
  const todo = {
    id: maxId + 1,
    text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  saveTodos(filePath, todos);
  return todo;
}

function listTodos(filePath) {
  return loadTodos(filePath);
}

function markDone(filePath, id) {
  const todos = loadTodos(filePath);
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;
  todo.done = true;
  saveTodos(filePath, todos);
  return todo;
}

function deleteTodo(filePath, id) {
  const todos = loadTodos(filePath);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return null;
  const [deleted] = todos.splice(index, 1);
  saveTodos(filePath, todos);
  return deleted;
}

module.exports = { loadTodos, saveTodos, addTodo, listTodos, markDone, deleteTodo };
