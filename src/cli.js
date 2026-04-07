const { Command } = require('commander');
const path = require('path');
const { addTodo, listTodos, markDone, deleteTodo } = require('./todo');
const { formatList, formatEmpty, formatAdd, formatDone, formatDelete, formatError } = require('./display');

const TODO_FILE = path.join(process.cwd(), 'todos.json');

const program = new Command();

program
  .name('todo')
  .description('A simple CLI todo app')
  .version('1.0.0');

program
  .command('add <text>')
  .description('Add a new todo')
  .action((text) => {
    const todo = addTodo(TODO_FILE, text);
    console.log(formatAdd(todo));
  });

program
  .command('list')
  .description('List all todos')
  .action(() => {
    const todos = listTodos(TODO_FILE);
    if (todos.length === 0) {
      console.log(formatEmpty());
    } else {
      console.log(formatList(todos));
    }
  });

program
  .command('done <id>')
  .description('Mark a todo as done')
  .action((id) => {
    const todo = markDone(TODO_FILE, parseInt(id, 10));
    if (!todo) {
      console.error(formatError(id));
      process.exit(1);
    }
    console.log(formatDone(todo));
  });

program
  .command('delete <id>')
  .description('Delete a todo')
  .action((id) => {
    const todo = deleteTodo(TODO_FILE, parseInt(id, 10));
    if (!todo) {
      console.error(formatError(id));
      process.exit(1);
    }
    console.log(formatDelete(todo));
  });

program.parse(process.argv);
