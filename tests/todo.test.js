const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadTodos, saveTodos, addTodo, listTodos, markDone, deleteTodo } = require('../src/todo');

function tmpFile() {
  return path.join(os.tmpdir(), `todos-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
}

describe('loadTodos', () => {
  test('returns empty array when file does not exist', () => {
    const result = loadTodos('/tmp/nonexistent-todos.json');
    expect(result).toEqual([]);
  });

  test('returns parsed array from existing file', () => {
    const fp = tmpFile();
    fs.writeFileSync(fp, JSON.stringify([{ id: 1, text: 'test', done: false, createdAt: '2026-01-01T00:00:00.000Z' }]));
    const result = loadTodos(fp);
    expect(result).toEqual([{ id: 1, text: 'test', done: false, createdAt: '2026-01-01T00:00:00.000Z' }]);
    fs.unlinkSync(fp);
  });
});

describe('addTodo', () => {
  test('adds a todo to an empty list', () => {
    const fp = tmpFile();
    const todo = addTodo(fp, 'Buy milk');
    expect(todo.id).toBe(1);
    expect(todo.text).toBe('Buy milk');
    expect(todo.done).toBe(false);
    expect(todo.createdAt).toBeDefined();
    const todos = loadTodos(fp);
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('Buy milk');
    fs.unlinkSync(fp);
  });

  test('auto-increments id', () => {
    const fp = tmpFile();
    addTodo(fp, 'First');
    const second = addTodo(fp, 'Second');
    expect(second.id).toBe(2);
    fs.unlinkSync(fp);
  });
});

describe('listTodos', () => {
  test('returns all todos', () => {
    const fp = tmpFile();
    addTodo(fp, 'One');
    addTodo(fp, 'Two');
    const todos = listTodos(fp);
    expect(todos).toHaveLength(2);
    expect(todos[0].text).toBe('One');
    expect(todos[1].text).toBe('Two');
    fs.unlinkSync(fp);
  });
});

describe('markDone', () => {
  test('marks a todo as done', () => {
    const fp = tmpFile();
    addTodo(fp, 'Test task');
    const result = markDone(fp, 1);
    expect(result.done).toBe(true);
    const todos = loadTodos(fp);
    expect(todos[0].done).toBe(true);
    fs.unlinkSync(fp);
  });

  test('returns null for nonexistent id', () => {
    const fp = tmpFile();
    const result = markDone(fp, 99);
    expect(result).toBeNull();
  });
});

describe('deleteTodo', () => {
  test('removes a todo by id', () => {
    const fp = tmpFile();
    addTodo(fp, 'To delete');
    const deleted = deleteTodo(fp, 1);
    expect(deleted.text).toBe('To delete');
    const todos = loadTodos(fp);
    expect(todos).toHaveLength(0);
    fs.unlinkSync(fp);
  });

  test('returns null for nonexistent id', () => {
    const fp = tmpFile();
    const result = deleteTodo(fp, 99);
    expect(result).toBeNull();
  });
});
