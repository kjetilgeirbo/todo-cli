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

module.exports = { loadTodos, saveTodos, addTodo, listTodos };
